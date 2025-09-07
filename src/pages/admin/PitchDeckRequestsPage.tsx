import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { PitchDeckApprovalForm } from '@/components/admin/PitchDeckApprovalForm';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

export const PitchDeckRequestsPage = () => {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch pitch deck requests
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['admin-pitch-deck-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('impact_reports_requests')
        .select('*')
        .eq('report_type', 'pitch_deck')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

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
      key: 'purpose',
      label: 'Purpose',
      render: (value: string) => value ? (value.length > 50 ? `${value.substring(0, 50)}...` : value) : 'N/A',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: 'created_at',
      label: 'Requested Date',
      render: (value: string) => format(new Date(value), 'MMM dd, yyyy HH:mm'),
    },
    {
      key: 'sent_at',
      label: 'Processed Date',
      render: (value: string) => value ? format(new Date(value), 'MMM dd, yyyy HH:mm') : 'Not processed',
    },
  ];

  const handleView = (request: any) => {
    setSelectedRequest(request);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedRequest(null);
  };

  const customActions = (request: any) => [
    {
      label: 'View',
      onClick: () => handleView(request),
      variant: 'outline' as const,
    }
  ];

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

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
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Pitch Deck Requests
            </h1>
            <p className="text-gray-600">
              Review and approve pitch deck access requests
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</div>
              <div className="text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {requests.filter(r => r.status === 'approved').length}
              </div>
              <div className="text-gray-600">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {requests.filter(r => r.status === 'rejected').length}
              </div>
              <div className="text-gray-600">Rejected</div>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">Pending Requests</h2>
              <Badge className="bg-yellow-100 text-yellow-800">
                {pendingRequests.length} requiring attention
              </Badge>
            </div>
            <AdminDataTable
              data={pendingRequests}
              columns={columns}
              searchKey="requester_name"
              customActions={customActions}
            />
          </div>
        )}

        {/* All Requests */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">All Requests</h2>
          <AdminDataTable
            data={requests}
            columns={columns}
            searchKey="requester_name"
            customActions={customActions}
          />
        </div>

        {/* Approval Form Modal */}
        {isFormOpen && selectedRequest && (
          <PitchDeckApprovalForm
            request={selectedRequest}
            isOpen={isFormOpen}
            onClose={handleFormClose}
            onSuccess={() => {
              // Refresh the data
              window.location.reload();
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};
