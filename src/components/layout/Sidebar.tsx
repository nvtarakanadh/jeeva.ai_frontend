import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Home, 
  FileText, 
  Brain, 
  Shield, 
  Users,
  PlusCircle,
  Hospital,
  Calendar,
  CreditCard,
  FlaskConical,
  Pill,
  Stethoscope,
  Menu,
  Building2,
  Microscope,
  Heart,
  Store,
  IndianRupee,
  Ticket,
  Plane,
  TestTube,
  Wallet,
  Video,
  Activity
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  roles: ('patient' | 'doctor')[];
  badge?: string;
}

type SidebarProps = { forceExpanded?: boolean };

export const Sidebar: React.FC<SidebarProps> = ({ forceExpanded = false }) => {
  const { user } = useAuth();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // For mobile sidebar (forceExpanded=true), always show expanded view
  // For desktop sidebar, use the global collapsed state
  const shouldShowExpanded = forceExpanded || !isCollapsed;

  // Create nav items with translations
  const patientNavItems: NavItem[] = [
    { label: t('navigation.dashboard'), icon: Home, href: '/dashboard', roles: ['patient'] },
    { label: t('navigation.healthRecords'), icon: FileText, href: '/records', roles: ['patient'] },
    { label: t('navigation.consultations'), icon: Stethoscope, href: '/consultations', roles: ['patient'] },
    { label: t('navigation.prescriptions'), icon: Pill, href: '/prescriptions', roles: ['patient'] },
    { label: t('navigation.consultationNotes'), icon: Stethoscope, href: '/consultation-notes', roles: ['patient'] },
    { label: t('navigation.consentManagement'), icon: Shield, href: '/consents', roles: ['patient'] },
    { label: t('navigation.shareData'), icon: Hospital, href: '/share-data', roles: ['patient'] },
  ];

  const patientComingSoonNavItems: NavItem[] = [
    { label: t('navigation.vendors'), icon: Building2, href: '/vendors', roles: ['patient'] },
    { label: t('navigation.medicalDeviceCompanies'), icon: Microscope, href: '/medical-device-companies', roles: ['patient'] },
    { label: t('navigation.teleHealth'), icon: Video, href: '/coming-soon/tele-health', roles: ['patient'] },
    { label: t('navigation.remoteMonitoring'), icon: Activity, href: '/coming-soon/remote-monitoring', roles: ['patient'] },
    { label: t('navigation.insurancePartners'), icon: Heart, href: '/insurance-partners', roles: ['patient'] },
    { label: t('navigation.pharmacies'), icon: Store, href: '/pharmacies', roles: ['patient'] },
    { label: t('navigation.loans'), icon: IndianRupee, href: '/loans', roles: ['patient'] },
    { label: t('navigation.couponsSchemes'), icon: Ticket, href: '/coupons-schemes', roles: ['patient'] },
    { label: t('navigation.medicalTourism'), icon: Plane, href: '/medical-tourism', roles: ['patient'] },
    { label: t('navigation.clinicalResearch'), icon: TestTube, href: '/clinical-research', roles: ['patient'] },
    { label: t('navigation.financePartners'), icon: Wallet, href: '/finance-partners', roles: ['patient'] },
  ];

  const doctorComingSoonNavItems: NavItem[] = [
    { label: t('navigation.vendors'), icon: Building2, href: '/doctor/vendors', roles: ['doctor'] },
    { label: t('navigation.medicalDeviceCompanies'), icon: Microscope, href: '/doctor/medical-device-companies', roles: ['doctor'] },
    { label: t('navigation.teleHealth'), icon: Video, href: '/doctor/coming-soon/tele-health', roles: ['doctor'] },
    { label: t('navigation.remoteMonitoring'), icon: Activity, href: '/doctor/coming-soon/remote-monitoring', roles: ['doctor'] },
    { label: t('navigation.insurancePartners'), icon: Heart, href: '/doctor/insurance-partners', roles: ['doctor'] },
    { label: t('navigation.pharmacies'), icon: Store, href: '/doctor/pharmacies', roles: ['doctor'] },
    { label: t('navigation.loans'), icon: IndianRupee, href: '/doctor/loans', roles: ['doctor'] },
    { label: t('navigation.couponsSchemes'), icon: Ticket, href: '/doctor/coupons-schemes', roles: ['doctor'] },
    { label: t('navigation.medicalTourism'), icon: Plane, href: '/doctor/medical-tourism', roles: ['doctor'] },
    { label: t('navigation.clinicalResearch'), icon: TestTube, href: '/doctor/clinical-research', roles: ['doctor'] },
    { label: t('navigation.financePartners'), icon: Wallet, href: '/doctor/finance-partners', roles: ['doctor'] },
  ];

  const doctorNavItems: NavItem[] = [
    { label: t('navigation.dashboard'), icon: Home, href: '/doctor/dashboard', roles: ['doctor'] },
    { label: t('navigation.myPatients'), icon: Users, href: '/doctor/patients', roles: ['doctor'] },
    { label: t('navigation.consultations'), icon: Stethoscope, href: '/doctor/consultations', roles: ['doctor'] },
    { label: t('navigation.prescriptions'), icon: Pill, href: '/doctor/prescriptions', roles: ['doctor'] },
    { label: t('navigation.consultationNotes'), icon: Stethoscope, href: '/doctor/consultation-notes', roles: ['doctor'] },
    { label: t('navigation.consentRequests'), icon: Shield, href: '/doctor/consents', roles: ['doctor'] },
  ];

  const navItems = user?.role === 'doctor' ? doctorNavItems : patientNavItems;
  const comingSoonItems = user?.role === 'doctor' ? doctorComingSoonNavItems : patientComingSoonNavItems;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNavigation = (href: string) => {
    console.log('🧭 Navigation clicked:', href);
    console.log('📱 forceExpanded:', forceExpanded);
    console.log('📏 Screen width:', window.innerWidth);
    
    if (href !== '#') {
      // Auto-close sidebar after navigation
      if (forceExpanded) {
        // Mobile: Close the mobile sidebar completely
        console.log('📱 Mobile navigation - closing sidebar');
        const mobileSidebar = document.getElementById('mobile-sidebar');
        console.log('📋 Mobile sidebar element:', mobileSidebar);
        
        if (mobileSidebar) {
          console.log('📋 Current classes:', mobileSidebar.className);
          mobileSidebar.classList.add('-translate-x-full');
          console.log('✅ Added -translate-x-full class');
          console.log('📋 New classes:', mobileSidebar.className);
          
          // Also try to trigger a custom event to ensure it closes
          const closeEvent = new CustomEvent('mobile-sidebar-close');
          document.dispatchEvent(closeEvent);
          console.log('📡 Dispatched mobile-sidebar-close event');
        } else {
          console.log('❌ Mobile sidebar element not found');
        }
        
        // Navigate after closing sidebar
        setTimeout(() => {
          navigate(href);
        }, 100);
      } else {
        // Desktop: Half-close (collapse to icons only)
        console.log('🖥️ Desktop navigation - collapsing sidebar');
        setIsCollapsed(true);
        navigate(href);
      }
    }
  };

  return (
    <TooltipProvider>
      <aside className={cn(
        "bg-card border-r border-border h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden transition-all duration-300",
        shouldShowExpanded ? "w-64" : "w-16"
      )} role="navigation" aria-label="Sidebar Navigation">
        <div className="p-4 space-y-6 min-w-0">
        {/* Main Navigation */}
        <div>
          {shouldShowExpanded && (
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Main Menu
            </h2>
          )}
          <nav className="space-y-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              const button = (
                <div key={item.href} className="relative">
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full h-10 min-w-0",
                      shouldShowExpanded 
                        ? "justify-start gap-3" 
                        : "justify-center p-0",
                      isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                    onClick={() => handleNavigation(item.href)}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {shouldShowExpanded && (
                      <span className="truncate text-sm">{item.label}</span>
                    )}
                  </Button>
                  {/* Active indicator for collapsed state */}
                  {!shouldShowExpanded && isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                </div>
              );

              return !shouldShowExpanded ? (
                <Tooltip key={`tooltip-${item.href}`}>
                  <TooltipTrigger asChild>
                    {button}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="ml-2">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              ) : button;
            })}
          </nav>
        </div>

        {/* Coming Soon Section */}
        {shouldShowExpanded && comingSoonItems.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Coming Soon
            </h2>
            <nav className="space-y-1">
              {comingSoonItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                const button = (
                  <div key={item.href} className="relative">
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full h-10 min-w-0 opacity-75 hover:opacity-90",
                        shouldShowExpanded 
                          ? "justify-start gap-3" 
                          : "justify-center p-0",
                        isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                      onClick={() => handleNavigation(item.href)}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {shouldShowExpanded && (
                        <span className="truncate text-sm">{item.label}</span>
                      )}
                    </Button>
                    {/* Active indicator for collapsed state */}
                    {!shouldShowExpanded && isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                    )}
                  </div>
                );

                return !shouldShowExpanded ? (
                  <Tooltip key={`tooltip-${item.href}`}>
                    <TooltipTrigger asChild>
                      {button}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-2">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : button;
              })}
            </nav>
          </div>
        )}

        {/* ABDM Compliance */}
        {shouldShowExpanded && (
          <div className="bg-accent-light p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-accent mb-2">ABDM Compliant</h3>
            <p className="text-xs text-muted-foreground">
              This platform follows Ayushman Bharat Digital Mission guidelines for secure health data management.
            </p>
          </div>
        )}
        </div>
      </aside>
    </TooltipProvider>
  );
};