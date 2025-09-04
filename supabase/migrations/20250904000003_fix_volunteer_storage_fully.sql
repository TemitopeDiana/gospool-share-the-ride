-- Update storage policies for volunteer-resumes bucket to make it fully accessible

-- Make the volunteer-resumes bucket public
UPDATE storage.buckets 
SET public = TRUE
WHERE id = 'volunteer-resumes';

-- Drop existing policies for the bucket to start clean
DROP POLICY IF EXISTS "Allow anonymous uploads to volunteer-resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous downloads from volunteer-resumes" ON storage.objects;

-- Create a policy to allow anyone to read files from the bucket
CREATE POLICY "Public Access for volunteer-resumes" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'volunteer-resumes');

-- Create a policy to allow anyone to upload files to the bucket
CREATE POLICY "Public Upload for volunteer-resumes" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'volunteer-resumes');

-- Create a policy to allow anyone to update files in the bucket
CREATE POLICY "Public Update for volunteer-resumes" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'volunteer-resumes');

-- Create a policy to allow admins to delete files in the bucket
CREATE POLICY "Admin Delete for volunteer-resumes" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'volunteer-resumes' AND (auth.role() = 'authenticated' OR public.is_admin()));
