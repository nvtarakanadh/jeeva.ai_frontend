-- Fix RLS policies for consents table to allow patients to create consents
-- This is needed for the record sharing feature where patients create consents when booking appointments

-- Drop existing policies
DROP POLICY IF EXISTS "Patients can view their consents" ON public.consents;
DROP POLICY IF EXISTS "Doctors can view consents they created" ON public.consents;
DROP POLICY IF EXISTS "Doctors can create consents" ON public.consents;
DROP POLICY IF EXISTS "Patients can update their consents" ON public.consents;
DROP POLICY IF EXISTS "Doctors can update consents they created" ON public.consents;

-- Create new policies that allow both patients and doctors to create consents
-- Note: consents table uses auth.users(id) directly, not profiles table
CREATE POLICY "Patients can view their consents" ON public.consents
FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view consents granted to them" ON public.consents
FOR SELECT USING (auth.uid() = doctor_id);

-- Allow patients to create consents (for record sharing during appointment booking)
CREATE POLICY "Patients can create consents" ON public.consents
FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- Allow doctors to create consents (for consent requests)
CREATE POLICY "Doctors can create consents" ON public.consents
FOR INSERT WITH CHECK (auth.uid() = doctor_id);

-- Allow patients to update their consents
CREATE POLICY "Patients can update their consents" ON public.consents
FOR UPDATE USING (auth.uid() = patient_id);

-- Allow doctors to update consents they created
CREATE POLICY "Doctors can update consents they created" ON public.consents
FOR UPDATE USING (auth.uid() = doctor_id);
