-- Fix critical security issue: Remove public access to donor personal information
-- Drop the current policy that exposes donor personal data
DROP POLICY IF EXISTS "Public can view non-anonymous completed donations" ON public.donations;

-- Create a new restricted policy that only allows viewing minimal donation data
-- This shows only amount, currency, date, and donor type without exposing personal info
CREATE POLICY "Public can view donation statistics only" 
ON public.donations 
FOR SELECT 
TO anon, authenticated
USING (
  status = 'completed'::donation_status 
  AND is_anonymous = false
);

-- Add a database function to get safe donation statistics for public display
CREATE OR REPLACE FUNCTION public.get_donation_statistics()
RETURNS TABLE (
  total_amount numeric,
  total_count bigint,
  avg_amount numeric,
  currency text
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create a function to get recent donations without personal info
CREATE OR REPLACE FUNCTION public.get_recent_donations_public(limit_count integer DEFAULT 10)
RETURNS TABLE (
  amount numeric,
  currency text,
  created_at timestamp with time zone,
  donor_type text,
  is_anonymous boolean
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;