-- Enable storage if not enabled
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'sponsor-logos',
  'sponsor-logos', 
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policy for public read access
CREATE POLICY "Public can view sponsor logos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'sponsor-logos');

-- Create storage policy for admin upload access  
CREATE POLICY "Admins can upload sponsor logos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'sponsor-logos' AND public.is_admin());

-- Create storage policy for admin update/delete access
CREATE POLICY "Admins can update sponsor logos"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'sponsor-logos' AND public.is_admin());

CREATE POLICY "Admins can delete sponsor logos"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'sponsor-logos' AND public.is_admin());
