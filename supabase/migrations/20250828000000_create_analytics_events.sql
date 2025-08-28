-- Create analytics_events table for tracking website metrics
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    page_path TEXT,
    user_agent TEXT,
    referrer TEXT,
    session_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET
);

-- Create indexes for better query performance
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_page_path ON analytics_events(page_path);

-- Enable RLS (Row Level Security)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for tracking)
CREATE POLICY "Allow anonymous analytics tracking" ON analytics_events
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- Create policy for authenticated admin users to read analytics
CREATE POLICY "Allow admin read analytics" ON analytics_events
    FOR SELECT 
    TO authenticated
    USING (true);

-- Create view for analytics dashboard
CREATE VIEW analytics_summary AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_events,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(*) FILTER (WHERE event_type = 'page_view') as page_views,
    COUNT(DISTINCT session_id) FILTER (WHERE event_type = 'page_view') as unique_visitors,
    COUNT(*) FILTER (WHERE event_type = 'donation_funnel' AND metadata->>'step' = 'completed') as donations_completed,
    COUNT(*) FILTER (WHERE event_type = 'donation_funnel' AND metadata->>'step' = 'initiated') as donations_initiated,
    COUNT(*) FILTER (WHERE event_type = 'sponsor_interest' AND metadata->>'action' = 'submitted_form') as sponsor_applications,
    COUNT(*) FILTER (WHERE event_type = 'volunteer_interest' AND metadata->>'action' = 'submitted_form') as volunteer_applications,
    COUNT(*) FILTER (WHERE metadata->>'is_returning_visitor' = 'true') as returning_visitors
FROM analytics_events
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Grant access to the view
GRANT SELECT ON analytics_summary TO authenticated;

-- Create function to get conversion rates
CREATE OR REPLACE FUNCTION get_donation_conversion_rate(start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days', end_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    initiated_count BIGINT,
    completed_count BIGINT,
    conversion_rate NUMERIC
) LANGUAGE sql SECURITY DEFINER AS $$
    SELECT 
        COUNT(*) FILTER (WHERE event_type = 'donation_funnel' AND metadata->>'step' = 'initiated') as initiated_count,
        COUNT(*) FILTER (WHERE event_type = 'donation_funnel' AND metadata->>'step' = 'completed') as completed_count,
        CASE 
            WHEN COUNT(*) FILTER (WHERE event_type = 'donation_funnel' AND metadata->>'step' = 'initiated') > 0 
            THEN ROUND(
                (COUNT(*) FILTER (WHERE event_type = 'donation_funnel' AND metadata->>'step' = 'completed')::NUMERIC / 
                 COUNT(*) FILTER (WHERE event_type = 'donation_funnel' AND metadata->>'step' = 'initiated')::NUMERIC) * 100, 2
            )
            ELSE 0
        END as conversion_rate
    FROM analytics_events 
    WHERE created_at >= start_date AND created_at <= end_date;
$$;
