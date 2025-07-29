-- Enable pg_cron extension for scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the verify-pending-payments function to run every 15 minutes
SELECT cron.schedule(
  'verify-pending-payments',
  '*/15 * * * *', -- every 15 minutes
  $$
  select
    net.http_post(
        url:='https://uhktrhswjsjflwcudway.supabase.co/functions/v1/verify-pending-payments',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoa3RyaHN3anNqZmx3Y3Vkd2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjQyNTYsImV4cCI6MjA2Njk0MDI1Nn0.LXNpLw_SwqlHe4ThFoXPWOGsSl15wiX5rgFfgmySd_Y"}'::jsonb,
        body:=concat('{"scheduled": true, "time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- Create function to check scheduled jobs
CREATE OR REPLACE FUNCTION get_cron_jobs()
RETURNS TABLE(jobid bigint, schedule text, command text, nodename text, nodeport integer, database text, username text, active boolean)
AS $$
BEGIN
  RETURN QUERY SELECT * FROM cron.job;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;