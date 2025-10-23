import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { PageSkeleton } from '@/components/ui/skeleton-loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('patient' | 'doctor')[];
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  fallbackPath = '/auth' 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [authTimeout, setAuthTimeout] = React.useState(false);

  // Safety timeout to prevent infinite loading
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('🔧 ProtectedRoute: Auth timeout, forcing navigation to auth');
        setAuthTimeout(true);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  // Show loading while checking authentication
  if (isLoading && !authTimeout) {
    return <PageSkeleton />;
  }

  // If auth times out, redirect to auth page
  if (authTimeout || (!isAuthenticated || !user)) {
    return <Navigate to={fallbackPath} replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    const correctPath = user.role === 'doctor' ? '/doctor/dashboard' : '/dashboard';
    return <Navigate to={correctPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
