-- Create patient-doctor assignment to enable health record notifications
-- This script will assign the current patient to an available doctor

-- First, let's see what doctors are available
SELECT 
  id as doctor_profile_id,
  user_id as doctor_user_id,
  full_name as doctor_name,
  role
FROM profiles 
WHERE role = 'doctor' 
LIMIT 5;

-- Now let's see the current patient
SELECT 
  id as patient_profile_id,
  user_id as patient_user_id,
  full_name as patient_name,
  role
FROM profiles 
WHERE user_id = '99a7511b-60dd-43de-a7d3-0e174b822241';

-- Create the assignment (replace DOCTOR_PROFILE_ID with actual doctor ID from above query)
-- You'll need to run this after getting the doctor's profile ID
/*
INSERT INTO patient_access (
  patient_id,
  doctor_id,
  access_type,
  status,
  granted_at,
  created_at
) VALUES (
  '99a7511b-60dd-43de-a7d3-0e174b822241',  -- Patient user_id
  'DOCTOR_PROFILE_ID_HERE',                 -- Replace with actual doctor profile ID
  'full_access',
  'active',
  NOW(),
  NOW()
);
*/

-- Check if assignment was created successfully
SELECT 
  pa.*,
  p_patient.full_name as patient_name,
  p_doctor.full_name as doctor_name
FROM patient_access pa
LEFT JOIN profiles p_patient ON pa.patient_id = p_patient.user_id
LEFT JOIN profiles p_doctor ON pa.doctor_id = p_doctor.id
WHERE pa.patient_id = '99a7511b-60dd-43de-a7d3-0e174b822241';
