
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useApprovalWorkflow = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userRole } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data?.role || 'user';
    }
  });

  // Check for super_admin role by comparing strings directly
  const isSuperAdmin = userRole === 'super_admin';
  const isAdmin = userRole === 'admin' || isSuperAdmin;

  const createPendingChange = useMutation({
    mutationFn: async (params: {
      tableName: string;
      actionType: 'INSERT' | 'UPDATE' | 'DELETE';
      recordId?: string;
      oldData?: any;
      newData?: any;
    }) => {
      // Use raw SQL query to insert into pending_changes table
      const { error } = await supabase.rpc('create_pending_change', {
        p_table_name: params.tableName,
        p_action_type: params.actionType,
        p_record_id: params.recordId,
        p_old_data: params.oldData,
        p_new_data: params.newData,
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Change submitted",
        description: "Your changes have been submitted for approval.",
      });
      queryClient.invalidateQueries({ queryKey: ['pending-changes'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit changes for approval.",
        variant: "destructive",
      });
    }
  });

  const handleChange = async (
    tableName: string,
    actionType: 'INSERT' | 'UPDATE' | 'DELETE',
    directAction: () => Promise<void>,
    recordId?: string,
    oldData?: any,
    newData?: any
  ) => {
    if (isSuperAdmin) {
      // Super admin changes go directly to production
      await directAction();
    } else if (isAdmin) {
      // Regular admin changes go to pending approval
      await createPendingChange.mutateAsync({
        tableName,
        actionType,
        recordId,
        oldData,
        newData
      });
    } else {
      throw new Error('Insufficient permissions');
    }
  };

  return {
    isSuperAdmin,
    isAdmin,
    handleChange,
    isSubmitting: createPendingChange.isPending
  };
};
