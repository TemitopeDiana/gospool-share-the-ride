
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from './useAdmin';

export const usePermissions = () => {
  const { session, isAdmin } = useAdmin();

  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['admin-permissions', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('admin_permissions')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id && isAdmin,
  });

  const hasPermission = (permissionType: string, action: 'view' | 'edit') => {
    if (!isAdmin) return false;
    
    const permission = permissions.find(p => p.permission_type === permissionType);
    if (!permission) return false;
    
    return action === 'view' ? permission.can_view : permission.can_edit;
  };

  const canView = (permissionType: string) => hasPermission(permissionType, 'view');
  const canEdit = (permissionType: string) => hasPermission(permissionType, 'edit');

  return {
    permissions,
    hasPermission,
    canView,
    canEdit,
    isLoading,
  };
};
