import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n from '@/config/i18n';

type Language = 'en' | 'hi' | 'te' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const getStoredLanguage = (): Language => {
    const stored = localStorage.getItem('preferred-language');
    if (stored && ['en', 'hi', 'te', 'ta'].includes(stored)) {
      return stored as Language;
    }
    return 'en';
  };

  const [language, setLanguageState] = useState<Language>(getStoredLanguage());

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred-language', lang);
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, []);

  const t = (key: string, options?: Record<string, string>): string => {
    return i18n.t(key, options) || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
