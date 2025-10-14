import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
        hospitalAffiliation: profile?.hospital_affiliation || 'General Hospital',
        verified: profile?.verified || false
      } : {}),
      createdAt: new Date(session.user.created_at),
      updatedAt: new Date(session.user.updated_at),
    } as (Patient | Doctor) & { id: string };
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (mounted) {
            setUser(null);
            setSession(null);
            setIsLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          setSession(session);
          
          // Try to get profile data
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            
            const userData = createUserFromSession(session, profile);
            setUser(userData);
          } catch (profileError) {
            // Fallback to session metadata
            const userData = createUserFromSession(session);
            setUser(userData);
          }
        } else if (mounted) {
          setUser(null);
          setSession(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setUser(null);
          setSession(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (!mounted) return;

        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setIsLoading(false);
          return;
        }

        if (event === 'SIGNED_IN' && session?.user) {
          setSession(session);
          
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            
            const userData = createUserFromSession(session, profile);
            setUser(userData);
            
            // Navigate based on role
            const role = userData.role;
            if (role === 'doctor') {
              navigate('/doctor/dashboard');
            } else {
              navigate('/dashboard');
            }
          } catch (profileError) {
            const userData = createUserFromSession(session);
            setUser(userData);
            
            const role = userData.role;
            if (role === 'doctor') {
              navigate('/doctor/dashboard');
            } else {
              navigate('/dashboard');
            }
          }
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setSession(session);
        } else if (session?.user) {
          setSession(session);
          
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            
            const userData = createUserFromSession(session, profile);
            setUser(userData);
          } catch (profileError) {
            const userData = createUserFromSession(session);
            setUser(userData);
          }
        } else {
          setUser(null);
          setSession(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string, role?: UserRole) => {
    try {
      setIsLoading(true);
      console.log('🔐 Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user && data.session) {
        console.log('✅ Login successful:', data.user.id);
        
        // The auth state change listener will handle setting user and navigation
        toast({
          title: "Login successful",
          description: `Welcome back!`,
        });
      } else {
        throw new Error('No user data returned');
      }

    } catch (error: any) {
      console.error('❌ Login failed:', error);
      toast({
        title: "Login failed",
        description: error.message || 'Invalid credentials. Please try again.',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email!,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: userData.name,
            role: userData.role || 'patient',
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        
        // Create basic user data from session metadata
        const newUserData = {
          id: data.user.id,
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email || '',
          phone: '',
          role: (data.user.user_metadata?.role as UserRole) || 'patient',
          dateOfBirth: undefined,
          gender: undefined,
          bloodGroup: undefined,
          allergies: [],
          emergencyContact: undefined,
          specialization: data.user.user_metadata?.role === 'doctor' ? 'General Medicine' : undefined,
          licenseNumber: undefined,
          hospitalAffiliation: data.user.user_metadata?.role === 'doctor' ? 'General Hospital' : undefined,
          createdAt: new Date(data.user.created_at),
          updatedAt: new Date(data.user.updated_at),
        } as any;
        
        setUser(newUserData);
      }


      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account.",
      });

    } catch (error: any) {
      console.error('Registration failed:', error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // The auth state change listener will handle clearing state and navigation
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Force clear state if Supabase logout fails
      setUser(null);
      setSession(null);
      navigate('/auth');
    }
  };

  const updateProfile = async (updates: Partial<Patient | Doctor>) => {
    if (!user) return;
    
    try {
      
      // First, update the user's email in Supabase Auth if it changed
      if (updates.email && updates.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: updates.email
        });
        
        if (emailError) {
          console.error('Email update error:', emailError);
          throw new Error('Failed to update email: ' + emailError.message);
        }
      }

      // Get the user's profile ID
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError || !profileData) {
        console.error('Profile lookup error:', profileError);
        throw new Error('Profile not found');
      }

      // Prepare the database update object
      const dbUpdates: any = {};
      
      if (updates.name) dbUpdates.full_name = updates.name;
      if (updates.email) dbUpdates.email = updates.email;
      if (updates.phone) dbUpdates.phone = updates.phone;
      
      // Only update Patient-specific fields if the user is a Patient
      if (user.role === 'patient') {
        const patientUpdates = updates as Partial<Patient>;
        
        if (patientUpdates.dateOfBirth) {
          dbUpdates.date_of_birth = patientUpdates.dateOfBirth.toISOString().split('T')[0];
        }
        if (patientUpdates.gender) {
          dbUpdates.gender = patientUpdates.gender;
        }
        if (patientUpdates.bloodType) {
          dbUpdates.blood_group = patientUpdates.bloodType;
        }
        if (patientUpdates.allergies) {
          dbUpdates.allergies = patientUpdates.allergies;
        }
        
        // Handle emergency contact
        if (patientUpdates.emergencyContact) {
          dbUpdates.emergency_contact_name = patientUpdates.emergencyContact.name;
          dbUpdates.emergency_contact_phone = patientUpdates.emergencyContact.phone;
          dbUpdates.emergency_contact_relationship = patientUpdates.emergencyContact.relationship;
        }
      }
      
      // Handle Doctor-specific fields if the user is a Doctor
      if (user.role === 'doctor') {
        const doctorUpdates = updates as Partial<Doctor>;
        
        if (doctorUpdates.specialization) {
          dbUpdates.specialization = doctorUpdates.specialization;
        }
        if (doctorUpdates.licenseNumber) {
          dbUpdates.license_number = doctorUpdates.licenseNumber;
        }
        if (doctorUpdates.hospitalAffiliation) {
          dbUpdates.hospital_affiliation = doctorUpdates.hospitalAffiliation;
        }
        if (typeof doctorUpdates.verified === 'boolean') {
          dbUpdates.verified = doctorUpdates.verified;
        }
      }

      // Update the profile in the database
      const { error: updateError } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', profileData.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw new Error('Failed to update profile: ' + updateError.message);
      }

      // Update local state only after successful database update
      const updatedUser = { ...user, ...updates } as (Patient | Doctor) & { id: string };
      setUser(updatedUser);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Profile update failed:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      throw error; // Re-throw so the calling component can handle it
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  };

  // Remove logging to prevent unnecessary re-renders
  // const prevValues = React.useRef({ isLoading, isAuthenticated: !!user, userRole: user?.role });
  // React.useEffect(() => {
  //   const currentValues = { isLoading, isAuthenticated: !!user, userRole: user?.role };
  //   if (JSON.stringify(prevValues.current) !== JSON.stringify(currentValues)) {
  //     console.log('🔧 AuthContext: State changed', currentValues);
  //     prevValues.current = currentValues;
  //   }
  // }, [isLoading, user]);

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