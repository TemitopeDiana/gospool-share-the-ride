import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Plus, X, FileText, Calendar, BarChart3 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SupabaseFileUpload } from '@/components/ui/SupabaseFileUpload';

interface ImpactReportFormProps {
  report?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const ImpactReportForm = ({ report, onClose, onSuccess }: ImpactReportFormProps) => {
  const [formData, setFormData] = useState({
    title: report?.title || '',
    description: report?.description || '',
    content: report?.content || '',
    report_period_start: report?.report_period_start || '',
    report_period_end: report?.report_period_end || '',
    is_published: report?.is_published || false,
    file_url: report?.file_url || '',
    images: report?.images || [],
    metrics: report?.metrics || {}
  });

  const [newMetricKey, setNewMetricKey] = useState('');
  const [newMetricValue, setNewMetricValue] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveReportMutation = useMutation({
    mutationFn: async (data: any) => {
      if (report) {
        // Update existing report
        const { data: result, error } = await supabase
          .from('impact_reports')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', report.id)
          .select()
          .single();
        
        if (error) throw error;
        return result;
      } else {
        // Create new report
        const { data: result, error } = await supabase
          .from('impact_reports')
          .insert([{
            ...data,
            created_by: (await supabase.auth.getUser()).data.user?.id
          }])
          .select()
          .single();
        
        if (error) throw error;
        return result;
      }
    },
    onSuccess: () => {
      const action = report ? 'updated' : 'created';
      toast({ 
        title: "Success", 
        description: `Impact report ${action} successfully!` 
      });
      queryClient.invalidateQueries({ queryKey: ['admin-impact-reports-list'] });
      onSuccess();
    },
    onError: (error) => {
      const action = report ? 'update' : 'create';
      toast({ 
        title: "Error", 
        description: `Failed to ${action} report: ${error.message}`,
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({ 
        title: "Error", 
        description: "Title and content are required",
        variant: "destructive" 
      });
      return;
    }
    saveReportMutation.mutate(formData);
  };

  const addMetric = () => {
    if (newMetricKey && newMetricValue) {
      setFormData(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          [newMetricKey]: newMetricValue
        }
      }));
      setNewMetricKey('');
      setNewMetricValue('');
    }
  };

  const removeMetric = (key: string) => {
    setFormData(prev => {
      const newMetrics = { ...prev.metrics };
      delete newMetrics[key];
      return { ...prev, metrics: newMetrics };
    });
  };

  const addImage = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {report ? 'Edit Impact Report' : 'Create Impact Report'}
              </CardTitle>
              <CardDescription>
                {report ? 'Update the impact report details' : 'Create a new impact report to share with stakeholders'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Report Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Q1 2024 Impact Report"
                  required
                />
              </div>
              <div className="space-y-2 flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="published">Publish Report</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the report"
                rows={2}
              />
            </div>

            {/* Report Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Report Period Start
                </Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.report_period_start}
                  onChange={(e) => setFormData({ ...formData, report_period_start: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Report Period End
                </Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.report_period_end}
                  onChange={(e) => setFormData({ ...formData, report_period_end: e.target.value })}
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Report Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write the detailed impact report content here..."
                rows={8}
                required
              />
            </div>

            {/* Metrics */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Impact Metrics
              </Label>
              
              {/* Add new metric */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  placeholder="Metric name (e.g., Churches Served)"
                  value={newMetricKey}
                  onChange={(e) => setNewMetricKey(e.target.value)}
                />
                <Input
                  placeholder="Value (e.g., 25)"
                  value={newMetricValue}
                  onChange={(e) => setNewMetricValue(e.target.value)}
                />
                <Button type="button" onClick={addMetric} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Metric
                </Button>
              </div>

              {/* Display existing metrics */}
              {Object.entries(formData.metrics).length > 0 && (
                <div className="space-y-2">
                  {Object.entries(formData.metrics).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                          {Object.entries(formData.metrics).map(([key, value]) => (
                      <span key={key} className="font-medium">{key}: {String(value)}</span>
                    ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMetric(key)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Report PDF File</Label>
              <SupabaseFileUpload
                onUpload={(url) => setFormData({ ...formData, file_url: url })}
                label="Upload PDF Report"
                bucket="images"
              />
              {formData.file_url && (
                <p className="text-sm text-green-600">File uploaded successfully</p>
              )}
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label>Report Images</Label>
              <SupabaseFileUpload
                onUpload={addImage}
                label="Add Image"
                bucket="images"
              />
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`Report image ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={saveReportMutation.isPending}>
                {saveReportMutation.isPending 
                  ? (report ? 'Updating...' : 'Creating...') 
                  : (report ? 'Update Report' : 'Create Report')
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
