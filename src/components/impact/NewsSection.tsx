import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useState } from 'react';
import NewsArticleModal from './NewsArticleModal';

const NewsSection = () => {
  const { trackContentEngagement } = useAnalytics();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: newsItems = [], isLoading } = useQuery({
    queryKey: ['published-news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  const handleArticleClick = (article: any) => {
    trackContentEngagement('news', article.id, 'clicked');
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Latest News & Updates</h2>
            <p className="text-lg text-gray-800 dark:text-gray-200">Stay informed about our latest initiatives and impact stories</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (newsItems.length === 0) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Latest News & Updates</h2>
            <p className="text-lg text-gray-800 dark:text-gray-200">Stay informed about our latest initiatives and impact stories</p>
          </div>
          <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300">No news articles available at the moment. Check back soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Latest News & Updates</h2>
          <p className="text-lg text-gray-800 dark:text-gray-200">Stay informed about our latest initiatives and impact stories</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((article) => (
            <article 
              key={article.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-brand-light-mint/30 dark:border-brand-mint/30 cursor-pointer"
              onClick={() => handleArticleClick(article)}
            >
              {typeof article.image_url === 'string' && article.image_url.trim() ? (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.image_url.startsWith('http') ? article.image_url : `/${article.image_url.replace(/^\/?/, '')}`}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={e => { e.currentTarget.src = '/images/Logo mark v2 dark.png'; }}
                  />
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <img 
                    src="/images/Logo mark v2 dark.png"
                    alt="News placeholder"
                    className="w-16 h-16 object-contain"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  {article.category && (
                    <span className="inline-block bg-brand-light-mint/20 text-brand-primary dark:bg-brand-mint/20 dark:text-brand-mint text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {article.category}
                    </span>
                  )}
                  <time className="text-sm text-gray-700 dark:text-gray-300">
                    {format(new Date(article.published_at || article.created_at), 'MMM dd, yyyy')}
                  </time>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {article.title}
                </h3>
                
                {article.excerpt && (
                  <p className="text-gray-800 dark:text-gray-200 text-sm line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                )}
                
                {article.author_name && (
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <span>By {article.author_name}</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
        
        {newsItems.length >= 3 && (
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-brand-primary to-brand-dark-teal hover:from-brand-dark-teal hover:to-brand-mint text-white px-8 py-3 rounded-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300">
              View All News
            </button>
          </div>
        )}
      </div>

      <NewsArticleModal 
        article={selectedArticle}
        open={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default NewsSection;
