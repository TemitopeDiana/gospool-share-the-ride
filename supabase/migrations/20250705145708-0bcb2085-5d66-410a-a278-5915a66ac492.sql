
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

-- Update the user_role enum to include super_admin
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'super_admin';

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
