import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, LogOut, User, Settings, Menu, Search, X } from 'lucide-react';
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
import SearchDropdown from '@/components/SearchDropdown';
import { searchAll, SearchResults } from '@/services/searchService';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Focus search input when opened on mobile
  useEffect(() => {
    if (isSearchOpen && isMobile && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen, isMobile]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        if (isMobile && isSearchOpen) {
          setIsSearchOpen(false);
          setSearchQuery('');
        }
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isSearchOpen]);

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim() || !user) {
      setSearchResults(null);
      setShowSearchResults(false);
      return;
    }

    console.log('🔍 Starting search for:', query);
    setIsSearching(true);
    setShowSearchResults(true); // Show dropdown while searching
    try {
      const results = await searchAll(query, user.id, user.role || 'patient');
      console.log('✅ Search completed:', { total: results.total, results });
      setSearchResults(results);
      // Keep dropdown open even if no results (to show "no results" message)
      setShowSearchResults(true);
    } catch (error) {
      console.error('❌ Search error:', error);
      setSearchResults({
        prescriptions: [],
        healthRecords: [],
        consultations: [],
        consultationNotes: [],
        patients: [],
        consents: [],
        pages: [],
        total: 0,
      });
      setShowSearchResults(true); // Show dropdown with error/empty state
    } finally {
      setIsSearching(false);
    }
  }, [user]);

  // Debounce search input
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(searchQuery);
      }, 300); // 300ms debounce
    } else {
      setSearchResults(null);
      setShowSearchResults(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // If there are results, navigate to full search page
      // Otherwise, just perform the search
      if (searchResults && searchResults.total > 0) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (isMobile) {
          setIsSearchOpen(false);
          setSearchQuery('');
        }
        setShowSearchResults(false);
      } else {
        performSearch(searchQuery);
      }
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim().length >= 2) {
      setShowSearchResults(true);
    }
  };

  const handleResultClick = () => {
    setShowSearchResults(false);
    if (isMobile) {
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (role: string) => {
    return role === 'doctor' ? 'bg-secondary' : 'bg-primary';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-soft">
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
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent whitespace-nowrap truncate max-w-[200px] sm:max-w-none">{t('common.appName')}</h1>
            <p className="hidden md:block text-[11px] text-muted-foreground leading-tight whitespace-nowrap">{t('common.healthManagementPlatform')}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search - Mobile: Icon that opens search bar, Desktop: Always visible search bar */}
          <div ref={searchContainerRef} className="relative">
            {isMobile ? (
              // Mobile: Search icon that opens search bar
              <>
                {!isSearchOpen ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setIsSearchOpen(true)}
                    aria-label="Search"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                ) : (
                  // Mobile: Expanded search bar
                  <div className="relative">
                    <form onSubmit={handleSearch} className="flex items-center gap-2 bg-background border border-border rounded-md px-2 py-1">
                      <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onFocus={() => {
                          if (searchQuery.trim().length >= 2 && searchResults) {
                            setShowSearchResults(true);
                          }
                        }}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-8 w-32 sm:w-40"
                        autoFocus
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                          setShowSearchResults(false);
                        }}
                        aria-label="Close search"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </form>
                    {showSearchResults && (
                      <SearchDropdown
                        results={searchResults}
                        isLoading={isSearching}
                        onResultClick={handleResultClick}
                      />
                    )}
                  </div>
                )}
              </>
            ) : (
              // Desktop: Always visible search bar
              <div className="relative">
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      onFocus={() => {
                        if (searchQuery.trim().length >= 2 && searchResults) {
                          setShowSearchResults(true);
                        }
                      }}
                      className="pl-9 pr-4 h-10 w-64"
                    />
                  </div>
                </form>
                {showSearchResults && (
                  <SearchDropdown
                    results={searchResults}
                    isLoading={isSearching}
                    onResultClick={handleResultClick}
                  />
                )}
              </div>
            )}
          </div>

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
                <span>{t('navigation.profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(user?.role === 'doctor' ? '/doctor/settings' : '/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('navigation.settings')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('common.signOut')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};