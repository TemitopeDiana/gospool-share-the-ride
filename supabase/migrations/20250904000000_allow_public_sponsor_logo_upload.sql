-- Allow public users to upload sponsor logos for their applications
DROP POLICY IF EXISTS "Public can upload sponsor logos for applications" ON storage.objects;

CREATE POLICY "Public can upload sponsor logos for applications"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'sponsor-logos');
