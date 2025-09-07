-- Create storage buckets for admin forms
-- This migration creates all necessary storage buckets for team members, advisors, projects, and news

-- Create general images bucket for team members, advisors, projects, and news
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images', 
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create team-photos bucket specifically for team member photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team-photos',
  'team-photos', 
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create advisor-photos bucket specifically for board advisor photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'advisor-photos',
  'advisor-photos', 
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create project-images bucket specifically for project images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images', 
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create news-images bucket specifically for news article images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'news-images',
  'news-images', 
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies for general images bucket
CREATE POLICY "Allow public read access for images" ON storage.objects
FOR SELECT 
USING (bucket_id = 'images');

CREATE POLICY "Allow admin uploads to images" ON storage.objects
FOR INSERT 
WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow admin updates to images" ON storage.objects
FOR UPDATE 
USING (bucket_id = 'images' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow admin deletes from images" ON storage.objects
FOR DELETE 
USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Storage policies for team-photos bucket
CREATE POLICY "Allow public read access for team photos" ON storage.objects
FOR SELECT 
USING (bucket_id = 'team-photos');

CREATE POLICY "Allow admin uploads to team photos" ON storage.objects
FOR INSERT 
WITH CHECK (bucket_id = 'team-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow admin updates to team photos" ON storage.objects
FOR UPDATE 
USING (bucket_id = 'team-photos' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'team-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow admin deletes from team photos" ON storage.objects
FOR DELETE 
USING (bucket_id = 'team-photos' AND auth.role() = 'authenticated');

-- Storage policies for advisor-photos bucket
CREATE POLICY "Allow public read access for advisor photos" ON storage.objects
FOR SELECT 
USING (bucket_id = 'advisor-photos');

CREATE POLICY "Allow admin uploads to advisor photos" ON storage.objects
FOR INSERT 
WITH CHECK (bucket_id = 'advisor-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow admin updates to advisor photos" ON storage.objects
FOR UPDATE 
USING (bucket_id = 'advisor-photos' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'advisor-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow admin deletes from advisor photos" ON storage.objects
FOR DELETE 
USING (bucket_id = 'advisor-photos' AND auth.role() = 'authenticated');

-- Storage policies for project-images bucket
CREATE POLICY "Allow public read access for project images" ON storage.objects
FOR SELECT 
USING (bucket_id = 'project-images');

CREATE POLICY "Allow admin uploads to project images" ON storage.objects
FOR INSERT 
WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow admin updates to project images" ON storage.objects
FOR UPDATE 
USING (bucket_id = 'project-images' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow admin deletes from project images" ON storage.objects
FOR DELETE 
USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

-- Storage policies for news-images bucket
CREATE POLICY "Allow public read access for news images" ON storage.objects
FOR SELECT 
USING (bucket_id = 'news-images');

CREATE POLICY "Allow admin uploads to news images" ON storage.objects
FOR INSERT 
WITH CHECK (bucket_id = 'news-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow admin updates to news images" ON storage.objects
FOR UPDATE 
USING (bucket_id = 'news-images' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'news-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow admin deletes from news images" ON storage.objects
FOR DELETE 
USING (bucket_id = 'news-images' AND auth.role() = 'authenticated');
