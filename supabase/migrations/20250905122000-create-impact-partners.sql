-- Create impact_partners table
CREATE TABLE IF NOT EXISTS public.impact_partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  logo_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.impact_partners ENABLE ROW LEVEL SECURITY;

-- Allow public to read active partners
CREATE POLICY "Public can view active impact partners"
ON public.impact_partners
FOR SELECT
USING (is_active = true);

-- Allow admins to manage all partners
CREATE POLICY "Admins can manage impact partners"
ON public.impact_partners
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Create storage bucket for partner logos (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('partner-logos', 'partner-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for partner logos
CREATE POLICY "Allow partner logo uploads" ON storage.objects
FOR INSERT 
WITH CHECK (bucket_id = 'partner-logos');

CREATE POLICY "Allow public to view partner logos" ON storage.objects
FOR SELECT 
USING (bucket_id = 'partner-logos');

CREATE POLICY "Allow admins to update partner logos" ON storage.objects
FOR UPDATE 
USING (bucket_id = 'partner-logos' AND public.is_admin());

CREATE POLICY "Allow admins to delete partner logos" ON storage.objects
FOR DELETE 
USING (bucket_id = 'partner-logos' AND public.is_admin());
