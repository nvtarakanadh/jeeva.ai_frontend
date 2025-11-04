import React, { useEffect, useState } from 'react';
import { getStoredTheme, useThemeContext } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { PrivacySettings } from '@/components/settings/PrivacySettings';
import { PasswordSettings } from '@/components/settings/PasswordSettings';
import { PreferenceSettings } from '@/components/settings/PreferenceSettings';
import { DataManagement } from '@/components/settings/DataManagement';


const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    aiInsights: true,
    consentRequests: true,
    recordSharing: true,
  });

  const [privacy, setPrivacy] = useState({
    shareAnalytics: false,
    allowResearch: false,
    publicProfile: false,
  });

  const { theme, setTheme } = useThemeContext();
  const { language, setLanguage, t } = useLanguage();

  const getStoredLanguage = () => {
    const stored = localStorage.getItem('preferred-language');
    return stored && ['en', 'hi', 'te', 'ta'].includes(stored) ? stored : 'en';
  };

  const [preferences, setPreferences] = useState({
    theme: getStoredTheme(),
    language: getStoredLanguage(),
    timezone: 'Asia/Kolkata',
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const handlePreferenceChange = (key: string, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    if (key === 'theme') setTheme(value as any);
    if (key === 'language') {
      setLanguage(value as 'en' | 'hi' | 'te' | 'ta');
      localStorage.setItem('preferred-language', value);
    }
  };

  useEffect(() => {
    if (preferences.theme !== theme) {
      setPreferences(prev => ({ ...prev, theme }));
    }
  }, [theme]);

  // Sync language from context
  useEffect(() => {
    if (preferences.language !== language) {
      setPreferences(prev => ({ ...prev, language }));
    }
  }, [language]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
        <p className="text-muted-foreground">
          {t('settings.description')}
        </p>
      </div>

      <NotificationSettings 
        notifications={notifications} 
        onNotificationChange={handleNotificationChange}
      />

      <PrivacySettings 
        privacy={privacy} 
        onPrivacyChange={handlePrivacyChange}
      />

      <PasswordSettings />

      <PreferenceSettings 
        preferences={preferences} 
        onPreferenceChange={handlePreferenceChange}
      />

      <DataManagement />
    </div>
  );
};

export default Settings;