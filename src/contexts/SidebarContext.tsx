import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    // Default to collapsed on smaller viewports
    return window.innerWidth < 1024;
  });

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  // Listen for global toggle events
  useEffect(() => {
    const handler = () => setIsCollapsed(prev => !prev);
    window.addEventListener('sidebar-toggle', handler as any);
    return () => window.removeEventListener('sidebar-toggle', handler as any);
  }, []);

  // Auto-collapse on smaller screens
  useEffect(() => {
    const onResize = () => {
      setIsCollapsed(prev => (window.innerWidth < 1024 ? true : prev));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
