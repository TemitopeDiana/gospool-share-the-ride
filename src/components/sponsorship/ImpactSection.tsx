
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ImpactSection = () => {
  const { data: sponsors = [], isLoading: sponsorsLoading } = useQuery({
    queryKey: ['impact-sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('impact_sponsors')
        .select(`
          *,
          sponsorship_applications (
            profile_picture_url
          )
        `)
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: partners = [], isLoading: partnersLoading } = useQuery({
    queryKey: ['impact-partners-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('impact_partners')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const isLoading = sponsorsLoading || partnersLoading;
  const totalPartners = sponsors.length + partners.length;

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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact Community</h2>
            <p className="text-lg text-gray-600">Partners and sponsors helping us create lasting change in communities</p>
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Impact Community</h2>
          <p className="text-lg text-gray-800 dark:text-gray-200">Partners and sponsors helping us create lasting change in communities</p>
        </div>
        
        {totalPartners > 0 ? (
          <div className="space-y-8">
            {/* Impact Sponsors */}
            {sponsors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">Impact Sponsors</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 items-center">
                  {sponsors.map((sponsor) => {
                    // Use logo_url first, then fallback to profile_picture_url from application
                    const logoUrl = sponsor.logo_url || sponsor.sponsorship_applications?.profile_picture_url;
                    
                    return (
                      <div 
                        key={sponsor.id} 
                        className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group cursor-pointer"
                        title={`${sponsor.sponsor_name}${sponsor.motivation ? ` - ${sponsor.motivation}` : ''}`}
                      >
                        {logoUrl ? (
                          <img 
                            src={logoUrl} 
                            alt={sponsor.sponsor_name}
                            className="max-h-12 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                            onError={(e) => {
                              // If image fails to load, show the sponsor name instead
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class="text-gray-900 dark:text-white font-medium text-sm text-center">${sponsor.sponsor_name}</span>`;
                              }
                            }}
                          />
                        ) : (
                          <span className="text-gray-900 dark:text-white font-medium text-sm text-center">
                            {sponsor.sponsor_name}
                          </span>
                        )}
                        
                        {/* Show sponsor name below logo on hover */}
                        <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center">
                          {sponsor.sponsor_name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Impact Partners */}
            {partners.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">Impact Partners</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 items-center">
                  {partners.map((partner) => (
                    <div 
                      key={partner.id} 
                      className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group cursor-pointer"
                      title={partner.company_name}
                    >
                      {partner.logo_url ? (
                        <img 
                          src={partner.logo_url} 
                          alt={partner.company_name}
                          className="max-h-12 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                          onError={(e) => {
                            // If image fails to load, show the company name instead
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<span class="text-gray-900 dark:text-white font-medium text-sm text-center">${partner.company_name}</span>`;
                            }
                          }}
                        />
                      ) : (
                        <span className="text-gray-900 dark:text-white font-medium text-sm text-center">
                          {partner.company_name}
                        </span>
                      )}
                      
                      {/* Show partner name below logo on hover */}
                      <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center">
                        {partner.company_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300">Our impact partners and sponsors will be showcased here soon.</p>
          </div>
        )}

        {/* Impact Statistics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-primary dark:text-brand-mint mb-2">{totalPartners}+</div>
            <div className="text-gray-800 dark:text-gray-200">Impact Partners & Sponsors</div>
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
