import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Upload } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type ImpactPartner = Database['public']['Tables']['impact_partners']['Row'];
type ImpactPartnerInsert = Database['public']['Tables']['impact_partners']['Insert'];

interface AddPartnerFormProps {
  partner?: ImpactPartner;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export const AddPartnerForm = ({ partner, isOpen, onOpenChange, onSuccess }: AddPartnerFormProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = isOpen !== undefined && onOpenChange !== undefined;
  const open = isControlled ? isOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange : setInternalOpen;

  const [formData, setFormData] = useState<ImpactPartnerInsert>({
    company_name: '',
    logo_url: null,
    display_order: 0,
    is_active: true,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (partner) {
      setFormData({
        company_name: partner.company_name,
        logo_url: partner.logo_url,
        display_order: partner.display_order,
        is_active: partner.is_active,
      });
    } else {
      setFormData({
        company_name: '',
        logo_url: null,
        display_order: 0,
        is_active: true,
      });
    }
    setLogoFile(null);
  }, [partner]);

  const uploadLogo = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `partner-logo-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('partner-logos')
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data: publicUrlData } = supabase.storage
      .from('partner-logos')
      .getPublicUrl(fileName);
    
    return publicUrlData.publicUrl;
  };

  const savePartnerMutation = useMutation({
    mutationFn: async (data: ImpactPartnerInsert) => {
      let logo_url = data.logo_url;
      
      if (logoFile) {
        logo_url = await uploadLogo(logoFile);
      }
      
      if (partner) {
        // Update existing partner
        const { data: result, error } = await supabase
          .from('impact_partners')
          .update({ ...data, logo_url })
          .eq('id', partner.id)
          .select()
          .single();
        
        if (error) throw error;
        return result;
      } else {
        // Create new partner
        const { data: result, error } = await supabase
          .from('impact_partners')
          .insert([{ ...data, logo_url }])
          .select()
          .single();
        
        if (error) throw error;
        return result;
      }
    },
    onSuccess: () => {
      const action = partner ? 'updated' : 'added';
      toast({ title: "Success", description: `Impact partner ${action} successfully!` });
      queryClient.invalidateQueries({ queryKey: ['impact-partners'] });
      queryClient.invalidateQueries({ queryKey: ['impact-partners-count'] });
      setOpen(false);
      if (!partner) {
        setFormData({ company_name: '', logo_url: null, display_order: 0, is_active: true });
        setLogoFile(null);
      }
      onSuccess?.();
    },
    onError: (error) => {
      const action = partner ? 'update' : 'add';
      toast({ 
        title: "Error", 
        description: `Failed to ${action} partner: ${error.message}`,
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company_name.trim()) {
      toast({ 
        title: "Error", 
        description: "Company name is required",
        variant: "destructive" 
      });
      return;
    }
    savePartnerMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!partner && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Partners
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{partner ? 'Edit Impact Partner' : 'Add Impact Partner'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              placeholder="Enter company name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="display_order">Display Order</Label>
            <Input
              id="display_order"
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              placeholder="0"
              min="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="logo">Company Logo</Label>
            <div className="flex items-center gap-2">
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                className="flex-1"
              />
              <Upload className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Upload company logo (recommended: square format)</p>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={savePartnerMutation.isPending}>
              {savePartnerMutation.isPending 
                ? (partner ? 'Updating...' : 'Adding...') 
                : (partner ? 'Update Partner' : 'Add Partner')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
