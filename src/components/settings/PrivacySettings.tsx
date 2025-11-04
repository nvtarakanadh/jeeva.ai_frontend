import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface PrivacySettingsProps {
  privacy: {
    shareAnalytics: boolean;
    allowResearch: boolean;
    publicProfile: boolean;
  };
  onPrivacyChange: (key: string, value: boolean) => void;
}

export const PrivacySettings = ({ privacy, onPrivacyChange }: PrivacySettingsProps) => {
  const { t } = useLanguage();
  const handleChange = (key: string, value: boolean) => {
    onPrivacyChange(key, value);
    toast({
      title: t('settings.privacy.updated'),
      description: t('settings.privacy.saved'),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {t('settings.privacy.privacySecurity')}
        </CardTitle>
        <CardDescription>
          {t('settings.privacy.controlData')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.privacy.shareAnalytics')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.privacy.shareAnalyticsDescription')}</p>
            </div>
            <Switch
              checked={privacy.shareAnalytics}
              onCheckedChange={(checked) => handleChange('shareAnalytics', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.privacy.allowResearch')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.privacy.allowResearchDescription')}</p>
            </div>
            <Switch
              checked={privacy.allowResearch}
              onCheckedChange={(checked) => handleChange('allowResearch', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.privacy.publicProfile')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.privacy.publicProfileDescription')}</p>
            </div>
            <Switch
              checked={privacy.publicProfile}
              onCheckedChange={(checked) => handleChange('publicProfile', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};