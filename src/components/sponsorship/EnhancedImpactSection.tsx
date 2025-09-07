import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, Heart } from "lucide-react";
import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const EnhancedImpactSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 640px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

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
      return data || [];
    }
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const isLoading = partnersLoading;

  const renderPartnerCard = (partner: any, index: number) => {
    return (
      <div key={`${partner.id}-${index}`} className="flex-[0_0_90%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] xl:flex-[0_0_25%] px-3">
        <Card className="h-full hover:shadow-xl transition-all duration-300 dark:bg-gray-800/80 dark:border-gray-700 border border-brand-light-mint/30 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50">
          <CardHeader className="text-center pb-3">
            <div className="flex justify-center mb-4">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                <AvatarImage src={partner.logo_url} alt={partner.company_name} />
                <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-brand-primary to-brand-mint text-white">
                  {partner.company_name.split(' ').map((n: string) => n.charAt(0)).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white font-playfair mb-1">
              {partner.company_name}
            </CardTitle>
            <CardDescription className="text-xs font-medium text-brand-primary dark:text-brand-mint font-poppins">
              Impact Partner
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <div className="flex justify-center items-center text-xs text-gray-500 dark:text-gray-400 pt-2">
              <Heart className="h-3 w-3 mr-1 text-red-400" />
              <span>Thank you for your partnership</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-brand-light-mint/20 via-white to-gray-50 dark:from-brand-dark-teal/20 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-brand-light-mint/20 via-white to-gray-50 dark:from-brand-dark-teal/20 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-brand-primary to-brand-mint dark:from-brand-mint dark:to-brand-light-mint bg-clip-text text-transparent mb-3 sm:mb-4">
            Our Impact Partners
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-800 dark:text-gray-200 max-w-3xl mx-auto font-ibm-plex leading-relaxed">
            We're grateful to our partners who share our vision of transforming church transportation across Nigeria. Together, we're building stronger communities and making faith more accessible.
          </p>
        </div>

        {partners.length > 0 ? (
          <div className="relative">
            {/* Carousel Navigation */}
            {partners.length > 3 && (
              <div className="flex justify-center gap-4 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={scrollPrev}
                  disabled={!canScrollPrev}
                  className="rounded-full w-10 h-10 p-0 border-brand-mint/50 hover:bg-brand-mint/10 dark:border-brand-mint dark:hover:bg-brand-mint/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={scrollNext}
                  disabled={!canScrollNext}
                  className="rounded-full w-10 h-10 p-0 border-brand-mint/50 hover:bg-brand-mint/10 dark:border-brand-mint dark:hover:bg-brand-mint/20"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Carousel */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {partners.map((partner, index) => renderPartnerCard(partner, index))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-700 dark:text-gray-300 font-ibm-plex">
              Our impact partners will be showcased here soon.
            </p>
          </div>
        )}

        {/* Impact Statistics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-brand-primary dark:text-brand-mint mb-2 font-playfair">
              {partners.length}+
            </div>
            <div className="text-gray-800 dark:text-gray-200 font-poppins">Impact Partners</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-brand-dark-teal dark:text-brand-light-mint mb-2 font-playfair">
              {projects.length}+
            </div>
            <div className="text-gray-800 dark:text-gray-200 font-poppins">Active Projects</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="bg-gradient-to-r from-brand-light-mint/30 to-brand-mint/20 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 sm:p-8 max-w-3xl mx-auto">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 font-poppins">
              Partner With Us
            </h3>
            <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-ibm-plex mb-4">
              Join our mission to transform church transportation in Nigeria. Whether through sponsorship, partnership, or volunteer support, together we can create lasting impact in communities across the nation. We welcome partnership and support from service providers.
              To support the Gospool Vision please contact gospoolapp@gmail.com” 
            </p>
            <Button className="bg-gradient-to-r from-brand-primary to-brand-dark-teal hover:from-brand-dark-teal hover:to-brand-mint text-white font-poppins px-6 py-2">
              Become a Partner
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedImpactSection;
