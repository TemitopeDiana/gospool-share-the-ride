
-- Fix the is_admin function security vulnerability by setting search_path
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
  );
$$;

-- Create is_super_admin function with proper security
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
$$;

-- Update the has_permission function to also set search_path
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission_type text, _action text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT CASE 
    WHEN _action = 'view' THEN COALESCE(ap.can_view, false)
    WHEN _action = 'edit' THEN COALESCE(ap.can_edit, false)
    ELSE false
  END
  FROM public.admin_permissions ap
  WHERE ap.user_id = _user_id 
    AND ap.permission_type = _permission_type
  UNION ALL
  SELECT public.is_admin() AND _user_id = auth.uid()
  LIMIT 1;
$$;

-- Find and assign super_admin role to temitopediana1@gmail.com
-- First, let's create a function to safely assign super admin role
CREATE OR REPLACE FUNCTION public.assign_super_admin(user_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  target_user_id uuid;
  result_message text;
BEGIN
  -- Find the user by email in auth.users
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RETURN 'User not found with email: ' || user_email;
  END IF;
  
  -- Insert or update the user role to super_admin
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'super_admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Also ensure they have admin permissions
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN 'Successfully assigned super_admin role to: ' || user_email;
END;
$$;

-- Execute the function to assign super admin
SELECT public.assign_super_admin('temitopediana1@gmail.com');

-- Create volunteer applications table (extending team_applications for volunteers)
CREATE TABLE IF NOT EXISTS public.volunteer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  skills TEXT,
  experience TEXT,
  motivation TEXT,
  availability TEXT,
  preferred_areas TEXT[], -- Array of areas they want to help with
  resume_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status public.application_status DEFAULT 'pending',
  user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS on volunteer_applications
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for volunteer_applications
CREATE POLICY "Admins can manage volunteer applications" 
  ON public.volunteer_applications 
  FOR ALL 
  USING (public.is_admin());

CREATE POLICY "Users can manage own volunteer applications" 
  ON public.volunteer_applications 
  FOR ALL 
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_status ON public.volunteer_applications(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_email ON public.volunteer_applications(email);
