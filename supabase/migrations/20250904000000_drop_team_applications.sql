-- Drop team_applications table and related policies
-- This table is being replaced by the volunteer_applications table

-- Drop RLS policies first
DROP POLICY IF EXISTS "Admins can manage team applications" ON public.team_applications;
DROP POLICY IF EXISTS "Users can manage own applications" ON public.team_applications;

-- Drop the table
DROP TABLE IF EXISTS public.team_applications;
