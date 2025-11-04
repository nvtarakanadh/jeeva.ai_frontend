import React, { useEffect } from 'react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PreferenceSettingsProps {
  preferences: {
    theme: string;
    language: string;
    timezone: string;
  };
  onPreferenceChange: (key: string, value: string) => void;
}

export const PreferenceSettings = ({ preferences, onPreferenceChange }: PreferenceSettingsProps) => {
  const { theme, setTheme } = useThemeContext();
  const { language, setLanguage, t } = useLanguage();
  const handleChange = (key: string, value: string) => {
    onPreferenceChange(key, value);
    if (key === 'theme') {
      setTheme(value as any);
    }
    if (key === 'language') {
      setLanguage(value as 'en' | 'hi' | 'te' | 'ta');
    }
    toast({
      title: t('settings.preferences.updated'),
      description: t('settings.preferences.saved'),
    });
  };

  // keep select in sync with external changes (e.g., loaded from storage)
  useEffect(() => {
    if (preferences.theme !== theme) {
      onPreferenceChange('theme', theme);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  // Sync language from context to preferences
  useEffect(() => {
    if (preferences.language !== language) {
      onPreferenceChange('language', language);
    }
  }, [language]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" />
          {t('settings.preferences.title')}
        </CardTitle>
        <CardDescription>
          {t('settings.preferences.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>{t('settings.preferences.theme')}</Label>
            <Select 
              value={preferences.theme} 
              onValueChange={(value) => handleChange('theme', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t('settings.preferences.light')}</SelectItem>
                <SelectItem value="dark">{t('settings.preferences.dark')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('settings.preferences.language')}</Label>
            <Select 
              value={language} 
              onValueChange={(value) => handleChange('language', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
                <SelectItem value="te">తెలుగు</SelectItem>
                <SelectItem value="ta">தமிழ்</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('settings.preferences.timezone')}</Label>
            <Select 
              value={preferences.timezone} 
              onValueChange={(value) => handleChange('timezone', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                <SelectItem value="Asia/Dubai">UAE (GST)</SelectItem>
                <SelectItem value="America/New_York">USA (EST)</SelectItem>
                <SelectItem value="Europe/London">UK (GMT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};