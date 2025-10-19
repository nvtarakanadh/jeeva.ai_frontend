import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, LogOut, User, Settings, Menu } from 'lucide-react';
import { HeartLogo } from '@/components/HeartLogo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { NotificationDropdown } from '@/components/layout/NotificationDropdown';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (role: string) => {
    return role === 'doctor' ? 'bg-secondary' : 'bg-primary';
  };

  return (
    <header className="bg-card border-b border-border shadow-soft">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0" style={{ width: 64 }}>
          {/* Hamburger placed before logo */}
          <Button
            variant="ghost"
            size="icon"
            className="mr-1 lg:ml-1"
            onClick={() => {
              // On small screens, slide the mobile drawer; on desktop, toggle collapse
              if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                const el = document.getElementById('mobile-sidebar');
                if (el) {
                  el.classList.toggle('translate-x-0');
                }
              } else {
                window.dispatchEvent(new Event('sidebar-toggle'));
              }
            }}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <HeartLogo className="h-8 w-8" />
            <div className="flex flex-col justify-center leading-none">
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent whitespace-nowrap truncate max-w-[200px] sm:max-w-none">Jeeva.AI</h1>
            <p className="hidden md:block text-[11px] text-muted-foreground leading-tight whitespace-nowrap">Health Management Platform</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <NotificationDropdown />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={`${getRoleColor(user?.role || '')} text-white text-sm`}>
                    {getInitials(user?.name || 'U')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium truncate max-w-[160px]">{user?.role === 'doctor' ? `Dr. ${user?.name}` : user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.role === 'doctor' ? `Dr. ${user?.name}` : user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(user?.role === 'doctor' ? '/doctor/profile' : '/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(user?.role === 'doctor' ? '/doctor/settings' : '/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};