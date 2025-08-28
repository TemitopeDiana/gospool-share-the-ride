
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecentDonors = () => {
  const { data: donations = [], isLoading } = useQuery({
    queryKey: ['public-recent-donations'],
    queryFn: async () => {
      // Get only public donations (not anonymous or with explicit consent) for public display
      const { data, error } = await supabase
        .from('donations')
        .select('donor_name, amount, currency, created_at, is_anonymous, donor_type, organization_name, church_name')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(15); // Show more recent donors
      
      if (error) throw error;
      return data;
    },
  });

  const formatCurrency = (amount: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDonorName = (donation: any) => {
    if (donation.is_anonymous) {
      return 'Anonymous';
    }
    
    if (donation.donor_type === 'organization') {
      return donation.organization_name || 'Anonymous Organization';
    }
    
    return donation.donor_name || 'Anonymous';
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-white via-brand-light-mint/10 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-brand-dark-teal/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="dark:bg-gray-800/80 dark:border-gray-700 rounded-3xl shadow-2xl border border-brand-light-mint/30">
            <CardContent className="p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-8">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-white via-brand-light-mint/10 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-brand-dark-teal/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="dark:bg-gray-800/80 dark:border-gray-700 rounded-3xl shadow-2xl border border-brand-light-mint/30">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl lg:text-3xl text-gray-900 dark:text-white mb-3 font-playfair">
              Recent Donors
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-300 font-ibm-plex">
              Thank you to our generous supporters
            </CardDescription>
          </CardHeader>
          <CardContent>
            {donations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  No donations to display yet. Be the first to contribute!
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {donations.map((donation, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-brand-light-mint/10 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-brand-light-mint/20 dark:border-gray-600">
                      <div className="flex flex-col">
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-ibm-plex">
                          {format(new Date(donation.created_at), 'MMM dd, yyyy')}
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white font-poppins">
                          {formatDonorName(donation)}
                        </p>
                        {donation.church_name && !donation.is_anonymous && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {donation.church_name}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brand-primary dark:text-brand-mint font-poppins">
                          {formatCurrency(donation.amount, donation.currency)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-8">
                  <Link to="/admin/recent-donors">
                    <Button 
                      variant="outline" 
                      className="bg-white dark:bg-gray-700 hover:bg-brand-light-mint dark:hover:bg-brand-mint/20 border-brand-light-mint dark:border-brand-mint text-brand-primary dark:text-brand-mint hover:text-brand-dark-teal dark:hover:text-white transition-all duration-300 flex items-center gap-2"
                    >
                      View All Donors
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RecentDonors;
