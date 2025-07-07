
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, FileText, Award, Briefcase, Newspaper } from 'lucide-react';

export const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [donations, allDonations, sponsorships, reports, projects, news, applications] = await Promise.all([
        supabase.from('donations').select('amount').eq('status', 'completed'),
        supabase.from('donations').select('status', { count: 'exact' }),
        supabase.from('sponsorship_applications').select('id', { count: 'exact' }),
        supabase.from('impact_reports_requests').select('id', { count: 'exact' }),
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('news').select('id', { count: 'exact' }),
        supabase.from('team_applications').select('id', { count: 'exact' }),
      ]);

      const totalDonations = donations.data?.reduce((sum, d) => sum + Number(d.amount || 0), 0) || 0;
      const completedDonationsCount = donations.data?.length || 0;

      return {
        totalDonations,
        completedDonationsCount,
        totalDonationCount: allDonations.count || 0,
        sponsorshipCount: sponsorships.count || 0,
        reportCount: reports.count || 0,
        projectCount: projects.count || 0,
        newsCount: news.count || 0,
        applicationCount: applications.count || 0,
      };
    },
  });

  const statCards = [
    {
      title: 'Total Donations (Completed)',
      value: `₦${(stats?.totalDonations || 0).toLocaleString()}`,
      description: `${stats?.completedDonationsCount || 0} successful donations of ${stats?.totalDonationCount || 0} total`,
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Sponsorship Applications',
      value: stats?.sponsorshipCount || 0,
      description: 'Applications submitted',
      icon: Award,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Impact Reports',
      value: stats?.reportCount || 0,
      description: 'Reports requested',
      icon: FileText,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Active Projects',
      value: stats?.projectCount || 0,
      description: 'Projects in progress',
      icon: Briefcase,
      color: 'text-orange-600 dark:text-orange-400',
    },
    {
      title: 'News Articles',
      value: stats?.newsCount || 0,
      description: 'Published articles',
      icon: Newspaper,
      color: 'text-red-600 dark:text-red-400',
    },
    {
      title: 'Team Applications',
      value: stats?.applicationCount || 0,
      description: 'Applications to join team',
      icon: Users,
      color: 'text-indigo-600 dark:text-indigo-400',
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-8">
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="h-5 bg-muted rounded w-96"></div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Welcome to the Gospool admin dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {statCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-all duration-200 border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <CardDescription className="text-xs text-muted-foreground">
                  {stat.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};
