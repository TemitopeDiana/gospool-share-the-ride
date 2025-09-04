-- Fix volunteer_applications table schema conflicts

-- Drop the existing table (will also drop any triggers/constraints)
DROP TABLE IF EXISTS volunteer_applications CASCADE;

-- Recreate the table with a consistent schema
CREATE TABLE IF NOT EXISTS volunteer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_name text NOT NULL,
  email text NOT NULL,
  phone text,
  preferred_areas text,
  applied_date timestamptz NOT NULL DEFAULT now(),
  resume_url text,
  status text DEFAULT 'pending',
  verified_by uuid REFERENCES auth.users(id),
  verified_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous submissions
CREATE POLICY "Allow anonymous submissions" 
ON volunteer_applications 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Create policy for authenticated users and admins to read and manage all applications
CREATE POLICY "Allow admin access" 
ON volunteer_applications 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Make sure storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('volunteer-resumes', 'Volunteer Resumes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Simple storage policy for the bucket
DROP POLICY IF EXISTS "Public Access for volunteer-resumes" ON storage.objects;
CREATE POLICY "Public Access for volunteer-resumes" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'volunteer-resumes');

DROP POLICY IF EXISTS "Public Upload for volunteer-resumes" ON storage.objects;
CREATE POLICY "Public Upload for volunteer-resumes" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'volunteer-resumes');
