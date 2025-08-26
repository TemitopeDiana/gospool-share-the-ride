
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

type DonationStatus = Database['public']['Enums']['donation_status'];

export const DonationsPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAnonymousDetails, setShowAnonymousDetails] = useState(false);

  const { data: donations = [], isLoading } = useQuery({
    queryKey: ['admin-donations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select(`
          *,
          paystack_transactions (
            reference,
            status,
            verification_attempts,
            last_verification_at,
            webhook_received_at,
            created_at
          )
        `)
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
      label: 'Donor',
      render: (value: string, row: any) => {
        if (row.is_anonymous && !showAnonymousDetails) {
          return 'Anonymous';
        }
        
        if (row.donor_type === 'organization') {
          return (
            <div>
              <div className="font-medium">{row.organization_name || 'N/A'}</div>
              <div className="text-sm text-gray-500">Contact: {row.contact_person || 'N/A'}</div>
              <div className="text-xs text-gray-400 capitalize">{row.organization_type || 'N/A'}</div>
            </div>
          );
        }
        
        return value || 'N/A';
      },
    },
    {
      key: 'donor_email',
      label: 'Email',
      render: (value: string, row: any) => {
        if (row.is_anonymous && !showAnonymousDetails) {
          return 'Hidden';
        }
        return value || 'N/A';
      },
    },
    {
      key: 'donor_phone',
      label: 'Phone',
      render: (value: string, row: any) => {
        if (row.is_anonymous && !showAnonymousDetails) {
          return 'Hidden';
        }
        return value || 'N/A';
      },
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: number, row: any) => `${row.currency || 'NGN'} ${Number(value).toLocaleString()}`,
    },
    {
      key: 'donor_type',
      label: 'Type',
      render: (value: string) => (
        <span className="capitalize px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
          {value || 'Individual'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (value: string) => format(new Date(value), 'MMM dd, yyyy'),
    },
    {
      key: 'status',
      label: 'Payment Status',
      render: (value: string, row: any) => {
        const transaction = row.paystack_transactions?.[0];
        const hasWebhook = transaction?.webhook_received_at;
        const verificationAttempts = transaction?.verification_attempts || 0;
        const lastVerification = transaction?.last_verification_at;
        
        let statusBadge;
        let statusColor;
        
        if (value === 'completed') {
          statusColor = 'bg-green-100 text-green-800';
          statusBadge = hasWebhook ? 'Completed (Webhook)' : 'Completed';
        } else if (value === 'failed') {
          statusColor = 'bg-red-100 text-red-800';
          statusBadge = 'Failed';
        } else {
          // For pending status, show more details
          if (verificationAttempts > 0) {
            statusColor = 'bg-yellow-100 text-yellow-800';
            statusBadge = `Pending (${verificationAttempts} attempts)`;
          } else {
            statusColor = 'bg-gray-100 text-gray-800';
            statusBadge = 'Pending';
          }
        }
        
        return (
          <div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}>
              {statusBadge}
            </span>
            {transaction?.reference && (
              <div className="text-xs text-gray-500 mt-1">
                Ref: {transaction.reference}
              </div>
            )}
            {lastVerification && (
              <div className="text-xs text-gray-400 mt-1">
                Last checked: {format(new Date(lastVerification), 'MMM dd, HH:mm')}
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const handleApprove = (donation: any) => {
    updateStatusMutation.mutate({ id: donation.id, status: 'completed' as DonationStatus });
  };

  const handleReject = (donation: any) => {
    updateStatusMutation.mutate({ id: donation.id, status: 'failed' as DonationStatus });
  };

  // Don't show manual actions - webhooks handle automatic confirmation
  const shouldShowActions = (donation: any) => {
    return false; // Disable manual actions since webhooks handle this automatically
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
            <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
            <p className="text-gray-600">Manage all donations and contributions</p>
          </div>
          <Button
            onClick={() => setShowAnonymousDetails(!showAnonymousDetails)}
            variant={showAnonymousDetails ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            {showAnonymousDetails ? <EyeOff size={16} /> : <Eye size={16} />}
            {showAnonymousDetails ? 'Hide' : 'Show'} Anonymous Details
          </Button>
        </div>

        <div className="bg-white rounded-lg border">
          <div className="p-4 bg-green-50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-green-800">Payment Processing Status</h3>
                <p className="text-sm text-green-600">
                  Webhooks and automatic verification ensure payments are processed reliably
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={async () => {
                    try {
                      const { data, error } = await supabase.functions.invoke('verify-pending-payments');
                      if (error) throw error;
                      toast({
                        title: "Verification Complete",
                        description: `Processed pending payments. Verified: ${data.verified || 0}`,
                      });
                      queryClient.invalidateQueries({ queryKey: ['admin-donations'] });
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to verify pending payments",
                        variant: "destructive",
                      });
                    }
                  }}
                  variant="outline"
                  size="sm"
                >
                  Verify Pending Payments
                </Button>
                <div className="text-right text-sm">
                  <div className="text-green-600">
                    Total: {donations.length} | Completed: {donations.filter(d => d.status === 'completed').length}
                  </div>
                  <div className="text-yellow-600">
                    Pending: {donations.filter(d => d.status === 'pending').length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <AdminDataTable
            data={donations}
            columns={columns}
            searchKey="donor_name"
            showStatus={true}
            onApprove={handleApprove}
            onReject={handleReject}
            showActions={shouldShowActions}
          />
        </div>
      </div>
    </AdminLayout>
  );
};
