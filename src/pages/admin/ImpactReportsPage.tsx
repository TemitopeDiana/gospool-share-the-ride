
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Database } from '@/integrations/supabase/types';

type ApplicationStatus = Database['public']['Enums']['application_status'];

export const ImpactReportsPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['admin-impact-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('impact_reports_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ApplicationStatus }) => {
      const { error } = await supabase
        .from('impact_reports_requests')
        .update({ 
          status,
          sent_at: status === 'approved' ? new Date().toISOString() : null
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-impact-reports'] });
      toast({
        title: "Status updated",
        description: "Impact report request status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update impact report request status.",
        variant: "destructive",
      });
    },
  });

  const columns = [
    {
      key: 'requester_name',
      label: 'Requester Name',
      render: (value: string) => value || 'N/A',
    },
    {
      key: 'requester_email',
      label: 'Email',
      render: (value: string) => value,
    },
    {
      key: 'organization',
      label: 'Organization',
      render: (value: string) => value || 'N/A',
    },
    {
      key: 'report_type',
      label: 'Report Type',
      render: (value: string) => value || 'General',
    },
    {
      key: 'purpose',
      label: 'Purpose',
      render: (value: string) => value ? (value.length > 50 ? `${value.substring(0, 50)}...` : value) : 'N/A',
    },
    {
      key: 'created_at',
      label: 'Requested Date',
      render: (value: string) => format(new Date(value), 'MMM dd, yyyy'),
    },
    {
      key: 'sent_at',
      label: 'Sent Date',
      render: (value: string) => value ? format(new Date(value), 'MMM dd, yyyy') : 'Not sent',
    },
  ];

  const handleApprove = (report: any) => {
    updateStatusMutation.mutate({ id: report.id, status: 'approved' as ApplicationStatus });
  };

  const handleReject = (report: any) => {
    updateStatusMutation.mutate({ id: report.id, status: 'rejected' as ApplicationStatus });
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
          <h1 className="text-2xl font-bold text-gray-900">Impact Reports</h1>
          <p className="text-gray-600">Manage impact report requests and distribution</p>
        </div>

        <AdminDataTable
          data={reports}
          columns={columns}
          searchKey="requester_name"
          showStatus={true}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </AdminLayout>
  );
};
