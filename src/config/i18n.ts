import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '@/locales/en.json';
import hiTranslations from '@/locales/hi.json';
import teTranslations from '@/locales/te.json';
import taTranslations from '@/locales/ta.json';

const getStoredLanguage = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('preferred-language');
    return stored && ['en', 'hi', 'te', 'ta'].includes(stored) ? stored : 'en';
  }
  return 'en';
};

const storedLanguage = getStoredLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      hi: {
        translation: hiTranslations,
      },
      te: {
        translation: teTranslations,
      },
      ta: {
        translation: taTranslations,
      },
    },
    lng: storedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
