
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SponsorFormProps {
  sponsor?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const SponsorForm = ({ sponsor, onClose, onSuccess }: SponsorFormProps) => {
  const [formData, setFormData] = useState({
    sponsor_name: '',
    sponsor_type: '',
    logo_url: '',
    website_url: '',
    contribution_amount: '',
    tier: 'bronze',
    start_date: '',
    end_date: '',
    order_index: 0,
    is_active: true,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (sponsor) {
      setFormData({
        sponsor_name: sponsor.sponsor_name || '',
        sponsor_type: sponsor.sponsor_type || '',
        logo_url: sponsor.logo_url || '',
        website_url: sponsor.website_url || '',
        contribution_amount: sponsor.contribution_amount ? sponsor.contribution_amount.toString() : '',
        tier: sponsor.tier || 'bronze',
        start_date: sponsor.start_date || '',
        end_date: sponsor.end_date || '',
        order_index: sponsor.order_index || 0,
        is_active: sponsor.is_active !== false,
      });
    }
  }, [sponsor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let logoUrl = formData.logo_url;

      // Upload logo file if provided
      if (logoFile) {
        setIsUploadingLogo(true);
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `sponsor-logo-${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('sponsor-logos')
          .upload(fileName, logoFile);

        if (uploadError) {
          // If bucket doesn't exist, create it first
          if (uploadError.message.includes('not found')) {
            await supabase.storage.createBucket('sponsor-logos', {
              public: true,
              allowedMimeTypes: ['image/*'],
              fileSizeLimit: 5242880 // 5MB
            });
            
            // Retry upload
            const { data: retryUploadData, error: retryUploadError } = await supabase.storage
              .from('sponsor-logos')
              .upload(fileName, logoFile);
              
            if (retryUploadError) throw retryUploadError;
            
            const { data: urlData } = supabase.storage
              .from('sponsor-logos')
              .getPublicUrl(retryUploadData.path);
            logoUrl = urlData.publicUrl;
          } else {
            throw uploadError;
          }
        } else {
          const { data: urlData } = supabase.storage
            .from('sponsor-logos')
            .getPublicUrl(uploadData.path);
          logoUrl = urlData.publicUrl;
        }
        setIsUploadingLogo(false);
      }

      const data = {
        ...formData,
        logo_url: logoUrl,
        contribution_amount: formData.contribution_amount ? parseFloat(formData.contribution_amount) : null,
        order_index: parseInt(formData.order_index.toString()),
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      };

      if (sponsor) {
        const { error } = await supabase
          .from('impact_sponsors')
          .update(data)
          .eq('id', sponsor.id);
        
        if (error) throw error;
        
        toast({
          title: "Impact sponsor updated",
          description: "Impact sponsor has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('impact_sponsors')
          .insert([data]);
        
        if (error) throw error;
        
        toast({
          title: "Impact sponsor created",
          description: "Impact sponsor has been created successfully.",
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving sponsor:', error);
      toast({
        title: "Error",
        description: "Failed to save impact sponsor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsUploadingLogo(false);
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (PNG, JPG, SVG, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setLogoFile(file);
      // Clear the URL field since we're uploading a file
      setFormData({ ...formData, logo_url: '' });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{sponsor ? 'Edit Impact Sponsor' : 'Add New Impact Sponsor'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sponsor_name">Sponsor Name *</Label>
              <Input
                id="sponsor_name"
                value={formData.sponsor_name}
                onChange={(e) => setFormData({ ...formData, sponsor_name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sponsor_type">Sponsor Type *</Label>
              <Select
                value={formData.sponsor_type}
                onValueChange={(value) => setFormData({ ...formData, sponsor_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sponsor type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="church">Church</SelectItem>
                  <SelectItem value="organization">Organization</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Logo</Label>
              <p className="text-sm text-gray-500">Upload a logo file or provide a URL</p>
              
              {/* Current Logo Preview */}
              {sponsor && formData.logo_url && !logoFile && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Current Logo:</p>
                  <img 
                    src={formData.logo_url} 
                    alt="Current logo" 
                    className="w-20 h-20 object-contain border border-gray-200 rounded-lg p-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-4">
                {/* File Upload Option */}
                <div className="space-y-2">
                  <Label htmlFor="logo_file">Upload Logo File</Label>
                  <Input
                    id="logo_file"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    className="cursor-pointer"
                  />
                  {logoFile && (
                    <div className="space-y-2">
                      <p className="text-sm text-green-600">
                        Selected: {logoFile.name}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setLogoFile(null);
                          // Reset file input
                          const fileInput = document.getElementById('logo_file') as HTMLInputElement;
                          if (fileInput) fileInput.value = '';
                        }}
                      >
                        Remove File
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* URL Option */}
                <div className="space-y-2">
                  <Label htmlFor="logo_url">Or Logo URL</Label>
                  <Input
                    id="logo_url"
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => {
                      setFormData({ ...formData, logo_url: e.target.value });
                      if (e.target.value) setLogoFile(null); // Clear file if URL is provided
                    }}
                    placeholder="https://example.com/logo.png"
                    disabled={!!logoFile}
                  />
                  {logoFile && (
                    <p className="text-sm text-gray-500">
                      URL field disabled while file is selected
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website_url">Website URL</Label>
              <Input
                id="website_url"
                type="url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contribution_amount">Contribution Amount (₦)</Label>
              <Input
                id="contribution_amount"
                type="number"
                value={formData.contribution_amount}
                onChange={(e) => setFormData({ ...formData, contribution_amount: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tier">Tier</Label>
              <Select value={formData.tier} onValueChange={(value) => setFormData({ ...formData, tier: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order_index">Display Order</Label>
              <Input
                id="order_index"
                type="number"
                min="0"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : sponsor ? 'Update Sponsor' : 'Create Sponsor'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
