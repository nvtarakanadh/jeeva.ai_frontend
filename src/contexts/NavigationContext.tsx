import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationContextType {
  isNavigating: boolean;
  currentPath: string;
  previousPath: string | null;
  setNavigating: (navigating: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Set navigating state when path changes
    if (currentPath !== location.pathname) {
      setPreviousPath(currentPath);
      setCurrentPath(location.pathname);
      setIsNavigating(true);
      
      // Reset navigating state after a short delay
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, currentPath]);

  const setNavigating = (navigating: boolean) => {
    setIsNavigating(navigating);
  };

  return (
    <NavigationContext.Provider
      value={{
        isNavigating,
        currentPath,
        previousPath,
        setNavigating
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
