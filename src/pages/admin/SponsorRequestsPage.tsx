
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Database } from '@/integrations/supabase/types';
import { useApprovalWorkflow } from '@/hooks/useApprovalWorkflow';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

type ApplicationStatus = Database['public']['Enums']['application_status'];

export const SponsorRequestsPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { handleChange, isSuperAdmin } = useApprovalWorkflow();
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "The image URL has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Unable to copy the link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (application: any) => {
    setSelectedApplication(application);
    setIsDetailDialogOpen(true);
  };

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
            logo_url: application.profile_picture_url,
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
          logo_url: application.profile_picture_url,
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
      key: 'profile_picture_url',
      label: 'Logo/Image',
      render: (value: string) => {
        if (!value) return <span className="text-gray-400">No image</span>;

        return (
          <div className="flex items-center space-x-2">
            <img
              src={value}
              alt="Sponsor logo"
              className="w-12 h-12 object-cover rounded-lg border"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(value)}
                title="Copy image URL"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(value, '_blank')}
                title="Open image in new tab"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        );
      },
    },
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
      label: 'Preferred Contact',
      render: (value: string) => value || 'N/A',
    },
    {
      key: 'motivation',
      label: 'Motivation',
      render: (value: string) => {
        if (!value) return 'N/A';
        // Extract church denomination if present
        const denomination = extractChurchDenomination(value);
        if (denomination) return denomination;
        // Show truncated motivation
        return value.length > 50 ? `${value.substring(0, 50)}...` : value;
      },
    },
    {
      key: 'address',
      label: 'Address',
      render: (value: string) => {
        if (!value) return 'N/A';
        return value.length > 30 ? `${value.substring(0, 30)}...` : value;
      },
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
          <h1 className="text-2xl font-bold text-gray-900">Impact Sponsor Applications</h1>
          <p className="text-gray-600">Review sponsorship applications with logos and contact information</p>
        </div>

        <AdminDataTable
          data={applications}
          columns={columns}
          searchKey="organization_name"
          showStatus={false}
        />

        {/* Application Details Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Sponsor Application Details</DialogTitle>
            </DialogHeader>

            {selectedApplication && (
              <div className="space-y-6">
                {/* Logo/Image Section */}
                {selectedApplication.profile_picture_url && (
                  <div className="text-center space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Logo/Profile Picture</h3>
                      <img
                        src={selectedApplication.profile_picture_url}
                        alt="Sponsor logo"
                        className="max-w-full max-h-48 mx-auto object-contain rounded-lg border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(selectedApplication.profile_picture_url)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Image URL
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.open(selectedApplication.profile_picture_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in New Tab
                      </Button>
                    </div>
                  </div>
                )}

                {/* Application Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Sponsor Type</label>
                      <p className="text-sm">{selectedApplication.sponsor_type}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Organization Name</label>
                      <p className="text-sm">{selectedApplication.organization_name || 'N/A'}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Person</label>
                      <p className="text-sm">{selectedApplication.contact_person}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm">{selectedApplication.email}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-sm">{selectedApplication.phone || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Sponsor Amount</label>
                      <p className="text-sm font-semibold text-green-600">
                        {selectedApplication.sponsor_amount ? `₦${Number(selectedApplication.sponsor_amount).toLocaleString()}` : 'Not specified'}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Preferred Contact</label>
                      <p className="text-sm">{selectedApplication.sponsor_duration || 'N/A'}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <Badge variant={selectedApplication.status === 'approved' ? 'default' : selectedApplication.status === 'rejected' ? 'destructive' : 'secondary'}>
                        {selectedApplication.status}
                      </Badge>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Applied Date</label>
                      <p className="text-sm">{format(new Date(selectedApplication.created_at), 'PPP')}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                {selectedApplication.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-sm mt-1">{selectedApplication.address}</p>
                  </div>
                )}

                {/* Motivation */}
                {selectedApplication.motivation && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Motivation/Additional Information</label>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{selectedApplication.motivation}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4 border-t">
                  <Button
                    onClick={() => {
                      handleApprove(selectedApplication);
                      setIsDetailDialogOpen(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={selectedApplication.status === 'approved'}
                  >
                    Approve Application
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleReject(selectedApplication);
                      setIsDetailDialogOpen(false);
                    }}
                    disabled={selectedApplication.status === 'rejected'}
                  >
                    Reject Application
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};
