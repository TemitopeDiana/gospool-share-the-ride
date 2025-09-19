import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ExternalLink, Calendar, User, Tag } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

interface ExternalLink {
  platform: string;
  url: string;
  title: string;
}

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author_name?: string;
  category?: string;
  image_url?: string;
  external_links?: ExternalLink[] | any;
  published_at?: string;
  created_at: string;
}

interface NewsArticleModalProps {
  article: NewsArticle | null;
  open: boolean;
  onClose: () => void;
}

const NewsArticleModal = ({ article, open, onClose }: NewsArticleModalProps) => {
  const { trackContentEngagement } = useAnalytics();

  if (!article) return null;

  const handleExternalLinkClick = (link: ExternalLink) => {
    trackContentEngagement('news', article.id, 'clicked');
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  // Parse external links safely
  const externalLinks: ExternalLink[] = React.useMemo(() => {
    if (!article.external_links) return [];
    
    try {
      if (Array.isArray(article.external_links)) {
        return article.external_links;
      }
      if (typeof article.external_links === 'string') {
        return JSON.parse(article.external_links);
      }
      return [];
    } catch {
      return [];
    }
  }, [article.external_links]);

  const publishedDate = article.published_at || article.created_at;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white leading-tight pr-4">
              {article.title}
            </DialogTitle>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            {publishedDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time>{format(new Date(publishedDate), 'MMM dd, yyyy')}</time>
              </div>
            )}
            
            {article.author_name && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>By {article.author_name}</span>
              </div>
            )}
            
            {article.category && (
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <Badge variant="secondary" className="bg-brand-light-mint/20 text-brand-primary dark:bg-brand-mint/20 dark:text-brand-mint">
                  {article.category}
                </Badge>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Article Image */}
          {article.image_url && (
            <div className="w-full h-64 md:h-80 overflow-hidden rounded-lg">
              <img 
                src={article.image_url.startsWith('http') ? article.image_url : `/${article.image_url.replace(/^\/?/, '')}`}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={e => { e.currentTarget.src = '/images/Logo mark v2 dark.png'; }}
              />
            </div>
          )}

          {/* Article Excerpt */}
          {article.excerpt && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border-l-4 border-brand-primary">
              <p className="text-lg text-gray-700 dark:text-gray-300 italic">
                {article.excerpt}
              </p>
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div 
              className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap"
              style={{ lineHeight: '1.7' }}
            >
              {article.content}
            </div>
          </div>

          {/* External Links */}
          {externalLinks.length > 0 && (
            <div className="bg-gradient-to-r from-brand-light-mint/10 to-brand-mint/5 dark:from-brand-dark-teal/10 dark:to-brand-mint/5 p-6 rounded-lg border border-brand-light-mint/30 dark:border-brand-mint/30">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Featured on Other Platforms
              </h4>
              <div className="space-y-3">
                {externalLinks.map((link, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-4 hover:bg-brand-light-mint/20 dark:hover:bg-brand-mint/20 border-brand-light-mint/50 dark:border-brand-mint/50"
                    onClick={() => handleExternalLinkClick(link)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {link.title || link.platform}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {link.platform}
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-brand-primary dark:text-brand-mint" />
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsArticleModal;