import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

export const PasswordSettings = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isReauthenticating, setIsReauthenticating] = useState(false);

  const passwordSchema = z.object({
    currentPassword: z.string().min(1, { message: 'Current password is required' }),
    newPassword: z.string().min(6, { message: 'New password must be at least 6 characters' }).max(128),
    confirmPassword: z.string()
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

  const handleChangePassword = async () => {
    try {
      setIsUpdatingPassword(true);
      
      // Validate form data
      const parsed = passwordSchema.safeParse(passwordForm);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message || 'Invalid input';
        toast({ title: 'Validation Error', description: msg, variant: 'destructive' });
        return;
      }

      // Get current session using direct fetch
      const authKey = Object.keys(localStorage).find(key => key.startsWith('sb-wgcmusjsuziqjkzuaqkd-auth-token'));
      
      let authToken = '';
      if (authKey) {
        const authData = localStorage.getItem(authKey);
        if (authData) {
          try {
            const parsed = JSON.parse(authData);
            authToken = parsed.access_token || '';
          } catch (e) {
            console.error('Error parsing auth data:', e);
          }
        }
      }
      
      if (!authToken) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const sessionResponse = await fetch('https://wgcmusjsuziqjkzuaqkd.supabase.co/auth/v1/user', {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnY211c2pzdXppcWprenVhcWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MDA2MjMsImV4cCI6MjA3NDQ3NjYyM30.I-7myV1T0KujlqqcD0nepUU_qvh_7rnQ0GktbNXmmn4',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!sessionResponse.ok) {
        throw new Error('Not authenticated. Please log in again.');
      }

      const sessionData = await sessionResponse.json();
      const user = sessionData.user || sessionData;
      if (!user || !user.email) {
        throw new Error('No user found. Please log in again.');
      }

      // Reauthenticate with current password using direct fetch
      setIsReauthenticating(true);
      
      const reauthResponse = await fetch('https://wgcmusjsuziqjkzuaqkd.supabase.co/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnY211c2pzdXppcWprenVhcWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MDA2MjMsImV4cCI6MjA3NDQ3NjYyM30.I-7myV1T0KujlqqcD0nepUU_qvh_7rnQ0GktbNXmmn4',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          password: passwordForm.currentPassword
        })
      });

      if (!reauthResponse.ok) {
        throw new Error('Current password is incorrect. Please try again.');
      }

      const reauthData = await reauthResponse.json();

      // Update password using direct fetch
      const updateResponse = await fetch('https://wgcmusjsuziqjkzuaqkd.supabase.co/auth/v1/user', {
        method: 'PUT',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnY211c2pzdXppcWprenVhcWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MDA2MjMsImV4cCI6MjA3NDQ3NjYyM30.I-7myV1T0KujlqqcD0nepUU_qvh_7rnQ0GktbNXmmn4',
          'Authorization': `Bearer ${reauthData.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: passwordForm.newPassword
        })
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.msg || 'Failed to update password');
      }
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast({ 
        title: 'Password updated', 
        description: 'Your password has been changed successfully.' 
      });
    } catch (error: any) {
      console.error('Password update failed:', error);
      toast({ 
        title: 'Update failed', 
        description: error.message || 'Could not change password. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setIsUpdatingPassword(false);
      setIsReauthenticating(false);
    }
  };

  const { toast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Password & Security
        </CardTitle>
        <p className="text-sm text-gray-600">Update your account password</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Enter your current password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <Shield className="h-4 w-4 text-blue-600" />
          <p className="text-sm text-blue-800">
            For security, you must enter your current password to change it.
          </p>
        </div>
        <Button 
          onClick={handleChangePassword} 
          disabled={isUpdatingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
          className="w-full"
        >
          {isReauthenticating ? 'Verifying...' : isUpdatingPassword ? 'Updating...' : 'Update Password'}
        </Button>
      </CardContent>
    </Card>
  );
};