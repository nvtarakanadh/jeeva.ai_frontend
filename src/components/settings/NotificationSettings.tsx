import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface NotificationSettingsProps {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    aiInsights: boolean;
    consentRequests: boolean;
    recordSharing: boolean;
  };
  onNotificationChange: (key: string, value: boolean) => void;
}

export const NotificationSettings = ({ notifications, onNotificationChange }: NotificationSettingsProps) => {
  const { t } = useLanguage();
  const handleChange = (key: string, value: boolean) => {
    onNotificationChange(key, value);
    toast({
      title: t('settings.notifications.updated'),
      description: t('settings.notifications.saved'),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          {t('settings.notifications.title')}
        </CardTitle>
        <CardDescription>
          {t('settings.notifications.chooseHow')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.notifications.emailNotifications')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.notifications.emailDescription')}</p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) => handleChange('email', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.notifications.pushNotifications')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.notifications.pushDescription')}</p>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={(checked) => handleChange('push', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.notifications.smsNotifications')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.notifications.smsDescription')}</p>
            </div>
            <Switch
              checked={notifications.sms}
              onCheckedChange={(checked) => handleChange('sms', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.notifications.aiInsights')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.notifications.aiInsightsDescription')}</p>
            </div>
            <Switch
              checked={notifications.aiInsights}
              onCheckedChange={(checked) => handleChange('aiInsights', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.notifications.consentRequests')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.notifications.consentRequestsDescription')}</p>
            </div>
            <Switch
              checked={notifications.consentRequests}
              onCheckedChange={(checked) => handleChange('consentRequests', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.notifications.recordSharing')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.notifications.recordSharingDescription')}</p>
            </div>
            <Switch
              checked={notifications.recordSharing}
              onCheckedChange={(checked) => handleChange('recordSharing', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};