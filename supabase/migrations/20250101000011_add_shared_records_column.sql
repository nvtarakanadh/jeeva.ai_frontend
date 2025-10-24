-- Add shared_records field to consultations table
ALTER TABLE public.consultations 
ADD COLUMN IF NOT EXISTS shared_records UUID[] DEFAULT '{}';

-- Add comment to explain the field
COMMENT ON COLUMN public.consultations.shared_records IS 'Array of health record IDs that the patient has shared with the doctor for this consultation';

-- Create index for better performance when querying by shared records
CREATE INDEX IF NOT EXISTS idx_consultations_shared_records ON public.consultations USING GIN (shared_records);

-- Update RLS policies to allow access to shared_records
DROP POLICY IF EXISTS "Patients can view their consultations" ON public.consultations;
CREATE POLICY "Patients can view their consultations" ON public.consultations
    FOR SELECT USING (
        patient_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Doctors can view their consultations" ON public.consultations;
CREATE POLICY "Doctors can view their consultations" ON public.consultations
    FOR SELECT USING (
        doctor_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    );
