
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { SponsorForm } from '@/components/admin/SponsorForm';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { useApprovalWorkflow } from '@/hooks/useApprovalWorkflow';
import { AddPartnerForm } from '@/components/admin/AddPartnerForm';
import { PartnersTable } from '@/components/admin/PartnersTable';

export const SponsorsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<any>(null);
  const [isPartnerFormOpen, setIsPartnerFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { handleChange, isSuperAdmin, isAdmin } = useApprovalWorkflow();

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

  const { data: sponsors = [], isLoading } = useQuery({
    queryKey: ['admin-impact-sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('impact_sponsors')
        .select(`
          *,
          sponsorship_applications (
            profile_picture_url
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Query for impact partners count
  const { data: partnersCount = 0 } = useQuery({
    queryKey: ['impact-partners-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('impact_partners')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Attempting to delete sponsor with ID:', id);
      
      // Check if user has super admin permissions
      if (!isSuperAdmin) {
        throw new Error('Insufficient permissions. Only super admins can delete sponsors.');
      }
      
      // Direct delete without approval workflow for immediate action
      const { error } = await supabase
        .from('impact_sponsors')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }
      console.log('Delete successful');
    },
    onSuccess: () => {
      console.log('Delete mutation onSuccess triggered');
      queryClient.invalidateQueries({ queryKey: ['admin-impact-sponsors'] });
      toast({
        title: "Sponsor deleted permanently",
        description: "Impact sponsor has been permanently deleted from the database.",
      });
    },
    onError: (error) => {
      console.error('Delete mutation error:', error);
      const errorMessage = error.message.includes('Insufficient permissions') 
        ? 'You do not have permission to delete sponsors. Super admin access required.'
        : `Failed to delete sponsor: ${error.message}`;
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const directAction = async () => {
        const { error } = await supabase
          .from('impact_sponsors')
          .update({ is_active })
          .eq('id', id);
        
        if (error) throw error;
      };

      await handleChange(
        'impact_sponsors',
        'UPDATE',
        directAction,
        id,
        { is_active: !is_active },
        { is_active }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-impact-sponsors'] });
      toast({
        title: "Sponsor status updated",
        description: isSuperAdmin ? 
          "Sponsor visibility on the website has been updated successfully." :
          "Your change has been submitted for approval.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update sponsor status.",
        variant: "destructive",
      });
    },
  });

  const columns = [
    {
      key: 'logo',
      label: 'Logo',
      render: (value: any, row: any) => {
        // First check if there's a logo_url, then check for profile_picture_url from application
        const logoUrl = row.logo_url || row.sponsorship_applications?.profile_picture_url;
        
        if (!logoUrl) {
          return <span className="text-gray-400">No logo</span>;
        }

        return (
          <div className="flex items-center space-x-2">
            <img
              src={logoUrl}
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
                onClick={() => copyToClipboard(logoUrl)}
                title="Copy image URL"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(logoUrl, '_blank')}
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
      key: 'sponsor_name',
      label: 'Sponsor Name',
      render: (value: string) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
    },
    {
      key: 'sponsor_type',
      label: 'Type',
    },
    {
      key: 'motivation',
      label: 'Motivation',
      render: (value: string) => {
        if (!value) return <span className="text-gray-400">No motivation</span>;
        return (
          <div className="max-w-xs">
            <p className="text-sm text-gray-600 truncate" title={value}>
              {value.length > 50 ? `${value.substring(0, 50)}...` : value}
            </p>
          </div>
        );
      },
    },
    {
      key: 'contribution_amount',
      label: 'Amount',
      render: (value: number) => value ? `₦${Number(value).toLocaleString()}` : '-',
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (value: boolean) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Added',
      render: (value: string) => format(new Date(value), 'MMM dd, yyyy'),
    },
  ];

  const handleEdit = (sponsor: any) => {
    setEditingSponsor(sponsor);
    setIsFormOpen(true);
  };

  const handleDelete = (sponsor: any) => {
    // Check if user has super admin permissions
    if (!isSuperAdmin) {
      toast({
        title: "Access Denied",
        description: "Only super admins can delete sponsors.",
        variant: "destructive",
      });
      return;
    }

    if (confirm(`Are you sure you want to permanently delete "${sponsor.sponsor_name}"? This action cannot be undone and will remove the sponsor from the database completely.`)) {
      deleteMutation.mutate(sponsor.id);
    }
  };

  const handleToggleActive = (sponsor: any) => {
    const action = sponsor.is_active ? 'deactivate' : 'activate';
    const message = sponsor.is_active 
      ? `Are you sure you want to deactivate "${sponsor.sponsor_name}"? This will hide them from the website but keep their data in the database.`
      : `Are you sure you want to activate "${sponsor.sponsor_name}"? This will display them on the website.`;
    
    if (confirm(message)) {
      toggleActiveMutation.mutate({ 
        id: sponsor.id, 
        is_active: !sponsor.is_active 
      });
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingSponsor(null);
  };

  // Partner handlers
  const handlePartnerEdit = (partner: any) => {
    setEditingPartner(partner);
    setIsPartnerFormOpen(true);
  };

  const handlePartnerFormClose = () => {
    setIsPartnerFormOpen(false);
    setEditingPartner(null);
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Impact Sponsors & Partners</h1>
            <p className="text-gray-600">
              Manage impact sponsors and partners displayed on the website. 
              Total: {sponsors.length} sponsors, {partnersCount} partners
              {!isSuperAdmin && (
                <span className="text-amber-600"> • Super admin privileges required for deletions</span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsPartnerFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Sponsor
            </Button>
          </div>
        </div>

        <AdminDataTable
          data={sponsors}
          columns={columns}
          searchKey="sponsor_name"
          onEdit={handleEdit}
          onDelete={isSuperAdmin ? handleDelete : undefined}
          customActions={(item) => [
            {
              label: item.is_active ? 'Hide from Website' : 'Show on Website',
              onClick: () => handleToggleActive(item),
              variant: item.is_active ? 'outline' : 'default',
            }
          ]}
        />

        {/* Impact Partners Table */}
        <PartnersTable onEdit={handlePartnerEdit} />

        {isFormOpen && (
          <SponsorForm
            sponsor={editingSponsor}
            onClose={handleFormClose}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['admin-impact-sponsors'] });
              handleFormClose();
            }}
          />
        )}

        {isPartnerFormOpen && (
          <AddPartnerForm
            partner={editingPartner}
            isOpen={isPartnerFormOpen}
            onOpenChange={setIsPartnerFormOpen}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['impact-partners'] });
              queryClient.invalidateQueries({ queryKey: ['impact-partners-count'] });
              handlePartnerFormClose();
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};
