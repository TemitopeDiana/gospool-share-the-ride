-- Restore missing July 4th database elements (corrected)

-- 1. Add super_admin role to user_role enum (must be done first)
ALTER TYPE public.user_role ADD VALUE 'super_admin';

-- 2. Update donation policies (from 20250704090000_update_donation_policies.sql)
DROP POLICY IF EXISTS "Admins can manage donations" ON public.donations;

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
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Public can view non-anonymous completed donations" 
  ON public.donations 
  FOR SELECT 
  USING (
    status = 'completed' AND 
    is_anonymous = false
  );

-- 3. Create pending_changes table (from 20250704095422)
CREATE TABLE IF NOT EXISTS public.pending_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('INSERT', 'UPDATE', 'DELETE')),
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  rejected_by UUID REFERENCES auth.users(id),
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Enable RLS on pending_changes
ALTER TABLE public.pending_changes ENABLE ROW LEVEL SECURITY;

-- Create policies for pending_changes
CREATE POLICY "Admins can view pending changes" 
  ON public.pending_changes 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can create pending changes" 
  ON public.pending_changes 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Super admins can manage pending changes" 
  ON public.pending_changes 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- 4. Create enhanced security functions (from 20250705145708)
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

-- 5. Create pending changes management functions (from 20250704100635)
CREATE OR REPLACE FUNCTION public.create_pending_change(
  p_table_name TEXT,
  p_action_type TEXT,
  p_record_id UUID DEFAULT NULL,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.pending_changes (
    table_name,
    action_type,
    record_id,
    old_data,
    new_data,
    created_by
  ) VALUES (
    p_table_name,
    p_action_type,
    p_record_id,
    p_old_data,
    p_new_data,
    auth.uid()
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_pending_changes()
RETURNS TABLE (
  id UUID,
  table_name TEXT,
  action_type TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_by UUID,
  created_at TIMESTAMPTZ,
  status TEXT,
  created_by_profile JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pc.id,
    pc.table_name,
    pc.action_type,
    pc.record_id,
    pc.old_data,
    pc.new_data,
    pc.created_by,
    pc.created_at,
    pc.status,
    jsonb_build_object(
      'full_name', au.full_name,
      'email', au.email
    ) as created_by_profile
  FROM public.pending_changes pc
  LEFT JOIN public.admin_users au ON pc.created_by = au.user_id
  WHERE pc.status = 'pending'
  ORDER BY pc.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.approve_pending_change(change_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.pending_changes 
  SET 
    status = 'approved',
    approved_by = auth.uid(),
    approved_at = NOW()
  WHERE id = change_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_pending_change(
  change_id UUID,
  reason TEXT DEFAULT 'No reason provided'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.pending_changes 
  SET 
    status = 'rejected',
    rejected_by = auth.uid(),
    rejected_at = NOW(),
    rejection_reason = reason
  WHERE id = change_id;
END;
$$;

-- 6. Update has_permission function with proper security
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

-- 7. Create function to assign super admin role
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

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pending_changes_status ON public.pending_changes(status);
CREATE INDEX IF NOT EXISTS idx_pending_changes_table_name ON public.pending_changes(table_name);
CREATE INDEX IF NOT EXISTS idx_pending_changes_created_by ON public.pending_changes(created_by);

-- 9. Assign super admin role to temitopediana1@gmail.com
SELECT public.assign_super_admin('temitopediana1@gmail.com');