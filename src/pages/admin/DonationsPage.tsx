import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Database } from '@/integrations/supabase/types';

type DonationStatus = Database['public']['Enums']['donation_status'];

export const DonationsPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: donations = [], isLoading } = useQuery({
    queryKey: ['admin-donations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: DonationStatus }) => {
      const { error } = await supabase
        .from('donations')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-donations'] });
      toast({
        title: "Status updated",
        description: "Donation status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update donation status.",
        variant: "destructive",
      });
    },
  });

  const columns = [
    {
      key: 'donor_name',
      label: 'Donor Name',
      render: (value: string, row: any) => row.is_anonymous ? 'Anonymous' : (value || 'N/A'),
    },
    {
      key: 'donor_email',
      label: 'Email',
      render: (value: string, row: any) => row.is_anonymous ? 'Hidden' : (value || 'N/A'),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: number, row: any) => `${row.currency || 'NGN'} ${Number(value).toLocaleString()}`,
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (value: string) => format(new Date(value), 'MMM dd, yyyy'),
    },
    {
      key: 'message',
      label: 'Message',
      render: (value: string) => value ? (value.length > 50 ? `${value.substring(0, 50)}...` : value) : '-',
    },
  ];

  const handleApprove = (donation: any) => {
    updateStatusMutation.mutate({ id: donation.id, status: 'completed' as DonationStatus });
  };

  const handleReject = (donation: any) => {
    updateStatusMutation.mutate({ id: donation.id, status: 'failed' as DonationStatus });
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
          <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
          <p className="text-gray-600">Manage all donations and contributions</p>
        </div>

        <AdminDataTable
          data={donations}
          columns={columns}
          searchKey="donor_name"
          showStatus={true}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </AdminLayout>
  );
};
