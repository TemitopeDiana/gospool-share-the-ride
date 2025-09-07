-- Add pitch deck file field to impact_reports_requests table
ALTER TABLE public.impact_reports_requests 
ADD COLUMN pitch_deck_file_url TEXT,
ADD COLUMN approved_by uuid REFERENCES auth.users(id),
ADD COLUMN approved_at TIMESTAMPTZ;

-- Create index for pitch deck requests
CREATE INDEX idx_impact_reports_requests_pitch_deck ON public.impact_reports_requests(report_type) WHERE report_type = 'pitch_deck';
