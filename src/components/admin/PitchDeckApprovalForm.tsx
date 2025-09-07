import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { SupabaseFileUpload } from '@/components/ui/SupabaseFileUpload';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { FileText, User, Building, Clock, CheckCircle, XCircle } from 'lucide-react';

interface PitchDeckRequest {
  id: string;
  requester_email: string;
  requester_name: string | null;
  organization: string | null;
  purpose: string | null;
  status: 'pending' | 'approved' | 'rejected';
  pitch_deck_file_url: string | null;
  created_at: string;
  sent_at: string | null;
  approved_by: string | null;
  approved_at: string | null;
}

interface PitchDeckApprovalFormProps {
  request: PitchDeckRequest;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PitchDeckApprovalForm = ({ request, isOpen, onClose, onSuccess }: PitchDeckApprovalFormProps) => {
  const [pitchDeckUrl, setPitchDeckUrl] = useState(request.pitch_deck_file_url || '');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const approveRequestMutation = useMutation({
    mutationFn: async () => {
      if (!pitchDeckUrl) {
        throw new Error('Please upload a pitch deck file before approving');
      }

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('impact_reports_requests')
        .update({
          status: 'approved',
          pitch_deck_file_url: pitchDeckUrl,
          approved_by: user.user.id,
          approved_at: new Date().toISOString(),
          sent_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) throw error;

      // Send email notification to requester
      try {
        await supabase.functions.invoke('send-pitch-deck-email', {
          body: {
            to_email: request.requester_email,
            requester_name: request.requester_name,
            pitch_deck_url: pitchDeckUrl
          }
        });
      } catch (emailError) {
        console.warn('Email notification failed:', emailError);
        // Don't fail the approval if email fails
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pitch-deck-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-impact-reports'] });
      toast({
        title: "Request approved",
        description: "Pitch deck request has been approved and the requester has been notified.",
      });
      onSuccess();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve request.",
        variant: "destructive",
      });
    },
  });

  const rejectRequestMutation = useMutation({
    mutationFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('impact_reports_requests')
        .update({
          status: 'rejected',
          approved_by: user.user.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pitch-deck-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-impact-reports'] });
      toast({
        title: "Request rejected",
        description: "Pitch deck request has been rejected.",
      });
      onSuccess();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject request.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = () => {
    approveRequestMutation.mutate();
  };

  const handleReject = () => {
    if (confirm('Are you sure you want to reject this pitch deck request?')) {
      rejectRequestMutation.mutate();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Pitch Deck Request Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Requester</p>
                  <p className="text-sm text-gray-600">{request.requester_name || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-gray-600">{request.requester_email}</p>
              </div>
              
              {request.organization && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Organization</p>
                    <p className="text-sm text-gray-600">{request.organization}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Status</p>
                {getStatusBadge(request.status)}
              </div>
              
              <div>
                <p className="text-sm font-medium">Requested Date</p>
                <p className="text-sm text-gray-600">{format(new Date(request.created_at), 'MMM dd, yyyy HH:mm')}</p>
              </div>
              
              {request.sent_at && (
                <div>
                  <p className="text-sm font-medium">Approved Date</p>
                  <p className="text-sm text-gray-600">{format(new Date(request.sent_at), 'MMM dd, yyyy HH:mm')}</p>
                </div>
              )}
            </div>
          </div>

          {request.purpose && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium mb-2">Purpose</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{request.purpose}</p>
            </div>
          )}

          {/* File Upload Section - Only show if pending */}
          {request.status === 'pending' && (
            <div className="space-y-4">
              <div className="border-t pt-4">
                <Label className="text-base font-medium">Upload Pitch Deck</Label>
                <p className="text-sm text-gray-600 mb-3">
                  Upload the pitch deck file that will be sent to the requester.
                </p>
                
                <SupabaseFileUpload
                  onUpload={(url) => {
                    setPitchDeckUrl(url);
                    setIsUploading(false);
                    toast({
                      title: "File uploaded",
                      description: "Pitch deck file has been uploaded successfully.",
                    });
                  }}
                  label="Upload Pitch Deck (PDF, PPT, PPTX)"
                  bucket="images"
                  folder="pitch-decks"
                />
                
                {pitchDeckUrl && (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      ✓ File uploaded successfully
                    </p>
                    <a 
                      href={pitchDeckUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      View uploaded file
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Existing file display for approved requests */}
          {request.status === 'approved' && request.pitch_deck_file_url && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm font-medium mb-2">Approved Pitch Deck</p>
              <a 
                href={request.pitch_deck_file_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
              >
                <FileText className="h-4 w-4" />
                View pitch deck file
              </a>
            </div>
          )}

          {/* Action Buttons - Only show if pending */}
          {request.status === 'pending' && (
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={handleReject}
                disabled={rejectRequestMutation.isPending}
              >
                {rejectRequestMutation.isPending ? 'Rejecting...' : 'Reject'}
              </Button>
              <Button 
                onClick={handleApprove}
                disabled={!pitchDeckUrl || approveRequestMutation.isPending || isUploading}
                className="bg-green-600 hover:bg-green-700"
              >
                {approveRequestMutation.isPending ? 'Approving...' : 'Approve & Send'}
              </Button>
            </div>
          )}

          {request.status !== 'pending' && (
            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
