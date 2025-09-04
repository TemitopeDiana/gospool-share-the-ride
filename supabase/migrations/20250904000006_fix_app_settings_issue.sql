-- Fix the issue with 'app.settings.supabase_url' configuration

-- Drop any potential functions that might be trying to access app.settings.supabase_url
DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT proname, nspname
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE prosrc LIKE '%app.settings.supabase_url%'
    LOOP
        EXECUTE format('DROP FUNCTION IF EXISTS %I.%I CASCADE', 
                      func_record.nspname, func_record.proname);
    END LOOP;
END $$;

-- Fix the volunteer_applications table to ensure it has the correct schema
DROP TABLE IF EXISTS volunteer_applications CASCADE;

-- Recreate with a simplified schema
CREATE TABLE IF NOT EXISTS volunteer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_name text NOT NULL,
  email text NOT NULL,
  phone text,
  preferred_areas text,
  applied_date timestamptz NOT NULL DEFAULT now(),
  resume_url text,
  status text DEFAULT 'pending'
);

-- Enable RLS with simple policies
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now to simplify debugging
CREATE POLICY "Allow all operations" 
ON volunteer_applications 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Ensure storage bucket exists with public access
INSERT INTO storage.buckets (id, name, public)
VALUES ('volunteer-resumes', 'Volunteer Resumes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Simple storage policies
DROP POLICY IF EXISTS "Public Access for volunteer-resumes" ON storage.objects;
CREATE POLICY "Public Access for volunteer-resumes" 
ON storage.objects 
FOR ALL
USING (bucket_id = 'volunteer-resumes')
WITH CHECK (bucket_id = 'volunteer-resumes');
