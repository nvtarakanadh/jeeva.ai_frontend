-- Fix notifications table RLS policies and constraints
-- Run this in your Supabase SQL Editor to fix notification issues

-- First, check if the table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'notifications'
);

-- If the table doesn't exist, create it first
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- Make this nullable
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(500),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- If table exists, make profile_id nullable (fix the constraint issue)
ALTER TABLE notifications ALTER COLUMN profile_id DROP NOT NULL;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;

-- Create proper RLS policies for role-specific notifications
-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read, etc.)
CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications" ON notifications
  FOR DELETE USING (auth.uid() = user_id);

-- Allow authenticated users to create notifications (for cross-role notifications)
CREATE POLICY "Allow insert for authenticated users" ON notifications
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Alternative: More specific policies (uncomment if the above doesn't work)
-- CREATE POLICY "Users can view their own notifications" ON notifications
--   FOR SELECT USING (auth.uid() = user_id);
-- 
-- CREATE POLICY "Users can update their own notifications" ON notifications
--   FOR UPDATE USING (auth.uid() = user_id);
-- 
-- CREATE POLICY "Allow insert for authenticated users" ON notifications
--   FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- 
-- CREATE POLICY "Users can delete their own notifications" ON notifications
--   FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Grant necessary permissions
GRANT ALL ON notifications TO authenticated;
GRANT ALL ON notifications TO service_role;

-- Test the table structure (without inserting data that requires authentication)
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;

-- Show current RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'notifications';
