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

  // Remove logging to prevent unnecessary re-renders
  // const prevState = React.useRef({ isAuthenticated, isLoading, userRole: user?.role });
  // React.useEffect(() => {
  //   const currentState = { isAuthenticated, isLoading, userRole: user?.role };
  //   if (JSON.stringify(prevState.current) !== JSON.stringify(currentState)) {
  //     console.log('🔧 ProtectedRoute: State changed', currentState);
  //     prevState.current = currentState;
  //   }
  // }, [isAuthenticated, isLoading, user?.role]);

  // Show loading while checking authentication
  if (isLoading) {
    return <PageSkeleton />;
  }

  // Don't render if not authenticated or wrong role
  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackPath} replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    const correctPath = user.role === 'doctor' ? '/doctor/dashboard' : '/dashboard';
    return <Navigate to={correctPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
