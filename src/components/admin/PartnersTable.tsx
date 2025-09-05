import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';
import { format } from 'date-fns';

type ImpactPartner = Database['public']['Tables']['impact_partners']['Row'];

interface PartnersTableProps {
  onEdit?: (partner: ImpactPartner) => void;
}

export const PartnersTable = ({ onEdit }: PartnersTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: partners = [], isLoading } = useQuery({
    queryKey: ['impact-partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('impact_partners')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('impact_partners')
        .update({ is_active: !is_active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['impact-partners'] });
      queryClient.invalidateQueries({ queryKey: ['impact-partners-count'] });
      toast({ title: "Success", description: "Partner status updated!" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: `Failed to update partner status: ${error.message}`,
        variant: "destructive" 
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('impact_partners')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['impact-partners'] });
      queryClient.invalidateQueries({ queryKey: ['impact-partners-count'] });
      toast({ title: "Success", description: "Partner deleted successfully!" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: `Failed to delete partner: ${error.message}`,
        variant: "destructive" 
      });
    },
  });

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "Copied!", description: "Logo URL copied to clipboard" });
  };

  const handleToggleActive = (partner: ImpactPartner) => {
    toggleActiveMutation.mutate({ id: partner.id, is_active: partner.is_active });
  };

  const handleDelete = (partner: ImpactPartner) => {
    if (confirm(`Are you sure you want to delete "${partner.company_name}"? This action cannot be undone.`)) {
      deleteMutation.mutate(partner.id);
    }
  };

  const columns = [
    {
      key: 'logo_url',
      label: 'Logo',
      render: (value: string | null, row: ImpactPartner) => (
        <div className="flex items-center gap-2">
          {value ? (
            <div className="flex items-center gap-2">
              <img 
                src={value} 
                alt={row.company_name} 
                className="w-8 h-8 object-contain rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(value)}
                  title="Copy logo URL"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(value, '_blank')}
                  title="Open logo in new tab"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ) : (
            <span className="text-gray-400">No logo</span>
          )}
        </div>
      ),
    },
    {
      key: 'company_name',
      label: 'Company Name',
      render: (value: string) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
    },
    {
      key: 'display_order',
      label: 'Display Order',
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (value: boolean) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Impact Partners</h2>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Impact Partners</h2>
      <AdminDataTable
        data={partners}
        columns={columns}
        searchKey="company_name"
        onEdit={onEdit}
        onDelete={handleDelete}
        customActions={(item) => [
          {
            label: item.is_active ? 'Deactivate' : 'Activate',
            onClick: () => handleToggleActive(item),
            variant: item.is_active ? 'outline' : 'default',
          }
        ]}
      />
    </div>
  );
};
