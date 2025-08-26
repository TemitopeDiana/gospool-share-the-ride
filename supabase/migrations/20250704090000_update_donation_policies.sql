
-- Drop existing RLS policy for donations
DROP POLICY IF EXISTS "Admins can manage donations" ON public.donations;

-- Create new policies that allow public donation creation but admin management
CREATE POLICY "Anyone can create donations" 
  ON public.donations 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can manage all donations" 
  ON public.donations 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Allow public to view non-anonymous donations for the recent donors section
CREATE POLICY "Public can view non-anonymous completed donations" 
  ON public.donations 
  FOR SELECT 
  USING (
    status = 'completed' AND 
    is_anonymous = false
  );
