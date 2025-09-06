
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';

const RecentDonors = () => {
  const queryClient = useQueryClient();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data: donations = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ['public-recent-donations'],
    queryFn: async () => {
      // Get donations that are set to show publicly and completed
      const { data, error } = await supabase
        .from('donations')
        .select('donor_name, amount, currency, created_at, is_anonymous, donor_type, organization_name, church_name, status, show_publicly')
        .eq('status', 'completed')
        .eq('show_publicly', true) // Only show donations marked as publicly visible
        .order('created_at', { ascending: false })
        .limit(15); // Show more recent donors
      
      if (error) {
        console.error('Error fetching recent donations:', error);
        throw error;
      }
      
      console.log('Recent donations fetched:', data?.length || 0);
      setLastUpdated(new Date());
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  // Set up real-time subscription to listen for new completed donations
  useEffect(() => {
    console.log('Setting up real-time subscription for donations');
    
    const channel = supabase
      .channel('donations-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'donations',
          filter: 'status=eq.completed'
        },
        (payload) => {
          console.log('Donation status updated to completed:', payload);
          
          // Show a toast notification for new completed donations
          if (payload.new && (!payload.old?.status || payload.old?.status !== 'completed')) {
            // Show notification based on admin anonymity setting
            const donorName = payload.new.is_anonymous ? 'Someone' : 
                           (payload.new.donor_name || 'Someone');
            
            toast({
              title: "🎉 New Donation Received!",
              description: `${donorName} just made a contribution. Thank you!`,
              duration: 5000,
            });
          }
          
          // Invalidate and refetch the query when a donation is completed
          queryClient.invalidateQueries({ queryKey: ['public-recent-donations'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'donations',
          filter: 'status=eq.completed'
        },
        (payload) => {
          console.log('New completed donation inserted:', payload);
          
          // Show a toast notification for new donations
          if (payload.new) {
            // Show notification based on admin anonymity setting
            const donorName = payload.new.is_anonymous ? 'Someone' : 
                           (payload.new.donor_name || 'Someone');
            
            toast({
              title: "🎉 New Donation Received!",
              description: `${donorName} just made a contribution. Thank you!`,
              duration: 5000,
            });
          }
          
          // Invalidate and refetch the query when a new completed donation is inserted
          queryClient.invalidateQueries({ queryKey: ['public-recent-donations'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up donations subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const formatCurrency = (amount: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDonorName = (donation: any) => {
    // Show "Anonymous" if admin has marked it as anonymous, otherwise show the name
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
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1"></div>
              <CardTitle className="text-2xl lg:text-3xl text-gray-900 dark:text-white font-playfair">
                Recent Donors
              </CardTitle>
              <div className="flex-1 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing || isFetching}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <RefreshCw className={`h-4 w-4 ${(isRefreshing || isFetching) ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-300 font-ibm-plex">
              Thank you to our generous supporters
              {lastUpdated && (
                <span className="block text-sm text-gray-400 mt-1">
                  Last updated: {format(lastUpdated, 'MMM dd, yyyy HH:mm')}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {donations.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <ArrowRight className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-2 text-lg">
                  No donations yet
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  Be the first to make a difference! Your contribution will appear here after successful payment.
                </p>
                <Link to="/sponsorship">
                  <Button className="bg-brand-primary hover:bg-brand-dark-teal text-white">
                    Make a Donation
                  </Button>
                </Link>
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
