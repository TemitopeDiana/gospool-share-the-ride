-- Fix function search path security warnings by adding SET search_path TO ''
-- Update the new functions to have proper search path

-- Fix get_donation_statistics function
CREATE OR REPLACE FUNCTION public.get_donation_statistics()
RETURNS TABLE (
  total_amount numeric,
  total_count bigint,
  avg_amount numeric,
  currency text
) 
LANGUAGE plpgsql 
SECURITY DEFINER 
STABLE
SET search_path TO ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(amount), 0) as total_amount,
    COUNT(*) as total_count,
    COALESCE(AVG(amount), 0) as avg_amount,
    'NGN'::text as currency
  FROM public.donations 
  WHERE status = 'completed'::donation_status;
END;
$$;

-- Fix get_recent_donations_public function
CREATE OR REPLACE FUNCTION public.get_recent_donations_public(limit_count integer DEFAULT 10)
RETURNS TABLE (
  amount numeric,
  currency text,
  created_at timestamp with time zone,
  donor_type text,
  is_anonymous boolean
) 
LANGUAGE plpgsql 
SECURITY DEFINER 
STABLE
SET search_path TO ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.amount,
    d.currency,
    d.created_at,
    d.donor_type,
    d.is_anonymous
  FROM public.donations d
  WHERE d.status = 'completed'::donation_status
  AND d.is_anonymous = false
  ORDER BY d.created_at DESC
  LIMIT limit_count;
END;
$$;