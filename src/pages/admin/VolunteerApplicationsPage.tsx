
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

type ApplicationStatus = Database['public']['Enums']['application_status'];

interface VolunteerApplication {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  skills: string;
  experience?: string;
  motivation: string;
  availability: string;
  preferred_areas: string[];
  resume_url?: string;
  created_at: string;
  status: ApplicationStatus;
}

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
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as VolunteerApplication[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ApplicationStatus }) => {
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

  const columns = [
    {
      key: 'full_name',
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
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value?.slice(0, 2).map((area, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {area}
            </Badge>
          ))}
          {value?.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{value.length - 2} more
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
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
    updateStatusMutation.mutate({ id: application.id, status: 'approved' as ApplicationStatus });
  };

  const handleReject = (application: VolunteerApplication) => {
    updateStatusMutation.mutate({ id: application.id, status: 'rejected' as ApplicationStatus });
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
          searchKey="full_name"
          showStatus={true}
          onApprove={handleApprove}
          onReject={handleReject}
        />

        {selectedApplication && (
          <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Volunteer Application Details - {selectedApplication.full_name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Contact Information</h4>
                    <p><strong>Name:</strong> {selectedApplication.full_name}</p>
                    <p><strong>Email:</strong> {selectedApplication.email}</p>
                    <p><strong>Phone:</strong> {selectedApplication.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Application Details</h4>
                    <p><strong>Applied:</strong> {format(new Date(selectedApplication.created_at), 'MMM dd, yyyy')}</p>
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
                    {selectedApplication.preferred_areas?.map((area, index) => (
                      <Badge key={index} variant="secondary">{area}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Skills & Expertise</h4>
                  <p className="bg-gray-50 p-3 rounded-lg">{selectedApplication.skills}</p>
                </div>

                {selectedApplication.experience && (
                  <div>
                    <h4 className="font-semibold mb-2">Previous Experience</h4>
                    <p className="bg-gray-50 p-3 rounded-lg">{selectedApplication.experience}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Motivation</h4>
                  <p className="bg-gray-50 p-3 rounded-lg">{selectedApplication.motivation}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Availability</h4>
                  <p className="bg-gray-50 p-3 rounded-lg">{selectedApplication.availability}</p>
                </div>

                {selectedApplication.resume_url && (
                  <div>
                    <h4 className="font-semibold mb-2">Resume/CV</h4>
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedApplication.resume_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Resume
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
};
