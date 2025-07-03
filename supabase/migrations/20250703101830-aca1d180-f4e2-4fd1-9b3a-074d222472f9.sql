
-- Create admin permissions table for granular access control
CREATE TABLE public.admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  permission_type TEXT NOT NULL,
  can_view BOOLEAN DEFAULT TRUE,
  can_edit BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, permission_type)
);

-- Enable RLS on admin_permissions
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- Create policy for admin permissions
CREATE POLICY "Admins can manage admin permissions" ON public.admin_permissions
  FOR ALL USING (public.is_admin());

-- Add missing columns to existing tables
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS team_role TEXT DEFAULT 'member';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_permissions_user_id ON public.admin_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_permission_type ON public.admin_permissions(permission_type);

-- Insert default permissions for existing admin users
INSERT INTO public.admin_permissions (user_id, permission_type, can_view, can_edit)
SELECT 
  ur.user_id,
  perm.permission_type,
  TRUE,
  TRUE
FROM public.user_roles ur
CROSS JOIN (
  VALUES 
    ('donations'),
    ('sponsorships'), 
    ('reports'),
    ('projects'),
    ('news'),
    ('team'),
    ('advisors'),
    ('sponsors'),
    ('applications')
) AS perm(permission_type)
WHERE ur.role = 'admin'
ON CONFLICT (user_id, permission_type) DO NOTHING;

-- Create function to check specific permissions
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission_type text, _action text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
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
