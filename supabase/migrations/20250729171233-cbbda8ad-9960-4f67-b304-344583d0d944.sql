-- Fix RLS policy for sponsorship_applications to allow public submissions
DROP POLICY IF EXISTS "Anyone can submit sponsorship applications" ON public.sponsorship_applications;

-- Create a more explicit policy for public insertions
CREATE POLICY "Public can submit sponsorship applications" 
ON public.sponsorship_applications 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Ensure the admin policy doesn't conflict with insertions
DROP POLICY IF EXISTS "Admins can manage sponsorship applications" ON public.sponsorship_applications;

CREATE POLICY "Admins can view and manage sponsorship applications" 
ON public.sponsorship_applications 
FOR ALL 
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());