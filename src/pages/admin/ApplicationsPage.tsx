
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { ExternalLink, Download } from 'lucide-react';

type ApplicationStatus = Database['public']['Enums']['application_status'];

export const ApplicationsPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['admin-team-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ApplicationStatus }) => {
      const { error } = await supabase
        .from('team_applications')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team-applications'] });
      toast({
        title: "Status updated",
        description: "Application status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive",
      });
    },
  });

  const columns = [
    {
      key: 'full_name',
      label: 'Applicant Name',
      render: (value: string) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (value: string) => value,
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value: string) => value || 'N/A',
    },
    {
      key: 'position_applied',
      label: 'Position',
      render: (value: string) => value,
    },
    {
      key: 'experience',
      label: 'Experience',
      render: (value: string) => value ? (value.length > 50 ? `${value.substring(0, 50)}...` : value) : 'N/A',
    },
    {
      key: 'motivation',
      label: 'Motivation',
      render: (value: string) => value ? (value.length > 50 ? `${value.substring(0, 50)}...` : value) : 'N/A',
    },
    {
      key: 'created_at',
      label: 'Applied Date',
      render: (value: string) => format(new Date(value), 'MMM dd, yyyy'),
    },
    {
      key: 'resume_url',
      label: 'Resume',
      render: (value: string) => value ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(value, '_blank')}
        >
          <Download className="h-4 w-4" />
        </Button>
      ) : 'N/A',
    },
    {
      key: 'portfolio_url',
      label: 'Portfolio',
      render: (value: string) => value ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(value, '_blank')}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      ) : 'N/A',
    },
  ];

  const handleApprove = (application: any) => {
    updateStatusMutation.mutate({ id: application.id, status: 'approved' as ApplicationStatus });
  };

  const handleReject = (application: any) => {
    updateStatusMutation.mutate({ id: application.id, status: 'rejected' as ApplicationStatus });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Applications</h1>
          <p className="text-gray-600">Review and manage job applications</p>
        </div>

        <AdminDataTable
          data={applications}
          columns={columns}
          searchKey="full_name"
          showStatus={true}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </AdminLayout>
  );
};
