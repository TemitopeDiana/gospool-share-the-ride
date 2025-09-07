
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { ImpactReportForm } from '@/components/admin/ImpactReportForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Plus, FileText, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Database } from '@/integrations/supabase/types';

type ApplicationStatus = Database['public']['Enums']['application_status'];

export const ImpactReportsPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);

  // Fetch impact reports
  const { data: impactReports = [], isLoading: reportsLoading } = useQuery({
    queryKey: ['admin-impact-reports-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('impact_reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch impact report requests
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

  // Columns for impact reports
  const reportsColumns = [
    {
      key: 'title',
      label: 'Title',
      render: (value: string) => value,
    },
    {
      key: 'description',
      label: 'Description',
      render: (value: string) => value ? (value.length > 100 ? `${value.substring(0, 100)}...` : value) : 'No description',
    },
    {
      key: 'report_period_start',
      label: 'Period Start',
      render: (value: string) => value ? format(new Date(value), 'MMM dd, yyyy') : 'N/A',
    },
    {
      key: 'report_period_end',
      label: 'Period End',
      render: (value: string) => value ? format(new Date(value), 'MMM dd, yyyy') : 'N/A',
    },
    {
      key: 'is_published',
      label: 'Status',
      render: (value: boolean) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value: string) => format(new Date(value), 'MMM dd, yyyy'),
    },
  ];

  const handleApprove = (report: any) => {
    updateStatusMutation.mutate({ id: report.id, status: 'approved' as ApplicationStatus });
  };

  const handleReject = (report: any) => {
    updateStatusMutation.mutate({ id: report.id, status: 'rejected' as ApplicationStatus });
  };

  const handleEdit = (report: any) => {
    setEditingReport(report);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingReport(null);
  };

  const deleteReportMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('impact_reports')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-impact-reports-list'] });
      toast({
        title: "Report deleted",
        description: "Impact report has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete impact report.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (report: any) => {
    if (confirm(`Are you sure you want to delete "${report.title}"? This action cannot be undone.`)) {
      deleteReportMutation.mutate(report.id);
    }
  };

  if (isLoading || reportsLoading) {
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
            <h1 className="text-2xl font-bold text-gray-900">Impact Reports</h1>
            <p className="text-gray-600">Create and manage impact reports and handle download requests</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>

        <Tabs defaultValue="reports" className="w-full">
          <TabsList>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Impact Reports ({impactReports.length})
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Download Requests ({reports.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-4">
            <AdminDataTable
              data={impactReports}
              columns={reportsColumns}
              searchKey="title"
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <AdminDataTable
              data={reports}
              columns={columns}
              searchKey="requester_name"
              showStatus={true}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </TabsContent>
        </Tabs>

        {isFormOpen && (
          <ImpactReportForm
            report={editingReport}
            onClose={handleFormClose}
            onSuccess={() => {
              handleFormClose();
              queryClient.invalidateQueries({ queryKey: ['admin-impact-reports-list'] });
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};
