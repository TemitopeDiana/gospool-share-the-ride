
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { ExternalLink, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';


type VolunteerApplication = Database["public"]["Tables"]["volunteer_applications"]["Row"];

export const VolunteerApplicationsPage = () => {
  const [selectedApplication, setSelectedApplication] = useState<VolunteerApplication | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['admin-volunteer-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('volunteer_applications')
        .select('*')
        .order('applied_date', { ascending: false });
      if (error) throw error;
      return data as VolunteerApplication[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('volunteer_applications')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-volunteer-applications'] });
      toast({
        title: "Status updated",
        description: "Volunteer application status has been updated successfully.",
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

  const extractPreferredAreas = (experience: string) => {
    const match = experience.match(/Preferred Areas: (.+)/);
    if (match) {
      return match[1].split(', ').filter(area => area.trim());
    }
    return [];
  };

  const columns = [
    {
      key: 'applicant_name',
      label: 'Applicant Name',
      render: (value: string) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (value: string) => value,
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value: string) => value || 'N/A',
    },
    {
      key: 'preferred_areas',
      label: 'Preferred Areas',
      render: (value: string) => {
        const areas = value ? value.split(',').map(a => a.trim()).filter(Boolean) : [];
        return (
          <div className="flex flex-wrap gap-1">
            {areas?.slice(0, 2).map((area, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {area}
              </Badge>
            ))}
            {areas?.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{areas.length - 2} more
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: 'applied_date',
      label: 'Applied Date',
      render: (value: string) => format(new Date(value), 'MMM dd, yyyy'),
    },
    {
      key: 'resume_url',
      label: 'Resume',
      render: (value: string) => value ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(value, '_blank')}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      ) : 'N/A',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: VolunteerApplication) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedApplication(row)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const handleApprove = (application: VolunteerApplication) => {
  updateStatusMutation.mutate({ id: application.id, status: 'approved' });
  };

  const handleReject = (application: VolunteerApplication) => {
  updateStatusMutation.mutate({ id: application.id, status: 'rejected' });
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
          <h1 className="text-2xl font-bold text-gray-900">Volunteer Applications</h1>
          <p className="text-gray-600">Review and manage volunteer applications</p>
        </div>

        <AdminDataTable
          data={applications}
          columns={columns}
          searchKey="applicant_name"
          showStatus={true}
          onApprove={handleApprove}
          onReject={handleReject}
        />

        {selectedApplication && (
          <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Volunteer Application Details - {selectedApplication.applicant_name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Contact Information</h4>
                    <p><strong>Name:</strong> {selectedApplication.applicant_name}</p>
                    <p><strong>Email:</strong> {selectedApplication.email}</p>
                    <p><strong>Phone:</strong> {selectedApplication.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Application Details</h4>
                    <p><strong>Applied:</strong> {format(new Date(selectedApplication.applied_date), 'MMM dd, yyyy')}</p>
                    <p><strong>Status:</strong> 
                      <Badge className="ml-2" variant={
                        selectedApplication.status === 'approved' ? 'default' : 
                        selectedApplication.status === 'rejected' ? 'destructive' : 
                        'secondary'
                      }>
                        {selectedApplication.status}
                      </Badge>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Preferred Volunteer Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedApplication.preferred_areas ? selectedApplication.preferred_areas.split(',').map(a => a.trim()).filter(Boolean) : []).map((area, index) => (
                      <Badge key={index} variant="secondary">{area}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  {selectedApplication.resume_url && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedApplication.resume_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Resume
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
};
