
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { NewsForm } from '@/components/admin/NewsForm';
import { AdminDataTable } from '@/components/admin/AdminDataTable';

export const NewsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: news = [], isLoading } = useQuery({
    queryKey: ['admin-news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      toast({
        title: "News article deleted",
        description: "News article has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete news article.",
        variant: "destructive",
      });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase
        .from('news')
        .update({ 
          is_published,
          published_at: is_published ? new Date().toISOString() : null
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      toast({
        title: "Status updated",
        description: "News article status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update news article status.",
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
      key: 'author_name',
      label: 'Author',
      render: (value: string) => value || 'N/A',
    },
    {
      key: 'category',
      label: 'Category',
      render: (value: string) => value || 'General',
    },
    {
      key: 'is_published',
      label: 'Status',
      render: (value: boolean) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'published_at',
      label: 'Published',
      render: (value: string) => value ? format(new Date(value), 'MMM dd, yyyy') : 'Not published',
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value: string) => format(new Date(value), 'MMM dd, yyyy'),
    },
  ];

  const handleEdit = (article: any) => {
    setEditingNews(article);
    setIsFormOpen(true);
  };

  const handleDelete = (article: any) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      deleteMutation.mutate(article.id);
    }
  };

  const handleTogglePublish = (article: any) => {
    togglePublishMutation.mutate({ 
      id: article.id, 
      is_published: !article.is_published 
    });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingNews(null);
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
            <h1 className="text-2xl font-bold text-gray-900">News</h1>
            <p className="text-gray-600">Manage news articles and announcements</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Article
          </Button>
        </div>

        <AdminDataTable
          data={news}
          columns={columns}
          searchKey="title"
          onEdit={handleEdit}
          onDelete={handleDelete}
          customActions={(item) => [
            {
              label: item.is_published ? 'Unpublish' : 'Publish',
              onClick: () => handleTogglePublish(item),
              variant: item.is_published ? 'outline' : 'default',
            }
          ]}
        />

        {isFormOpen && (
          <NewsForm
            article={editingNews}
            onClose={handleFormClose}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['admin-news'] });
              handleFormClose();
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};
