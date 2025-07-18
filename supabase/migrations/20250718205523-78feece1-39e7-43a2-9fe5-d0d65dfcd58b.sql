-- Add RLS policy to allow public users to submit sponsorship applications
CREATE POLICY "Anyone can submit sponsorship applications" 
ON public.sponsorship_applications 
FOR INSERT 
WITH CHECK (true);