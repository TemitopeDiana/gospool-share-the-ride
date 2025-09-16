import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, Heart, ExternalLink } from "lucide-react";
import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const EnhancedImpactSponsorsSection = () => {
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

  const { data: impactSponsors = [], isLoading } = useQuery({
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

  const renderSponsorCard = (sponsor: any, index: number) => {
    const logoUrl = sponsor.sponsorship_applications?.[0]?.profile_picture_url || sponsor.logo_url;
    
    return (
      <div key={`${sponsor.id}-${index}`} className="flex-[0_0_90%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] xl:flex-[0_0_25%] px-3">
        <Card className="h-full hover:shadow-xl transition-all duration-300 dark:bg-gray-800/80 dark:border-gray-700 border border-brand-light-mint/30 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50">
          <CardHeader className="text-center pb-3">
            <div className="flex justify-center mb-4">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                <AvatarImage src={logoUrl} alt={sponsor.sponsor_name} />
                <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-brand-blue to-blue-600 text-white">
                  {sponsor.sponsor_name.split(' ').map((n: string) => n.charAt(0)).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white font-playfair mb-1">
              {sponsor.sponsor_name}
            </CardTitle>
            <CardDescription className="text-xs font-medium text-brand-blue dark:text-blue-400 font-poppins capitalize">
              {sponsor.sponsor_type} Impact Sponsor
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            {sponsor.motivation && (
              <p className="text-xs text-gray-700 dark:text-gray-300 font-ibm-plex italic line-clamp-3">
                "{sponsor.motivation}"
              </p>
            )}
            {sponsor.website_url && (
              <Button
                size="sm"
                variant="outline"
                className="w-full border-brand-blue/50 hover:bg-brand-blue/10 dark:border-blue-400 dark:hover:bg-blue-400/20 text-xs"
                onClick={() => window.open(sponsor.website_url, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Visit Website
              </Button>
            )}
            <div className="flex justify-center items-center text-xs text-gray-500 dark:text-gray-400 pt-2">
              <Heart className="h-3 w-3 mr-1 text-red-400" />
              <span>Thank you for your sponsorship</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto mb-8 sm:mb-12 lg:mb-16">
        <Card className="dark:bg-gray-800/80 dark:border-gray-700 rounded-xl sm:rounded-2xl shadow-2xl border border-brand-light-mint/30 mx-4 sm:mx-0">
          <CardHeader className="text-center pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl text-gray-900 dark:text-white mb-2 sm:mb-3 font-playfair px-2">
              Current Impact Sponsors
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-ibm-plex px-2">
              Visionary leaders supporting our mission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand-blue mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Loading sponsors...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-brand-blue to-blue-600 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent mb-3 sm:mb-4">
          Our Impact Sponsors
        </h2>
        <p className="text-base sm:text-lg text-gray-800 dark:text-gray-200 max-w-3xl mx-auto font-ibm-plex leading-relaxed">
          Meet our visionary sponsors who are transforming church transportation across Nigeria through their generous support and partnership.
        </p>
      </div>

      {impactSponsors.length > 0 ? (
        <div className="relative">
          {/* Carousel Navigation */}
          {impactSponsors.length > 3 && (
            <div className="flex justify-center gap-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="rounded-full w-10 h-10 p-0 border-brand-blue/50 hover:bg-brand-blue/10 dark:border-blue-400 dark:hover:bg-blue-400/20"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="rounded-full w-10 h-10 p-0 border-brand-blue/50 hover:bg-brand-blue/10 dark:border-blue-400 dark:hover:bg-blue-400/20"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {impactSponsors.map((sponsor, index) => renderSponsorCard(sponsor, index))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Card className="dark:bg-gray-800/80 dark:border-gray-700 rounded-xl shadow-lg border border-brand-light-mint/30 max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="bg-gradient-to-r from-blue-50 to-brand-light-mint/20 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4">
                <p className="text-brand-blue dark:text-blue-400 font-medium text-base sm:text-lg font-poppins">
                  Be among the first to become an impact sponsor!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Impact Statistics */}
      {impactSponsors.length > 0 && (
        <div className="mt-12 text-center max-w-md mx-auto">
          <div className="text-3xl sm:text-4xl font-bold text-brand-blue dark:text-blue-400 mb-2 font-playfair">
            {impactSponsors.length}+
          </div>
          <div className="text-gray-800 dark:text-gray-200 font-poppins">Impact Sponsors</div>
        </div>
      )}
    </div>
  );
};

export default EnhancedImpactSponsorsSection;
