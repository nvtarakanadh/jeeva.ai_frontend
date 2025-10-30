import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = 'app-theme-preference';

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  const shouldUseDark = mode === 'dark';

  if (shouldUseDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      return (stored === 'dark' || stored === 'light') ? stored : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    // Apply on mount and whenever theme changes
    applyTheme(theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  // No system mode listener needed

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    setTheme: setThemeState,
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
}

export function getStoredTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | 'system' | null;
    if (stored === 'dark' || stored === 'light') return stored;
    return 'light';
  } catch {
    return 'light';
  }
}


