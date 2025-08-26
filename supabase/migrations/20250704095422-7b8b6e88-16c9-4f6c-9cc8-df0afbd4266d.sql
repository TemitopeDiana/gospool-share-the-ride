
-- Add super_admin role to the existing user_role enum
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'super_admin';

-- Create pending_changes table for approval workflow
CREATE TABLE public.pending_changes (
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

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pending_changes_status ON public.pending_changes(status);
CREATE INDEX IF NOT EXISTS idx_pending_changes_table_name ON public.pending_changes(table_name);
CREATE INDEX IF NOT EXISTS idx_pending_changes_created_by ON public.pending_changes(created_by);
