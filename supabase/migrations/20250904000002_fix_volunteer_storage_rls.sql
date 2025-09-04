-- Fix storage bucket RLS policies for volunteer-resumes
-- Allow anyone to upload files to the volunteer-resumes bucket

-- Make the volunteer-resumes bucket public (safer for a volunteer form that's accessible to everyone)
UPDATE storage.buckets 
SET public = true
WHERE id = 'volunteer-resumes';

-- Allow anonymous uploads to the volunteer-resumes bucket
-- Create policy for anonymous uploads
CREATE POLICY "Allow anonymous uploads to volunteer-resumes"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'volunteer-resumes'
);

-- Allow anonymous downloads from the volunteer-resumes bucket
CREATE POLICY "Allow anonymous downloads from volunteer-resumes"
ON storage.objects
FOR SELECT
TO anon
USING (
  bucket_id = 'volunteer-resumes'
);
