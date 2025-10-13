import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageSkeleton } from '@/components/ui/skeleton-loading';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { LoadingReset } from '@/components/LoadingReset';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }


  return (
    <div className="min-h-screen bg-background">
      <LoadingReset />
      <Header />
      <div className="flex">
        {/* Mobile/Tablet drawer: hidden by default, slides in on header toggle */}
        <div id="mobile-sidebar" className="fixed lg:hidden top-16 left-0 bottom-0 w-64 -translate-x-full transition-transform duration-300 z-40">
          <Sidebar forceExpanded={true} />
        </div>

        {/* Desktop sidebar (visible ≥ lg only) */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;