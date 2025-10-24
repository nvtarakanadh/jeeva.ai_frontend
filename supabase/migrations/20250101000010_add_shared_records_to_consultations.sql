-- Add shared_records field to consultations table
ALTER TABLE public.consultations 
ADD COLUMN shared_records UUID[] DEFAULT '{}';

-- Add comment to explain the field
COMMENT ON COLUMN public.consultations.shared_records IS 'Array of health record IDs that the patient has shared with the doctor for this consultation';

-- Create index for better performance when querying by shared records
CREATE INDEX IF NOT EXISTS idx_consultations_shared_records ON public.consultations USING GIN (shared_records);

-- Update the consultations table to allow patient_id to be nullable (for non-patient events)
-- This was already done in a previous migration, but ensuring it's correct
ALTER TABLE public.consultations ALTER COLUMN patient_id DROP NOT NULL;
