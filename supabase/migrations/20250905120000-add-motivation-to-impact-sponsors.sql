-- Add motivation column to impact_sponsors table
ALTER TABLE public.impact_sponsors 
ADD COLUMN motivation TEXT;
