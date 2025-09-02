import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Users, MousePointer, Heart, HandHeart, UserCheck, RotateCcw } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('30');

  // Get date range based on selection
  const getDateRange = () => {
    const days = parseInt(timeRange);
    const endDate = endOfDay(new Date());
    const startDate = startOfDay(subDays(new Date(), days));
    return { startDate, endDate };
  };

  // Fetch analytics summary
  const { data: summary = [], isLoading: summaryLoading } = useQuery({
    queryKey: ['analytics-summary', timeRange],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange();
      const { data, error } = await supabase
        .from('analytics_summary')
        .select('*')
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch conversion rate
  const { data: conversionData } = useQuery({
    queryKey: ['conversion-rate', timeRange],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange();
      const { data, error } = await supabase.rpc('get_donation_conversion_rate', {
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd')
      });
      
      if (error) throw error;
      return data[0] || { initiated_count: 0, completed_count: 0, conversion_rate: 0 };
    },
  });

  // Fetch popular pages
  const { data: popularPages = [] } = useQuery({
    queryKey: ['popular-pages', timeRange],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange();
      const { data, error } = await supabase
        .from('analytics_events')
        .select('page_path')
        .eq('event_type', 'page_view')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());
      
      if (error) throw error;

      // Count page views
      const pageCounts = data.reduce((acc, { page_path }) => {
        if (page_path) {
          acc[page_path] = (acc[page_path] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(pageCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 10)
        .map(([path, views]) => ({ path, views: views as number }));
    },
  });

  // Calculate totals
  const totals = summary.reduce((acc, day) => ({
    totalEvents: acc.totalEvents + (day.total_events || 0),
    uniqueVisitors: acc.uniqueVisitors + (day.unique_visitors || 0),
    pageViews: acc.pageViews + (day.page_views || 0),
    donationsCompleted: acc.donationsCompleted + (day.donations_completed || 0),
    sponsorApplications: acc.sponsorApplications + (day.sponsor_applications || 0),
    volunteerApplications: acc.volunteerApplications + (day.volunteer_applications || 0),
    returningVisitors: acc.returningVisitors + (day.returning_visitors || 0),
  }), {
    totalEvents: 0,
    uniqueVisitors: 0,
    pageViews: 0,
    donationsCompleted: 0,
    sponsorApplications: 0,
    volunteerApplications: 0,
    returningVisitors: 0,
  });

  const MetricCard = ({ title, value, icon: Icon, description, trend }: {
    title: string;
    value: string | number;
    icon: any;
    description?: string;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <Badge variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'} className="mt-2">
            <TrendingUp className="h-3 w-3 mr-1" />
            {trend}
          </Badge>
        )}
      </CardContent>
    </Card>
  );

  if (summaryLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Unique Visitors"
          value={totals.uniqueVisitors.toLocaleString()}
          icon={Users}
          description={`${totals.pageViews.toLocaleString()} page views total`}
        />
        
        <MetricCard
          title="Donation Conversion Rate"
          value={`${conversionData?.conversion_rate || 0}%`}
          icon={TrendingUp}
          description={`${conversionData?.completed_count || 0} / ${conversionData?.initiated_count || 0} completed`}
        />

        <MetricCard
          title="Impact Sponsors"
          value={totals.sponsorApplications}
          icon={Heart}
          description="New sponsor applications"
        />

        <MetricCard
          title="Volunteer Applications"
          value={totals.volunteerApplications}
          icon={HandHeart}
          description="People wanting to help"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Returning Visitors"
          value={`${totals.returningVisitors} (${Math.round((totals.returningVisitors / totals.uniqueVisitors) * 100) || 0}%)`}
          icon={RotateCcw}
          description="Users coming back"
        />

        <MetricCard
          title="Donations Completed"
          value={totals.donationsCompleted}
          icon={UserCheck}
          description="Successful donations"
        />

        <MetricCard
          title="Total Interactions"
          value={totals.totalEvents.toLocaleString()}
          icon={MousePointer}
          description="All tracked events"
        />
      </div>

      {/* Popular Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Pages</CardTitle>
          <CardDescription>Top pages by views in the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {popularPages.length > 0 ? (
              popularPages.map((page, index) => (
                <div key={page.path} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">{index + 1}</Badge>
                    <span className="font-mono text-sm">{page.path}</span>
                  </div>
                  <Badge>{String(page.views)} views</Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No page view data available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Daily Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Activity</CardTitle>
          <CardDescription>Recent daily metrics breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summary.slice(0, 10).map((day) => (
              <div key={day.date} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">{format(new Date(day.date), 'MMM dd')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Visitors</p>
                  <p className="text-sm font-bold">{day.unique_visitors || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Page Views</p>
                  <p className="text-sm font-bold">{day.page_views || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Donations</p>
                  <p className="text-sm font-bold">{day.donations_completed || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sponsors</p>
                  <p className="text-sm font-bold">{day.sponsor_applications || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Volunteers</p>
                  <p className="text-sm font-bold">{day.volunteer_applications || 0}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
