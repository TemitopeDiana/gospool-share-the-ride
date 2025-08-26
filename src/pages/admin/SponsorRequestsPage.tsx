
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Database } from '@/integrations/supabase/types';
import { useApprovalWorkflow } from '@/hooks/useApprovalWorkflow';

type ApplicationStatus = Database['public']['Enums']['application_status'];

export const SponsorRequestsPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { handleChange, isSuperAdmin } = useApprovalWorkflow();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['admin-sponsor-requests'],
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
      const directAction = async () => {
        const { error } = await supabase
          .from('sponsorship_applications')
          .update({ status })
          .eq('id', id);
        
        if (error) throw error;
      };

      await handleChange(
        'sponsorship_applications',
        'UPDATE',
        directAction,
        id,
        { status: 'pending' },
        { status }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sponsor-requests'] });
      toast({
        title: "Status updated",
        description: isSuperAdmin ? 
          "Sponsorship application status has been updated successfully." :
          "Your change has been submitted for approval.",
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

  const createImpactSponsorMutation = useMutation({
    mutationFn: async (application: any) => {
      const directAction = async () => {
        const { error } = await supabase
          .from('impact_sponsors')
          .insert({
            application_id: application.id,
            sponsor_name: application.organization_name || application.contact_person,
            sponsor_type: application.sponsor_type,
            contribution_amount: application.sponsor_amount,
            tier: application.sponsor_amount > 1000000 ? 'gold' : 
                  application.sponsor_amount > 500000 ? 'silver' : 'bronze',
            is_active: true,
          });
        
        if (error) throw error;
      };

      await handleChange(
        'impact_sponsors',
        'INSERT',
        directAction,
        undefined,
        undefined,
        {
          sponsor_name: application.organization_name || application.contact_person,
          sponsor_type: application.sponsor_type,
          contribution_amount: application.sponsor_amount,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sponsor-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-impact-sponsors'] });
    },
  });

  const extractChurchDenomination = (motivation: string) => {
    if (!motivation) return null;
    const match = motivation.match(/Church Denomination:\s*([^\n]+)/i);
    return match ? match[1].trim() : null;
  };

  const columns = [
    {
      key: 'organization_name',
      label: 'Organization',
      render: (value: string, row: any) => value || row.contact_person || 'Individual',
    },
    {
      key: 'contact_person',
      label: 'Contact Person',
      render: (value: string) => value || 'N/A',
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
      key: 'sponsor_duration',
      label: 'Duration',
      render: (value: string) => value || 'N/A',
    },
    {
      key: 'motivation',
      label: 'Church Denomination',
      render: (value: string) => extractChurchDenomination(value) || 'N/A',
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value: string) => value || 'N/A',
    },
    {
      key: 'created_at',
      label: 'Applied',
      render: (value: string) => format(new Date(value), 'MMM dd, yyyy'),
    },
  ];

  const handleApprove = async (application: any) => {
    // First update the application status
    await updateStatusMutation.mutateAsync({ 
      id: application.id, 
      status: 'approved' as ApplicationStatus 
    });
    
    // Then create the impact sponsor record
    await createImpactSponsorMutation.mutateAsync(application);
  };

  const handleReject = (application: any) => {
    updateStatusMutation.mutate({ 
      id: application.id, 
      status: 'rejected' as ApplicationStatus 
    });
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
          <h1 className="text-2xl font-bold text-gray-900">Sponsor Requests</h1>
          <p className="text-gray-600">Review and approve pending sponsorship applications</p>
        </div>

        <AdminDataTable
          data={applications}
          columns={columns}
          searchKey="organization_name"
          showStatus={false}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </AdminLayout>
  );
};
