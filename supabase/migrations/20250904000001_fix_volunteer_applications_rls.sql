-- Fix RLS policies for volunteer_applications to allow public submissions
-- The current policies require authentication but the volunteer form should be accessible to everyone

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage volunteer applications" ON public.volunteer_applications;
DROP POLICY IF EXISTS "Users can manage own volunteer applications" ON public.volunteer_applications;

-- Create new policies
-- Allow anyone to insert volunteer applications (for public form submissions)
CREATE POLICY "Anyone can submit volunteer applications" 
  ON public.volunteer_applications 
  FOR INSERT 
  WITH CHECK (true);

-- Allow admins to view and manage all volunteer applications
CREATE POLICY "Admins can manage volunteer applications" 
  ON public.volunteer_applications 
  FOR ALL 
  USING (public.is_admin());

-- Allow users to view their own applications (if they're logged in and have matching email)
CREATE POLICY "Users can view own volunteer applications" 
  ON public.volunteer_applications 
  FOR SELECT 
  USING (
    auth.jwt() ->> 'email' = email OR 
    public.is_admin()
  );
