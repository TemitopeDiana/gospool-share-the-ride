import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Database } from '@/integrations/supabase/types';

type ApplicationStatus = Database['public']['Enums']['application_status'];

export const SponsorshipsPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['admin-sponsorships'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsorship_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ApplicationStatus }) => {
      const { error } = await supabase
        .from('sponsorship_applications')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sponsorships'] });
      toast({
        title: "Status updated",
        description: "Sponsorship application status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive",
      });
    },
  });

  const columns = [
    {
      key: 'organization_name',
      label: 'Organization',
      render: (value: string) => value || 'Individual',
    },
    {
      key: 'contact_person',
      label: 'Contact Person',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'sponsor_type',
      label: 'Sponsor Type',
    },
    {
      key: 'sponsor_amount',
      label: 'Amount',
      render: (value: number) => value ? `₦${Number(value).toLocaleString()}` : '-',
    },
    {
      key: 'created_at',
      label: 'Applied',
      render: (value: string) => format(new Date(value), 'MMM dd, yyyy'),
    },
  ];

  const handleApprove = async (application: any) => {
    updateStatusMutation.mutate({ id: application.id, status: 'approved' as ApplicationStatus });
    
    // Create impact sponsor record
    const { error } = await supabase
      .from('impact_sponsors')
      .insert({
        application_id: application.id,
        sponsor_name: application.organization_name || application.contact_person,
        sponsor_type: application.sponsor_type,
        contribution_amount: application.sponsor_amount,
        tier: application.sponsor_amount > 1000000 ? 'gold' : application.sponsor_amount > 500000 ? 'silver' : 'bronze',
      });
    
    if (error) {
      console.error('Error creating impact sponsor:', error);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Sponsorship Applications</h1>
          <p className="text-gray-600">Review and manage sponsorship applications</p>
        </div>

        <AdminDataTable
          data={applications}
          columns={columns}
          searchKey="organization_name"
          showStatus={true}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </AdminLayout>
  );
};
