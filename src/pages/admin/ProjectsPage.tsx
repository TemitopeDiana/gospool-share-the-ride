
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Pause, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { ProjectPauseResumeModal } from '@/components/admin/ProjectPauseResumeModal';

export const ProjectsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [pauseResumeModal, setPauseResumeModal] = useState<{
    isOpen: boolean;
    project: any;
    action: 'pause' | 'resume';
  }>({ isOpen: false, project: null, action: 'pause' });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast({
        title: "Project deleted",
        description: "Project has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete project.",
        variant: "destructive",
      });
    },
  });

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (value: string) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (value: string) => value || 'N/A',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'active' 
            ? 'bg-green-100 text-green-800' 
            : value === 'paused'
            ? 'bg-orange-100 text-orange-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'progress_percentage',
      label: 'Progress',
      render: (value: number) => `${value || 0}%`,
    },
    {
      key: 'budget',
      label: 'Budget',
      render: (value: number) => value ? `₦${Number(value).toLocaleString()}` : 'N/A',
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value: string) => format(new Date(value), 'MMM dd, yyyy'),
    },
  ];

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = (project: any) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteMutation.mutate(project.id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handlePauseProject = (project: any) => {
    setPauseResumeModal({
      isOpen: true,
      project,
      action: 'pause'
    });
  };

  const handleResumeProject = (project: any) => {
    setPauseResumeModal({
      isOpen: true,
      project,
      action: 'resume'
    });
  };

  const handlePauseResumeClose = () => {
    setPauseResumeModal({
      isOpen: false,
      project: null,
      action: 'pause'
    });
  };

  const getCustomActions = (project: any) => {
    const actions = [];
    
    if (project.status === 'active') {
      actions.push({
        label: 'Pause',
        onClick: () => handlePauseProject(project),
        variant: 'outline' as const,
        icon: <Pause className="h-4 w-4" />
      });
    } else if (project.status === 'paused') {
      actions.push({
        label: 'Resume',
        onClick: () => handleResumeProject(project),
        variant: 'default' as const,
        icon: <Play className="h-4 w-4" />
      });
    }
    
    return actions;
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
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600">Manage organization projects and initiatives</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

        <AdminDataTable
          data={projects}
          columns={columns}
          searchKey="title"
          onEdit={handleEdit}
          onDelete={handleDelete}
          customActions={getCustomActions}
        />

        {isFormOpen && (
          <ProjectForm
            project={editingProject}
            onClose={handleFormClose}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
              handleFormClose();
            }}
          />
        )}

        <ProjectPauseResumeModal
          project={pauseResumeModal.project}
          isOpen={pauseResumeModal.isOpen}
          onClose={handlePauseResumeClose}
          action={pauseResumeModal.action}
        />
      </div>
    </AdminLayout>
  );
};
