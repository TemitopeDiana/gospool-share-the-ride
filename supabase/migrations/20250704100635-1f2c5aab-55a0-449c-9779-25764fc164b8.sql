
-- Create function to insert pending changes
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

-- Create function to get pending changes with admin user details
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

-- Create function to approve pending changes
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

-- Create function to reject pending changes
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
