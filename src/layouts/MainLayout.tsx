import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
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
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();

  // Function to close mobile sidebar when clicking on main content
  const handleMainContentClick = (e: React.MouseEvent) => {
    console.log('🔍 Main content clicked, screen width:', window.innerWidth);
    
    // Only handle clicks on mobile devices (screen width < 1024px)
    if (window.innerWidth >= 1024) {
      console.log('🖥️ Desktop view - ignoring click');
      return;
    }
    
    console.log('📱 Mobile view - processing click');
    
    // Don't close if clicking on interactive elements
    const target = e.target as HTMLElement;
    const interactiveElement = target.closest('button, a, input, select, textarea, [role="button"]');
    if (interactiveElement) {
      console.log('🔘 Clicked on interactive element:', interactiveElement.tagName);
      return;
    }
    
    const mobileSidebar = document.getElementById('mobile-sidebar');
    console.log('📋 Mobile sidebar element:', mobileSidebar);
    
    if (mobileSidebar) {
      const isHidden = mobileSidebar.classList.contains('-translate-x-full');
      console.log('📋 Sidebar is hidden:', isHidden);
      
      if (!isHidden) {
        console.log('✅ Closing mobile sidebar');
        mobileSidebar.classList.add('-translate-x-full');
      } else {
        console.log('ℹ️ Sidebar already hidden');
      }
    } else {
      console.log('❌ Mobile sidebar element not found');
    }
  };

  // Function to close mobile sidebar when touching main content
  const handleMainContentTouch = (e: React.TouchEvent) => {
    console.log('👆 Main content touched, screen width:', window.innerWidth);
    
    // Only handle touches on mobile devices (screen width < 1024px)
    if (window.innerWidth >= 1024) {
      console.log('🖥️ Desktop view - ignoring touch');
      return;
    }
    
    console.log('📱 Mobile view - processing touch');
    
    // Don't close if touching interactive elements
    const target = e.target as HTMLElement;
    const interactiveElement = target.closest('button, a, input, select, textarea, [role="button"]');
    if (interactiveElement) {
      console.log('🔘 Touched interactive element:', interactiveElement.tagName);
      return;
    }
    
    const mobileSidebar = document.getElementById('mobile-sidebar');
    console.log('📋 Mobile sidebar element:', mobileSidebar);
    
    if (mobileSidebar) {
      const isHidden = mobileSidebar.classList.contains('-translate-x-full');
      console.log('📋 Sidebar is hidden:', isHidden);
      
      if (!isHidden) {
        console.log('✅ Closing mobile sidebar');
        mobileSidebar.classList.add('-translate-x-full');
      } else {
        console.log('ℹ️ Sidebar already hidden');
      }
    } else {
      console.log('❌ Mobile sidebar element not found');
    }
  };


  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Add global click handler for mobile sidebar
  useEffect(() => {
    const handleDocumentClick = (e: Event) => {
      // Only handle on mobile devices
      if (window.innerWidth >= 1024) return;
      
      const target = e.target as HTMLElement;
      
      // Don't close if clicking on the sidebar itself or hamburger button
      if (target.closest('#mobile-sidebar, [aria-label="Toggle menu"]')) {
        return;
      }
      
      // Don't close if clicking on interactive elements
      if (target.closest('button, a, input, select, textarea, [role="button"]')) {
        return;
      }
      
      const mobileSidebar = document.getElementById('mobile-sidebar');
      if (mobileSidebar && !mobileSidebar.classList.contains('-translate-x-full')) {
        console.log('🌍 Document click - closing mobile sidebar');
        mobileSidebar.classList.add('-translate-x-full');
      }
    };

    // Handle custom mobile sidebar close event
    const handleMobileSidebarClose = () => {
      console.log('📡 Received mobile-sidebar-close event');
      const mobileSidebar = document.getElementById('mobile-sidebar');
      if (mobileSidebar) {
        mobileSidebar.classList.add('-translate-x-full');
        console.log('✅ Closed mobile sidebar via custom event');
      }
    };

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('touchstart', handleDocumentClick);
    document.addEventListener('mobile-sidebar-close', handleMobileSidebarClose);
    
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('touchstart', handleDocumentClick);
      document.removeEventListener('mobile-sidebar-close', handleMobileSidebarClose);
    };
  }, []);

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }


  return (
    <div className="min-h-screen bg-background">
      <LoadingReset />
      {/* Fixed Header */}
      <Header />
      
      <div className="flex pt-16"> {/* Add top padding to account for fixed header */}
        {/* Mobile/Tablet drawer: hidden by default, slides in on header toggle */}
        <div id="mobile-sidebar" className="fixed lg:hidden top-16 left-0 bottom-0 w-64 -translate-x-full transition-transform duration-300 z-40">
          <Sidebar forceExpanded={true} />
        </div>

        {/* Desktop sidebar (visible ≥ lg only) - Fixed positioned */}
        <div className="hidden lg:block fixed top-16 left-0 bottom-0 z-30">
          <Sidebar />
        </div>

        {/* Main content area with dynamic left margin based on sidebar state */}
        <main 
          className={`flex-1 p-4 sm:p-6 overflow-auto min-h-[calc(100vh-4rem)] transition-all duration-300 ${
            isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
          }`}
          onClick={handleMainContentClick}
          onTouchStart={handleMainContentTouch}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;