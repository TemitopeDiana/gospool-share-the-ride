
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdvisorForm } from '@/components/admin/AdvisorForm';
import { AdminDataTable } from '@/components/admin/AdminDataTable';

export const AdvisorsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAdvisor, setEditingAdvisor] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: advisors = [], isLoading } = useQuery({
    queryKey: ['admin-board-advisors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('board_advisors')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('board_advisors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-board-advisors'] });
      toast({
        title: "Board advisor deleted",
        description: "Board advisor has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete board advisor.",
        variant: "destructive",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('board_advisors')
        .update({ is_active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-board-advisors'] });
      toast({
        title: "Status updated",
        description: "Board advisor status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update board advisor status.",
        variant: "destructive",
      });
    },
  });

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value: string) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
    },
    {
      key: 'title',
      label: 'Title',
      render: (value: string) => value,
    },
    {
      key: 'company',
      label: 'Company',
      render: (value: string) => value || 'N/A',
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

  const handleEdit = (advisor: any) => {
    setEditingAdvisor(advisor);
    setIsFormOpen(true);
  };

  const handleDelete = (advisor: any) => {
    if (window.confirm('Are you sure you want to delete this board advisor?')) {
      deleteMutation.mutate(advisor.id);
    }
  };

  const handleToggleActive = (advisor: any) => {
    toggleActiveMutation.mutate({ 
      id: advisor.id, 
      is_active: !advisor.is_active 
    });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingAdvisor(null);
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
            <h1 className="text-2xl font-bold text-gray-900">Board Advisors</h1>
            <p className="text-gray-600">Manage board advisors and their information</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Advisor
          </Button>
        </div>

        <AdminDataTable
          data={advisors}
          columns={columns}
          searchKey="name"
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
          <AdvisorForm
            advisor={editingAdvisor}
            onClose={handleFormClose}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['admin-board-advisors'] });
              handleFormClose();
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};
