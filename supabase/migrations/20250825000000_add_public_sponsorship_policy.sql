-- Add policy to allow public users to submit sponsorship applications
CREATE POLICY "Public can submit sponsorship applications"
  ON public.sponsorship_applications
  FOR INSERT
  WITH CHECK (true);

-- Add policy to allow users to view their own sponsorship applications
CREATE POLICY "Users can view own sponsorship applications"
  ON public.sponsorship_applications
  FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);
