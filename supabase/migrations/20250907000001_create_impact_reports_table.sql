-- Create impact_reports table for storing actual impact reports
CREATE TABLE public.impact_reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  content text NOT NULL,
  report_period_start date,
  report_period_end date,
  metrics jsonb DEFAULT '{}',
  images text[],
  file_url text,
  is_published boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.impact_reports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view published impact reports" ON public.impact_reports
  FOR SELECT 
  USING (is_published = true);

CREATE POLICY "Admins can manage impact reports" ON public.impact_reports
  FOR ALL 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Create indexes
CREATE INDEX idx_impact_reports_published ON public.impact_reports(is_published);
CREATE INDEX idx_impact_reports_period ON public.impact_reports(report_period_start, report_period_end);
CREATE INDEX idx_impact_reports_created_at ON public.impact_reports(created_at);
