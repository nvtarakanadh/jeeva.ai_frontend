import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Patient, Doctor, UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: (Patient | Doctor) & { id: string } | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (userData: Partial<Patient | Doctor>, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<Patient | Doctor>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(Patient | Doctor) & { id: string } | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const processingRef = useRef(false);
  const lastProcessedSession = useRef<string | null>(null);
  const authInitialized = useRef(false);

  // Create user data from session
  const createUserFromSession = (session: Session, profile?: any) => {
    const role = profile?.role || (session.user.user_metadata?.role as UserRole) || 'patient';
    
    return {
      id: session.user.id,
      name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
      email: profile?.email || session.user.email || '',
      phone: profile?.phone || '',
      role,
      dateOfBirth: profile?.date_of_birth ? new Date(profile.date_of_birth) : undefined,
      gender: profile?.gender || undefined,
      bloodGroup: profile?.blood_group || undefined,
      allergies: profile?.allergies ? (typeof profile.allergies === 'string' ? JSON.parse(profile.allergies) : profile.allergies) : [],
      emergencyContact: profile?.emergency_contact_name ? {
        name: profile.emergency_contact_name,
        phone: profile.emergency_contact_phone || '',
        relationship: profile.emergency_contact_relationship || ''
      } : undefined,
      ...(role === 'doctor' ? {
        specialization: profile?.specialization || 'General Medicine',
        licenseNumber: profile?.license_number || undefined,
        hospital: profile?.hospital || undefined,
        experience: profile?.experience || 0,
        consultationFee: profile?.consultation_fee || 0,
        availableSlots: profile?.available_slots ? (typeof profile.available_slots === 'string' ? JSON.parse(profile.available_slots) : profile.available_slots) : [],
        rating: profile?.rating || 0,
        totalConsultations: profile?.total_consultations || 0
      } : {})
    };
  };

  // Clear corrupted auth data (more conservative approach)
  const clearCorruptedAuth = () => {
    try {
      // Only clear obviously corrupted data, not all auth data
      const authKeys = Object.keys(localStorage).filter(key => key.startsWith('sb-'));
      authKeys.forEach(key => {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const parsed = JSON.parse(value);
            // Only clear if truly corrupted (missing essential fields)
            if (!parsed.access_token || !parsed.user || !parsed.refresh_token) {
              console.log('🔐 Clearing corrupted auth key:', key);
              localStorage.removeItem(key);
            }
          }
        } catch {
          // Only clear if JSON parsing fails
          console.log('🔐 Clearing unparseable auth key:', key);
          localStorage.removeItem(key);
        }
      });

      // Don't clear session storage unless absolutely necessary
      // sessionStorage.clear();
      
      console.log('🔐 Cleared only corrupted auth data');
    } catch (error) {
      console.error('🔐 Error clearing auth data:', error);
    }
  };

  // Process session with better error handling
  const processSession = async (session: Session) => {
    if (processingRef.current) {
      console.log('🔐 Already processing session, skipping...');
      return;
    }

    const sessionId = `${session.user.id}-${session.expires_at}`;
    if (lastProcessedSession.current === sessionId) {
      console.log('🔐 Session already processed, skipping...');
      return;
    }

    processingRef.current = true;
    lastProcessedSession.current = sessionId;

    try {
      console.log('🔐 Processing session for user:', session.user.email);
      setSession(session);

      // Try to get profile data with timeout
      try {
        const profilePromise = supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        const profileTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
        );
        
        const { data: profile, error: profileError } = await Promise.race([profilePromise, profileTimeoutPromise]) as any;
        
        if (profileError) {
          console.log('🔐 Profile fetch failed, using session metadata:', profileError);
          const userData = createUserFromSession(session);
          setUser(userData);
        } else {
          const userData = createUserFromSession(session, profile);
          setUser(userData);
          console.log('🔐 User data set from profile');
        }
      } catch (profileError) {
        console.log('🔐 Profile fetch failed, using session metadata');
        const userData = createUserFromSession(session);
        setUser(userData);
      }
    } catch (error) {
      console.error('🔐 Error processing session:', error);
      // Clear corrupted data and reset
      clearCorruptedAuth();
      setUser(null);
      setSession(null);
    } finally {
      processingRef.current = false;
      setIsLoading(false);
    }
  };

  // Initialize authentication
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      if (authInitialized.current) {
        console.log('🔐 Auth already initialized, skipping...');
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔐 Initializing auth...');
        authInitialized.current = true;
        
        // Clear any corrupted auth data first
        clearCorruptedAuth();
        
        // Add timeout to prevent hanging
        const authPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth initialization timeout')), 10000)
        );
        
        const { data: { session }, error } = await Promise.race([authPromise, timeoutPromise]) as any;
        
        if (error) {
          console.error('🔐 Auth initialization error:', error);
          if (mounted) {
            clearCorruptedAuth();
            setUser(null);
            setSession(null);
            setIsLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          console.log('🔐 Found existing session:', session.user.email);
          await processSession(session);
        } else if (mounted) {
          console.log('🔐 No existing session found');
          setUser(null);
          setSession(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('🔐 Auth initialization failed:', error);
        if (mounted) {
          clearCorruptedAuth();
          setUser(null);
          setSession(null);
          setIsLoading(false);
        }
      }
    };

    // Set a safety timeout to ensure loading is always set to false
    timeoutId = setTimeout(() => {
      if (mounted && isLoading) {
        console.log('🔐 Safety timeout: forcing loading to false');
        setIsLoading(false);
      }
    }, 15000); // 15 seconds timeout

    initializeAuth();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth state change:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session) {
        await processSession(session);
      } else if (event === 'SIGNED_OUT') {
        console.log('🔐 User signed out');
        setUser(null);
        setSession(null);
        setIsLoading(false);
        clearCorruptedAuth();
        navigate('/login');
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log('🔐 Token refreshed');
        setSession(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string, role: UserRole = 'patient') => {
    try {
      setIsLoading(true);
      console.log('🔐 Attempting login for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('🔐 Login error:', error);
        throw error;
      }

      if (data.session) {
        console.log('🔐 Login successful');
        await processSession(data.session);
        toast({
          title: "Login successful",
          description: `Welcome back, ${data.user.email}!`,
        });
      }
    } catch (error: any) {
      console.error('🔐 Login failed:', error);
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<Patient | Doctor>, password: string) => {
    try {
      setIsLoading(true);
      console.log('🔐 Attempting registration for:', userData.email);

      const { data, error } = await supabase.auth.signUp({
        email: userData.email!,
        password,
        options: {
          data: {
            full_name: userData.name,
            role: userData.role || 'patient',
          },
        },
      });

      if (error) {
        console.error('🔐 Registration error:', error);
        throw error;
      }

      if (data.user) {
        console.log('🔐 Registration successful');
        
        // Create profile
        const profileData = {
          user_id: data.user.id,
          email: userData.email,
          full_name: userData.name,
          phone: userData.phone || '',
          role: userData.role || 'patient',
          date_of_birth: userData.dateOfBirth?.toISOString().split('T')[0] || null,
          gender: userData.gender || null,
          blood_group: userData.bloodGroup || null,
          allergies: userData.allergies ? JSON.stringify(userData.allergies) : '[]',
          emergency_contact_name: userData.emergencyContact?.name || null,
          emergency_contact_phone: userData.emergencyContact?.phone || null,
          emergency_contact_relationship: userData.emergencyContact?.relationship || null,
          ...(userData.role === 'doctor' ? {
            specialization: userData.specialization || 'General Medicine',
            license_number: userData.licenseNumber || null,
            hospital: userData.hospital || null,
            experience: userData.experience || 0,
            consultation_fee: userData.consultationFee || 0,
            available_slots: userData.availableSlots ? JSON.stringify(userData.availableSlots) : '[]',
            rating: 0,
            total_consultations: 0
          } : {})
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (profileError) {
          console.error('🔐 Profile creation error:', profileError);
          throw profileError;
        }

        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      console.error('🔐 Registration failed:', error);
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🔐 Logging out...');
      setIsLoading(true);
      
      // Clear all auth data
      clearCorruptedAuth();
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('🔐 Logout error:', error);
      }
      
      setUser(null);
      setSession(null);
      setIsLoading(false);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      navigate('/login');
    } catch (error) {
      console.error('🔐 Logout failed:', error);
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Patient | Doctor>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      console.log('🔐 Updating profile...');
      
      const dbUpdates: any = {
        full_name: updates.name,
        phone: updates.phone || '',
        date_of_birth: updates.dateOfBirth?.toISOString().split('T')[0] || null,
        gender: updates.gender || null,
        blood_group: updates.bloodGroup || null,
        allergies: updates.allergies ? JSON.stringify(updates.allergies) : '[]',
        emergency_contact_name: updates.emergencyContact?.name || null,
        emergency_contact_phone: updates.emergencyContact?.phone || null,
        emergency_contact_relationship: updates.emergencyContact?.relationship || null,
      };

      if (user.role === 'doctor') {
        dbUpdates.specialization = updates.specialization || 'General Medicine';
        dbUpdates.license_number = updates.licenseNumber || null;
        dbUpdates.hospital = updates.hospital || null;
        dbUpdates.experience = updates.experience || 0;
        dbUpdates.consultation_fee = updates.consultationFee || 0;
        dbUpdates.available_slots = updates.availableSlots ? JSON.stringify(updates.availableSlots) : '[]';
      }

      const { error: updateError } = await (supabase as any)
        .from('profiles')
        .update(dbUpdates as any)
        .eq('id', user!.id);

      if (updateError) {
        console.error('🔐 Profile update error:', updateError);
        throw updateError;
      }

      // Update local user state
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error('🔐 Profile update failed:', error);
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user && !!session,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};