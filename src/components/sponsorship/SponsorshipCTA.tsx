
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";

interface SponsorshipCTAProps {
  onDonateClick?: () => void;
  onJoinSponsorClick?: () => void;
}

const SponsorshipCTA = ({ onDonateClick, onJoinSponsorClick }: SponsorshipCTAProps) => {
  const { trackContentEngagement, trackDonationFunnel } = useAnalytics();

  const handleDonateClick = () => {
    trackContentEngagement('project', 'sponsorship_cta_donate', 'clicked');
    trackDonationFunnel('initiated', undefined, {
      source: 'sponsorship_cta',
    });
    onDonateClick?.();
  };

  const handleSponsorClick = () => {
    trackContentEngagement('project', 'sponsorship_cta_sponsor', 'clicked');
    onJoinSponsorClick?.();
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-brand-primary via-brand-dark-teal to-brand-mint relative overflow-hidden">
      {/* Modern geometric background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-white/10 rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-24 sm:w-36 lg:w-48 h-24 sm:h-36 lg:h-48 bg-brand-light-mint/20 rounded-full blur-xl sm:blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-gradient-to-r from-white/5 to-brand-mint/10 rounded-full blur-2xl sm:blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight px-2">
          Ready to Transform Your Community?
        </h2>
        <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-12 max-w-4xl mx-auto font-ibm-plex leading-relaxed px-4">
          Join the mission to make church accessible for everyone through free, safe transportation.
        </p>
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 lg:space-x-6 justify-center max-w-2xl mx-auto px-4">
          <Button 
            size="lg" 
            className="bg-white text-brand-primary hover:bg-brand-light-mint hover:text-brand-dark-teal px-8 py-4 text-lg font-poppins font-semibold shadow-2xl rounded-xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20 w-full sm:w-auto"
            onClick={handleSponsorClick}
          >
            Become an Impact Sponsor
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-white text-white hover:bg-white hover:text-brand-primary px-8 py-4 text-lg font-poppins font-semibold shadow-2xl rounded-xl transform hover:scale-105 transition-all duration-300 bg-white/10 backdrop-blur-sm w-full sm:w-auto"
            onClick={handleDonateClick}
          >
            Donate to the Cause
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SponsorshipCTA;
