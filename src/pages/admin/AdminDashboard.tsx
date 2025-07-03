
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, FileText, Award, Briefcase, Newspaper } from 'lucide-react';

export const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [donations, sponsorships, reports, projects, news, applications] = await Promise.all([
        supabase.from('donations').select('amount', { count: 'exact' }),
        supabase.from('sponsorship_applications').select('id', { count: 'exact' }),
        supabase.from('impact_reports_requests').select('id', { count: 'exact' }),
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('news').select('id', { count: 'exact' }),
        supabase.from('team_applications').select('id', { count: 'exact' }),
      ]);

      const totalDonations = donations.data?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;

      return {
        totalDonations,
        donationCount: donations.count || 0,
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
      title: 'Total Donations',
      value: `₦${stats?.totalDonations.toLocaleString() || 0}`,
      description: `${stats?.donationCount || 0} donations received`,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Sponsorship Applications',
      value: stats?.sponsorshipCount || 0,
      description: 'Applications submitted',
      icon: Award,
      color: 'text-blue-600',
    },
    {
      title: 'Impact Reports',
      value: stats?.reportCount || 0,
      description: 'Reports requested',
      icon: FileText,
      color: 'text-purple-600',
    },
    {
      title: 'Active Projects',
      value: stats?.projectCount || 0,
      description: 'Projects in progress',
      icon: Briefcase,
      color: 'text-orange-600',
    },
    {
      title: 'News Articles',
      value: stats?.newsCount || 0,
      description: 'Published articles',
      icon: Newspaper,
      color: 'text-red-600',
    },
    {
      title: 'Team Applications',
      value: stats?.applicationCount || 0,
      description: 'Applications to join team',
      icon: Users,
      color: 'text-indigo-600',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to the Gospool admin dashboard</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
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
