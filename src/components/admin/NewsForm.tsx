import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SupabaseFileUpload } from '@/components/ui/SupabaseFileUpload';

interface NewsFormProps {
  article?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const NewsForm = ({ article, onClose, onSuccess }: NewsFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author_name: '',
    category: '',
    image_url: '',
    is_published: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        content: article.content || '',
        excerpt: article.excerpt || '',
        author_name: article.author_name || '',
        category: article.category || '',
        image_url: article.image_url || '',
        is_published: article.is_published || false,
      });
    }
  }, [article]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        ...formData,
        published_at: formData.is_published ? new Date().toISOString() : null,
      };

      if (article) {
        const { error } = await supabase
          .from('news')
          .update(data)
          .eq('id', article.id);
        
        if (error) throw error;
        
        toast({
          title: "Article updated",
          description: "News article has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('news')
          .insert([data]);
        
        if (error) throw error;
        
        toast({
          title: "Article created",
          description: "News article has been created successfully.",
        });
      }

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save news article.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{article ? 'Edit Article' : 'Add New Article'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author_name">Author</Label>
              <Input
                id="author_name"
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Impact, Updates, Events"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={2}
              placeholder="Brief summary of the article..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              required
              placeholder="Write your article content here..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
            />
            <Label htmlFor="is_published">Publish immediately</Label>
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <SupabaseFileUpload
              onUpload={url => setFormData(f => ({ ...f, image_url: url }))}
              label="Upload News Image"
              bucket="images"
              folder="news"
            />
            {formData.image_url && (
              <img src={formData.image_url} alt="Preview" className="w-32 h-32 object-cover rounded" />
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : article ? 'Update Article' : 'Create Article'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
