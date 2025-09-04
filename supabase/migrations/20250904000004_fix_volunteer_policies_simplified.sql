-- Fix RLS policy for volunteer_applications table
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to start clean
DROP POLICY IF EXISTS "Allow anonymous submissions" ON volunteer_applications;
DROP POLICY IF EXISTS "Allow admin read and delete" ON volunteer_applications;

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

-- Ensure the volunteer-resumes bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('volunteer-resumes', 'Volunteer Resumes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies for the bucket to start clean
DROP POLICY IF EXISTS "Allow anonymous uploads to volunteer-resumes" ON storage.objects;
DROP POLICY IF EXISTS "Public Access for volunteer-resumes" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload for volunteer-resumes" ON storage.objects;
DROP POLICY IF EXISTS "Public Update for volunteer-resumes" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete for volunteer-resumes" ON storage.objects;

-- Create a simple policy to allow anyone to read files from the bucket
CREATE POLICY "Public Access for volunteer-resumes" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'volunteer-resumes');

-- Create a simple policy to allow anyone to upload files to the bucket
CREATE POLICY "Public Upload for volunteer-resumes" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'volunteer-resumes');
