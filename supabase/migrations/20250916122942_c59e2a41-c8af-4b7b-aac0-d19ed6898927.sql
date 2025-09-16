-- Remove the overly permissive public donation policy
DROP POLICY IF EXISTS "Public can view donation statistics only" ON public.donations;

-- Create a secure public view for donation statistics
CREATE OR REPLACE VIEW public.donations_public AS
SELECT 
  id,
  amount,
  currency,
  created_at,
  donor_type,
  organization_name,
  CASE 
    WHEN is_anonymous = true THEN 'Anonymous'
    WHEN donor_type = 'organization' AND organization_name IS NOT NULL THEN organization_name
    WHEN donor_type = 'individual' AND donor_name IS NOT NULL THEN donor_name
    ELSE 'Anonymous'
  END as display_name,
  is_anonymous
FROM public.donations 
WHERE status = 'completed' AND show_publicly = true;

-- Enable RLS on the view
ALTER VIEW public.donations_public SET (security_barrier = true);

-- Create policy for public view access
CREATE POLICY "Public can view safe donation data" 
ON public.donations_public 
FOR SELECT 
USING (true);

-- Create a secure function for recent donations
CREATE OR REPLACE FUNCTION public.get_recent_donations_safe(limit_count integer DEFAULT 15)
RETURNS TABLE(
  amount numeric,
  currency text,
  created_at timestamp with time zone,
  display_name text,
  donor_type text,
  is_anonymous boolean
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    d.amount,
    d.currency,
    d.created_at,
    CASE 
      WHEN d.is_anonymous = true THEN 'Anonymous'::text
      WHEN d.donor_type = 'organization' AND d.organization_name IS NOT NULL THEN d.organization_name::text
      WHEN d.donor_type = 'individual' AND d.donor_name IS NOT NULL THEN d.donor_name::text
      ELSE 'Anonymous'::text
    END as display_name,
    d.donor_type,
    d.is_anonymous
  FROM public.donations d
  WHERE d.status = 'completed'::donation_status
  AND d.show_publicly = true
  ORDER BY d.created_at DESC
  LIMIT limit_count;
END;
$function$;