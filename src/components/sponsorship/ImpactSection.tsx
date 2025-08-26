
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ImpactSection = () => {
  const { data: sponsors = [], isLoading } = useQuery({
    queryKey: ['impact-sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('impact_sponsors')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['active-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact Partners</h2>
            <p className="text-lg text-gray-600">Organizations helping us create lasting change in communities</p>
          </div>
          <div className="animate-pulse">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Impact Partners</h2>
          <p className="text-lg text-gray-800 dark:text-gray-200">Organizations helping us create lasting change in communities</p>
        </div>
        
        {sponsors.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {sponsors.map((sponsor) => (
              <div key={sponsor.id} className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                {sponsor.logo_url ? (
                  <img 
                    src={sponsor.logo_url} 
                    alt={sponsor.sponsor_name}
                    className="max-h-12 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <span className="text-gray-900 dark:text-white font-medium text-sm text-center">
                    {sponsor.sponsor_name}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300">Our impact partners will be showcased here soon.</p>
          </div>
        )}

        {/* Impact Statistics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-primary dark:text-brand-mint mb-2">{sponsors.length}+</div>
            <div className="text-gray-800 dark:text-gray-200">Impact Partners</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-dark-teal dark:text-brand-light-mint mb-2">{projects.length}+</div>
            <div className="text-gray-800 dark:text-gray-200">Active Projects</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-mint dark:text-brand-light-mint mb-2">
              ₦{sponsors.reduce((total, sponsor) => total + (sponsor.contribution_amount || 0), 0).toLocaleString()}
            </div>
            <div className="text-gray-800 dark:text-gray-200">Total Contributions</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
