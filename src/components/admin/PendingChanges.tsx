
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Check, X, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PendingChange {
  id: string;
  table_name: string;
  action_type: string;
  record_id?: string;
  old_data?: any;
  new_data?: any;
  created_by: string;
  created_at: string;
  status: string;
  created_by_profile?: {
    full_name?: string;
    email?: string;
  };
}

export const PendingChanges = () => {
  const [selectedChange, setSelectedChange] = useState<PendingChange | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingChanges = [], isLoading } = useQuery({
    queryKey: ['pending-changes'],
    queryFn: async () => {
      // Use RPC to get pending changes since TypeScript types don't include the table
      const { data, error } = await supabase.rpc('get_pending_changes');
      
      if (error) throw error;
      return (data || []) as PendingChange[];
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (changeId: string) => {
      const { error } = await supabase.rpc('approve_pending_change', {
        change_id: changeId
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-changes'] });
      toast({
        title: "Change approved",
        description: "The change has been approved and applied.",
      });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ changeId, reason }: { changeId: string; reason: string }) => {
      const { error } = await supabase.rpc('reject_pending_change', {
        change_id: changeId,
        reason: reason
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-changes'] });
      toast({
        title: "Change rejected",
        description: "The change has been rejected.",
      });
    }
  });

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'INSERT': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-blue-100 text-blue-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 rounded"></div>
      ))}
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Pending Changes</h2>
        <p className="text-gray-600">Review and approve changes submitted by admin users</p>
      </div>

      {pendingChanges.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">No pending changes to review</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingChanges.map((change) => (
            <Card key={change.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Badge className={getActionColor(change.action_type)} variant="secondary">
                        {change.action_type}
                      </Badge>
                      <span className="text-lg">{change.table_name}</span>
                    </CardTitle>
                    <CardDescription>
                      Submitted by {change.created_by_profile?.full_name || 'Admin User'} on{' '}
                      {format(new Date(change.created_at), 'MMM dd, yyyy HH:mm')}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedChange(change)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => approveMutation.mutate(change.id)}
                      disabled={approveMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const reason = prompt('Reason for rejection (optional):');
                        if (reason !== null) {
                          rejectMutation.mutate({ changeId: change.id, reason: reason || 'No reason provided' });
                        }
                      }}
                      disabled={rejectMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {selectedChange && (
        <Dialog open={!!selectedChange} onOpenChange={() => setSelectedChange(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Change Details - {selectedChange.table_name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Action Type</h4>
                <Badge className={getActionColor(selectedChange.action_type)} variant="secondary">
                  {selectedChange.action_type}
                </Badge>
              </div>
              
              {selectedChange.old_data && (
                <div>
                  <h4 className="font-semibold mb-2">Previous Data</h4>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(selectedChange.old_data, null, 2)}
                  </pre>
                </div>
              )}
              
              {selectedChange.new_data && (
                <div>
                  <h4 className="font-semibold mb-2">New Data</h4>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(selectedChange.new_data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
