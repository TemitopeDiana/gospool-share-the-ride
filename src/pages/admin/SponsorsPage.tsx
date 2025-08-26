
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { SponsorForm } from '@/components/admin/SponsorForm';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { useApprovalWorkflow } from '@/hooks/useApprovalWorkflow';

export const SponsorsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { handleChange, isSuperAdmin } = useApprovalWorkflow();

  const { data: sponsors = [], isLoading } = useQuery({
    queryKey: ['admin-impact-sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('impact_sponsors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const directAction = async () => {
        const { error } = await supabase
          .from('impact_sponsors')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
      };

      await handleChange(
        'impact_sponsors',
        'DELETE',
        directAction,
        id
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-impact-sponsors'] });
      toast({
        title: "Sponsor deleted",
        description: isSuperAdmin ? 
          "Impact sponsor has been deleted successfully." :
          "Your deletion request has been submitted for approval.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete sponsor.",
        variant: "destructive",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const directAction = async () => {
        const { error } = await supabase
          .from('impact_sponsors')
          .update({ is_active })
          .eq('id', id);
        
        if (error) throw error;
      };

      await handleChange(
        'impact_sponsors',
        'UPDATE',
        directAction,
        id,
        { is_active: !is_active },
        { is_active }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-impact-sponsors'] });
      toast({
        title: "Status updated",
        description: isSuperAdmin ? 
          "Sponsor status has been updated successfully." :
          "Your change has been submitted for approval.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update sponsor status.",
        variant: "destructive",
      });
    },
  });

  const columns = [
    {
      key: 'sponsor_name',
      label: 'Sponsor Name',
      render: (value: string) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
    },
    {
      key: 'sponsor_type',
      label: 'Type',
    },
    {
      key: 'tier',
      label: 'Tier',
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'gold' ? 'bg-yellow-100 text-yellow-800' :
          value === 'silver' ? 'bg-gray-100 text-gray-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {value?.toUpperCase()}
        </span>
      ),
    },
    {
      key: 'contribution_amount',
      label: 'Amount',
      render: (value: number) => value ? `₦${Number(value).toLocaleString()}` : '-',
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (value: boolean) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Added',
      render: (value: string) => format(new Date(value), 'MMM dd, yyyy'),
    },
  ];

  const handleEdit = (sponsor: any) => {
    setEditingSponsor(sponsor);
    setIsFormOpen(true);
  };

  const handleDelete = (sponsor: any) => {
    if (confirm('Are you sure you want to delete this sponsor?')) {
      deleteMutation.mutate(sponsor.id);
    }
  };

  const handleToggleActive = (sponsor: any) => {
    toggleActiveMutation.mutate({ 
      id: sponsor.id, 
      is_active: !sponsor.is_active 
    });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingSponsor(null);
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Impact Sponsors</h1>
            <p className="text-gray-600">Manage active sponsors displayed on the website</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Sponsor
          </Button>
        </div>

        <AdminDataTable
          data={sponsors}
          columns={columns}
          searchKey="sponsor_name"
          onEdit={handleEdit}
          onDelete={handleDelete}
          customActions={(item) => [
            {
              label: item.is_active ? 'Deactivate' : 'Activate',
              onClick: () => handleToggleActive(item),
              variant: item.is_active ? 'outline' : 'default',
            }
          ]}
        />

        {isFormOpen && (
          <SponsorForm
            sponsor={editingSponsor}
            onClose={handleFormClose}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['admin-impact-sponsors'] });
              handleFormClose();
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};
