import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigation } from '@/contexts/NavigationContext';

interface LoadingResetProps {
  onLocationChange?: () => void;
}

export const LoadingReset: React.FC<LoadingResetProps> = ({ onLocationChange }) => {
  const location = useLocation();
  const { setNavigating } = useNavigation();

  useEffect(() => {
    // Reset any global loading states when location changes
    if (onLocationChange) {
      onLocationChange();
    }
    
    // Set navigating state briefly to trigger loading resets
    setNavigating(true);
    const timer = setTimeout(() => {
      setNavigating(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname, onLocationChange, setNavigating]);

  return null;
};
