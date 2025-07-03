
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { TeamMemberForm } from '@/components/admin/TeamMemberForm';
import { AdminDataTable } from '@/components/admin/AdminDataTable';

export const TeamPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['admin-team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
      toast({
        title: "Team member deleted",
        description: "Team member has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete team member.",
        variant: "destructive",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('team_members')
        .update({ is_active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
      toast({
        title: "Status updated",
        description: "Team member status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update team member status.",
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
      key: 'role',
      label: 'Position',
      render: (value: string) => value,
    },
    {
      key: 'team_role',
      label: 'Team Role',
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'manager' ? 'bg-purple-100 text-purple-800' :
          value === 'support' ? 'bg-blue-100 text-blue-800' :
          value === 'compliance' ? 'bg-orange-100 text-orange-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value || 'Member'}
        </span>
      ),
    },
    {
      key: 'email',
      label: 'Email',
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

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setIsFormOpen(true);
  };

  const handleDelete = (member: any) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      deleteMutation.mutate(member.id);
    }
  };

  const handleToggleActive = (member: any) => {
    toggleActiveMutation.mutate({ 
      id: member.id, 
      is_active: !member.is_active 
    });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingMember(null);
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
            <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
            <p className="text-gray-600">Manage team members and their roles</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>

        <AdminDataTable
          data={teamMembers}
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
          <TeamMemberForm
            member={editingMember}
            onClose={handleFormClose}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
              handleFormClose();
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};
