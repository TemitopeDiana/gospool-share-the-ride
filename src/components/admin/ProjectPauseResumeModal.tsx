import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Pause, Play, Loader2 } from 'lucide-react';

interface ProjectPauseResumeModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  action: 'pause' | 'resume';
}

export const ProjectPauseResumeModal = ({
  project,
  isOpen,
  onClose,
  action
}: ProjectPauseResumeModalProps) => {
  const [reason, setReason] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ reason }: { reason: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const oldStatus = project.status;
      const newStatus = action === 'pause' ? 'paused' : 'active';

      if (action === 'pause') {
        // Pause the project
        const { error } = await supabase
          .from('projects')
          .update({
            status: 'paused',
            pause_reason: reason,
            paused_at: new Date().toISOString(),
            paused_by: user.id,
            updated_at: new Date().toISOString(),
            updated_by: user.id
          })
          .eq('id', project.id);
        
        if (error) throw error;
      } else {
        // Resume the project
        const { error } = await supabase
          .from('projects')
          .update({
            status: 'active',
            pause_reason: null,
            resumed_at: new Date().toISOString(),
            resumed_by: user.id,
            updated_at: new Date().toISOString(),
            updated_by: user.id
          })
          .eq('id', project.id);
        
        if (error) throw error;
      }

      // Record the status change in history
      const { error: historyError } = await supabase
        .from('project_status_history')
        .insert({
          project_id: project.id,
          old_status: oldStatus,
          new_status: newStatus,
          reason: reason || null,
          changed_by: user.id,
          changed_at: new Date().toISOString(),
          metadata: {
            action: action,
            project_title: project.title,
            user_email: user.email
          }
        });

      if (historyError) {
        console.error('Failed to record status history:', historyError);
        // Don't throw error for history recording failure to avoid blocking the main operation
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast({
        title: `Project ${action === 'pause' ? 'paused' : 'resumed'}`,
        description: `Project "${project.title}" has been ${action === 'pause' ? 'paused' : 'resumed'} successfully.`,
      });
      onClose();
      setReason('');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to ${action} project: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action === 'pause' && !reason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for pausing the project.",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate({ reason: reason.trim() });
  };

  const handleClose = () => {
    if (!mutation.isPending) {
      onClose();
      setReason('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {action === 'pause' ? (
              <Pause className="h-5 w-5 text-orange-600" />
            ) : (
              <Play className="h-5 w-5 text-green-600" />
            )}
            {action === 'pause' ? 'Pause Project' : 'Resume Project'}
          </DialogTitle>
          <DialogDescription>
            {action === 'pause' 
              ? `You are about to pause the project "${project.title}". This will temporarily halt all activities related to this project.`
              : `You are about to resume the project "${project.title}". This will reactivate all project activities.`
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">
              {action === 'pause' ? 'Reason for pausing (required)' : 'Reason for resuming (optional)'}
            </Label>
            <Textarea
              id="reason"
              placeholder={
                action === 'pause'
                  ? "Please explain why this project is being paused..."
                  : "Optionally explain why this project is being resumed..."
              }
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required={action === 'pause'}
              disabled={mutation.isPending}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={action === 'pause' ? 'destructive' : 'default'}
              disabled={mutation.isPending || (action === 'pause' && !reason.trim())}
            >
              {mutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {action === 'pause' ? 'Pause Project' : 'Resume Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};