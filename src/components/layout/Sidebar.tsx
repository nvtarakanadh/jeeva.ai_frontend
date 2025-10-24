import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
  Wallet
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

const patientNavItems: NavItem[] = [
  { label: 'Dashboard', icon: Home, href: '/dashboard', roles: ['patient'] },
  { label: 'Health Records', icon: FileText, href: '/records', roles: ['patient'] },
  { label: 'Consultations', icon: Stethoscope, href: '/consultations', roles: ['patient'] },
  { label: 'Prescriptions', icon: Pill, href: '/prescriptions', roles: ['patient'] },
  { label: 'Consultation Notes', icon: Stethoscope, href: '/consultation-notes', roles: ['patient'] },
  { label: 'Consent Management', icon: Shield, href: '/consents', roles: ['patient'] },
  { label: 'Share Data', icon: Hospital, href: '/share-data', roles: ['patient'] },
];

const patientComingSoonNavItems: NavItem[] = [
  { label: 'Vendors', icon: Building2, href: '/vendors', roles: ['patient'] },
  { label: 'Medical Device Companies', icon: Microscope, href: '/medical-device-companies', roles: ['patient'] },
  { label: 'Insurance Partners', icon: Heart, href: '/insurance-partners', roles: ['patient'] },
  { label: 'Pharmacies', icon: Store, href: '/pharmacies', roles: ['patient'] },
  { label: 'Loans', icon: IndianRupee, href: '/loans', roles: ['patient'] },
  { label: 'Coupons & Schemes', icon: Ticket, href: '/coupons-schemes', roles: ['patient'] },
  { label: 'Medical Tourism', icon: Plane, href: '/medical-tourism', roles: ['patient'] },
  { label: 'Clinical Research', icon: TestTube, href: '/clinical-research', roles: ['patient'] },
  { label: 'Finance Partners', icon: Wallet, href: '/finance-partners', roles: ['patient'] },
];

const doctorComingSoonNavItems: NavItem[] = [
  { label: 'Vendors', icon: Building2, href: '/doctor/vendors', roles: ['doctor'] },
  { label: 'Medical Device Companies', icon: Microscope, href: '/doctor/medical-device-companies', roles: ['doctor'] },
  { label: 'Insurance Partners', icon: Heart, href: '/doctor/insurance-partners', roles: ['doctor'] },
  { label: 'Pharmacies', icon: Store, href: '/doctor/pharmacies', roles: ['doctor'] },
  { label: 'Loans', icon: IndianRupee, href: '/doctor/loans', roles: ['doctor'] },
  { label: 'Coupons & Schemes', icon: Ticket, href: '/doctor/coupons-schemes', roles: ['doctor'] },
  { label: 'Medical Tourism', icon: Plane, href: '/doctor/medical-tourism', roles: ['doctor'] },
  { label: 'Clinical Research', icon: TestTube, href: '/doctor/clinical-research', roles: ['doctor'] },
  { label: 'Finance Partners', icon: Wallet, href: '/doctor/finance-partners', roles: ['doctor'] },
];

const doctorNavItems: NavItem[] = [
  { label: 'Dashboard', icon: Home, href: '/doctor/dashboard', roles: ['doctor'] },
  { label: 'My Patients', icon: Users, href: '/doctor/patients', roles: ['doctor'] },
  { label: 'Consultations', icon: Stethoscope, href: '/doctor/consultations', roles: ['doctor'] },
  { label: 'Prescriptions', icon: Pill, href: '/doctor/prescriptions', roles: ['doctor'] },
  { label: 'Consultation Notes', icon: Stethoscope, href: '/doctor/consultation-notes', roles: ['doctor'] },
  { label: 'Consent Requests', icon: Shield, href: '/doctor/consents', roles: ['doctor'] },
];


type SidebarProps = { forceExpanded?: boolean };

export const Sidebar: React.FC<SidebarProps> = ({ forceExpanded = false }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    // Default to collapsed on smaller viewports
    return forceExpanded ? false : window.innerWidth < 1024; // collapse by default below lg
  });

  React.useEffect(() => {
    if (forceExpanded) return; // don't auto-collapse in forced expanded mode (mobile drawer)
    const onResize = () => {
      // Auto-collapse when viewport shrinks below lg; expand when wider if not manually toggled
      setIsCollapsed(prev => (window.innerWidth < 1024 ? true : prev));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Listen for global toggle events triggered from the header hamburger
  React.useEffect(() => {
    if (forceExpanded) return; // header toggle not needed in forced mode
    const handler = () => setIsCollapsed(prev => !prev);
    window.addEventListener('sidebar-toggle', handler as any);
    return () => window.removeEventListener('sidebar-toggle', handler as any);
  }, []);

  const navItems = user?.role === 'doctor' ? doctorNavItems : patientNavItems;
  const comingSoonItems = user?.role === 'doctor' ? doctorComingSoonNavItems : patientComingSoonNavItems;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNavigation = (href: string) => {
    if (href !== '#') {
      navigate(href);
    }
  };

  return (
    <TooltipProvider>
      <aside className={cn(
        "bg-card border-r border-border h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )} role="navigation" aria-label="Sidebar Navigation">
        <div className="p-4 space-y-6 min-w-0">
        {/* Main Navigation */}
        <div>
          {!isCollapsed && (
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
                      isCollapsed 
                        ? "justify-center p-0" 
                        : "justify-start gap-3",
                      isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                    onClick={() => handleNavigation(item.href)}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate text-sm">{item.label}</span>
                    )}
                  </Button>
                  {/* Active indicator for collapsed state */}
                  {isCollapsed && isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                </div>
              );

              return isCollapsed ? (
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
        {!isCollapsed && comingSoonItems.length > 0 && (
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
                        isCollapsed 
                          ? "justify-center p-0" 
                          : "justify-start gap-3",
                        isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                      onClick={() => handleNavigation(item.href)}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="truncate text-sm">{item.label}</span>
                      )}
                    </Button>
                    {/* Active indicator for collapsed state */}
                    {isCollapsed && isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                    )}
                  </div>
                );

                return isCollapsed ? (
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
        {!isCollapsed && (
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