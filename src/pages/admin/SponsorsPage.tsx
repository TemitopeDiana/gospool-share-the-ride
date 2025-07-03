
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SponsorForm } from '@/components/admin/SponsorForm';
import { AdminDataTable } from '@/components/admin/AdminDataTable';

export const SponsorsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sponsors = [], isLoading } = useQuery({
    queryKey: ['admin-impact-sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('impact_sponsors')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('impact_sponsors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-impact-sponsors'] });
      toast({
        title: "Impact sponsor deleted",
        description: "Impact sponsor has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete impact sponsor.",
        variant: "destructive",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('impact_sponsors')
        .update({ is_active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-impact-sponsors'] });
      toast({
        title: "Status updated",
        description: "Impact sponsor status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update impact sponsor status.",
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
      render: (value: string) => value,
    },
    {
      key: 'tier',
      label: 'Tier',
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'platinum' ? 'bg-gray-100 text-gray-800' :
          value === 'gold' ? 'bg-yellow-100 text-yellow-800' :
          value === 'silver' ? 'bg-gray-100 text-gray-600' :
          'bg-orange-100 text-orange-800'
        }`}>
          {value || 'Bronze'}
        </span>
      ),
    },
    {
      key: 'contribution_amount',
      label: 'Contribution',
      render: (value: number) => value ? `₦${Number(value).toLocaleString()}` : 'N/A',
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
      key: 'order_index',
      label: 'Order',
      render: (value: number) => value || 0,
    },
  ];

  const handleEdit = (sponsor: any) => {
    setEditingSponsor(sponsor);
    setIsFormOpen(true);
  };

  const handleDelete = (sponsor: any) => {
    if (window.confirm('Are you sure you want to delete this impact sponsor?')) {
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
            <p className="text-gray-600">Manage impact sponsors and partnerships</p>
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
