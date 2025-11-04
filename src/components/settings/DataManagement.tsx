import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Trash2, FileText, Lock, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export const DataManagement = () => {
  const { logout } = useAuth();
  const { t } = useLanguage();

  const handleExportData = () => {
    toast({
      title: t('settings.dataManagement.dataExportStarted'),
      description: t('settings.dataManagement.exportMessage'),
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: t('settings.dataManagement.accountDeletion'),
      description: t('settings.dataManagement.contactSupport'),
      variant: "destructive",
    });
  };

  return (
    <>
      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('settings.dataManagement.title')}
          </CardTitle>
          <CardDescription>
            {t('settings.dataManagement.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{t('settings.dataManagement.exportHealthData')}</p>
                  <p className="text-sm text-muted-foreground">{t('settings.dataManagement.exportDescription')}</p>
                </div>
              </div>
              <Button onClick={handleExportData} variant="outline">
                {t('settings.dataManagement.exportData')}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/20">
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5 text-destructive" />
                <div>
                  <p className="font-medium text-destructive">{t('settings.dataManagement.deleteAccount')}</p>
                  <p className="text-sm text-muted-foreground">{t('settings.dataManagement.deleteDescription')}</p>
                </div>
              </div>
              <Button onClick={handleDeleteAccount} variant="destructive">
                {t('settings.dataManagement.deleteAccount')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t('settings.accountActions.title')}
          </CardTitle>
          <CardDescription>
            {t('settings.accountActions.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={logout} variant="outline" className="w-full">
              {t('common.signOut')}
            </Button>
            
            <div className="flex items-start gap-3 p-4 bg-accent-light rounded-lg">
              <AlertTriangle className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium">{t('settings.accountActions.abdmCompliant')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('settings.accountActions.abdmDescription')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};