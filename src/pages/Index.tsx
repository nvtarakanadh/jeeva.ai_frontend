import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Shield, Brain, Users, Activity, Globe, Languages } from 'lucide-react';
import { HeartLogo } from '@/components/HeartLogo';

const Index = () => {
  const { isAuthenticated, user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

  // Remove logging to prevent unnecessary re-renders
  // const prevState = React.useRef({ isAuthenticated, isLoading, userRole: user?.role });
  // React.useEffect(() => {
  //   const currentState = { isAuthenticated, isLoading, userRole: user?.role };
  //   if (JSON.stringify(prevState.current) !== JSON.stringify(currentState)) {
  //     console.log('🔧 Index: State changed', currentState);
  //     prevState.current = currentState;
  //   }
  // }, [isAuthenticated, isLoading, user?.role]);

  // Auto-redirect authenticated users to their appropriate dashboard
  useEffect(() => {
    
    // Only redirect if not loading and user is authenticated
    if (!isLoading && isAuthenticated && user) {
      const redirectPath = user.role === 'doctor' ? '/doctor/dashboard' : '/dashboard';
      
      // Debounce navigation to prevent rapid redirects
      const redirectTimeout = setTimeout(() => {
        navigate(redirectPath);
      }, 100);
      
      return () => clearTimeout(redirectTimeout);
    } else {
    }
  }, [isAuthenticated, user, navigate, isLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary-light relative">
      {/* Language Selector - Top Right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-full shadow-lg border border-border p-1.5 sm:p-2 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Languages className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <Select 
              value={language} 
              onValueChange={(value) => setLanguage(value as any)}
            >
              <SelectTrigger className="w-[120px] sm:w-[140px] border-0 bg-transparent focus:ring-0 h-auto py-1 text-sm sm:text-base font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
                <SelectItem value="te">తెలుగు</SelectItem>
                <SelectItem value="ta">தமிழ்</SelectItem>
                <SelectItem value="ml">മലയാളം</SelectItem>
                <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
                <SelectItem value="mr">मराठी</SelectItem>
                <SelectItem value="bn">বাংলা</SelectItem>
                <SelectItem value="gu">ગુજરાતી</SelectItem>
                <SelectItem value="pa">ਪੰਜਾਬੀ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 overflow-visible">
        <div className="text-center max-w-4xl mx-auto overflow-visible">
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-white rounded-full shadow-strong">
              <HeartLogo className="h-24 w-24" />
            </div>
          </div>
          
          <div className="px-8 py-2 mb-2 overflow-visible">
            <h1 className="text-5xl font-bold inline-block">
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent pl-1 pr-1">
                Jeeva.AI
              </span>
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground mb-4">
            your health at your fingertips.
          </p>
          
          {isAuthenticated && user ? (
            <p className="text-lg text-muted-foreground mb-4">
              Welcome back, {user.name || 'User'}! Ready to manage your health?
            </p>
          ) : (
            <p className="text-lg text-muted-foreground mb-4">
              Patient-Centric Health Management Platform
            </p>
          )}
          
          <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
            Empower patients with AI-driven health insights and consent-based data sharing. 
            Secure, compliant, and designed for the future of healthcare.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {isAuthenticated && user ? (
              <>
                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={() => navigate(user.role === 'doctor' ? '/doctor/dashboard' : '/dashboard')}
                  className="text-lg px-8 py-3"
                >
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="text-lg px-8 py-3"
                >
                  Switch Account
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => logout()}
                  className="text-lg px-8 py-3 text-red-600 hover:text-red-700"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={() => navigate('/auth')}
                  className="text-lg px-8 py-3"
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    const featuresSection = document.querySelector('.grid');
                    if (featuresSection) {
                      featuresSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-lg px-8 py-3"
                >
                  Learn More
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-card rounded-xl p-6 shadow-medium border border-border">
            <div className="p-3 bg-primary-light rounded-lg w-fit mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Consent-Driven Privacy</h3>
            <p className="text-muted-foreground">
              You control who accesses your health data. Explicit consent for every interaction, 
              aligned with ABDM guidelines.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-medium border border-border">
            <div className="p-3 bg-accent-light rounded-lg w-fit mb-4">
              <Brain className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Health Insights</h3>
            <p className="text-muted-foreground">
              Advanced AI analyzes your medical records to provide personalized insights, 
              risk assessments, and recommendations.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-medium border border-border">
            <div className="p-3 bg-secondary-light rounded-lg w-fit mb-4">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Doctor Collaboration</h3>
            <p className="text-muted-foreground">
              Seamless collaboration between patients and healthcare providers with 
              secure data sharing and digital prescriptions.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-medium border border-border">
            <div className="p-3 bg-warning-light rounded-lg w-fit mb-4">
              <Activity className="h-6 w-6 text-warning" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Health Timeline</h3>
            <p className="text-muted-foreground">
              Comprehensive timeline view of your health journey with easy upload, 
              organization, and retrieval of medical records.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-medium border border-border">
            <div className="p-3 bg-primary-light rounded-lg w-fit mb-4">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Interoperability</h3>
            <p className="text-muted-foreground">
              FHIR-compliant data exchange between healthcare systems, 
              enabling seamless continuity of care.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-medium border border-border">
            <div className="p-3 bg-accent-light rounded-lg w-fit mb-4">
              <Heart className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Patient-Centric</h3>
            <p className="text-muted-foreground">
              Built with patients at the center. Your data, your control, your health journey 
              - managed the way you want it.
            </p>
          </div>
        </div>

        {/* ABDM Compliance Badge */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 bg-accent-light px-6 py-3 rounded-full">
            <Shield className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium">ABDM Compliant Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
