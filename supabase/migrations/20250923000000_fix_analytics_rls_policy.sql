-- Fix analytics_events RLS policy to allow both anonymous and authenticated users to track events
-- Drop the existing policy
DROP POLICY IF EXISTS "Allow anonymous analytics tracking" ON analytics_events;

-- Create a new policy that allows both anonymous and authenticated users to insert
CREATE POLICY "Allow analytics tracking for all users" ON analytics_events
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

-- Also allow public role (service_role equivalent) for broader compatibility
CREATE POLICY "Allow public analytics tracking" ON analytics_events
    FOR INSERT 
    TO public
    WITH CHECK (true);