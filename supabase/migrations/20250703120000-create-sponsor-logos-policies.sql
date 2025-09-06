-- Enable public access to sponsor logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('sponsor-logos', 'sponsor-logos', true)
ON CONFLICT (id) DO UPDATE SET
  public = true;

-- Allow public users to upload sponsor logos
CREATE POLICY "Allow public uploads to sponsor logos" ON storage.objects
  FOR INSERT TO public
  WITH CHECK (bucket_id = 'sponsor-logos');

-- Allow public users to view sponsor logos
CREATE POLICY "Allow public access to sponsor logos" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'sponsor-logos');

-- Allow authenticated users to update their own uploads
CREATE POLICY "Allow users to update their sponsor logos" ON storage.objects
  FOR UPDATE TO public
  USING (bucket_id = 'sponsor-logos')
  WITH CHECK (bucket_id = 'sponsor-logos');

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Allow users to delete their sponsor logos" ON storage.objects
  FOR DELETE TO public
  USING (bucket_id = 'sponsor-logos');
