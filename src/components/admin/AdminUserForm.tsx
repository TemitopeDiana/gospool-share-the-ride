
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminUserFormProps {
  user?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const PERMISSION_TYPES = [
  { key: 'donations', label: 'Donations' },
  { key: 'sponsorships', label: 'Sponsorships' },
  { key: 'reports', label: 'Impact Reports' },
  { key: 'projects', label: 'Projects' },
  { key: 'news', label: 'News' },
  { key: 'team', label: 'Team Members' },
  { key: 'advisors', label: 'Board Advisors' },
  { key: 'sponsors', label: 'Impact Sponsors' },
  { key: 'applications', label: 'Applications' },
];

export const AdminUserForm = ({ user, onClose, onSuccess }: AdminUserFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    is_active: true,
  });
  const [permissions, setPermissions] = useState<Record<string, { can_view: boolean; can_edit: boolean }>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        full_name: user.full_name || '',
        is_active: user.is_active !== false,
      });
      
      // Load existing permissions if editing
      loadUserPermissions(user.user_id);
    } else {
      // Initialize default permissions for new user
      const defaultPermissions: Record<string, { can_view: boolean; can_edit: boolean }> = {};
      PERMISSION_TYPES.forEach(type => {
        defaultPermissions[type.key] = { can_view: true, can_edit: false };
      });
      setPermissions(defaultPermissions);
    }
  }, [user]);

  const loadUserPermissions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_permissions')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      const permissionMap: Record<string, { can_view: boolean; can_edit: boolean }> = {};
      PERMISSION_TYPES.forEach(type => {
        const existing = data.find(p => p.permission_type === type.key);
        permissionMap[type.key] = {
          can_view: existing?.can_view ?? true,
          can_edit: existing?.can_edit ?? false,
        };
      });
      setPermissions(permissionMap);
    } catch (error) {
      console.error('Error loading permissions:', error);
    }
  };

  const handlePermissionChange = (permissionType: string, action: 'view' | 'edit', value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [permissionType]: {
        ...prev[permissionType],
        [`can_${action}`]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (user) {
        // Update existing user
        const { error: userError } = await supabase
          .from('admin_users')
          .update({
            full_name: formData.full_name,
            is_active: formData.is_active,
          })
          .eq('id', user.id);
        
        if (userError) throw userError;

        // Update permissions
        for (const [permissionType, perms] of Object.entries(permissions)) {
          const { error: permError } = await supabase
            .from('admin_permissions')
            .upsert({
              user_id: user.user_id,
              permission_type: permissionType,
              can_view: perms.can_view,
              can_edit: perms.can_edit,
            });
          
          if (permError) throw permError;
        }
        
        toast({
          title: "Admin user updated",
          description: "Admin user and permissions have been updated successfully.",
        });
      } else {
        // For new users, we would typically send an invitation email
        // For now, we'll just show a message about the invitation process
        toast({
          title: "Invitation feature",
          description: "Admin invitation system would be implemented with email integration.",
        });
      }

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save admin user.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit Admin User' : 'Invite New Admin User'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={!!user}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Active User</Label>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>
                Configure what sections this admin user can view and edit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {PERMISSION_TYPES.map(type => (
                  <div key={type.key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium">{type.label}</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={permissions[type.key]?.can_view ?? false}
                          onCheckedChange={(checked) => handlePermissionChange(type.key, 'view', checked)}
                        />
                        <Label className="text-sm">View</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={permissions[type.key]?.can_edit ?? false}
                          onCheckedChange={(checked) => handlePermissionChange(type.key, 'edit', checked)}
                        />
                        <Label className="text-sm">Edit</Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : user ? 'Update Admin' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
