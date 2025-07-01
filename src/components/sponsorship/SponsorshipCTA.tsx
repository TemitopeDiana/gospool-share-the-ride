
import { Button } from "@/components/ui/button";

interface SponsorshipCTAProps {
  onDonateClick?: () => void;
  onJoinBoardClick?: () => void;
}

const SponsorshipCTA = ({ onDonateClick, onJoinBoardClick }: SponsorshipCTAProps) => {
  return (
    <section className="py-24 bg-gradient-to-br from-brand-primary via-brand-dark-teal to-brand-mint relative overflow-hidden">
      {/* Modern geometric background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-brand-light-mint/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-white/5 to-brand-mint/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="font-playfair text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
          Ready to Transform Your Community?
        </h2>
        <p className="text-2xl text-white/90 mb-12 max-w-4xl mx-auto font-ibm-plex leading-relaxed">
          Join the mission to make church accessible for everyone through free, safe transportation.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
          <Button 
            size="lg" 
            className="bg-white text-brand-primary hover:bg-brand-light-mint hover:text-brand-dark-teal px-12 py-6 text-xl font-poppins font-semibold shadow-2xl rounded-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20"
            onClick={onJoinBoardClick}
          >
            Become a Board Member
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-white text-white hover:bg-white hover:text-brand-primary px-12 py-6 text-xl font-poppins font-semibold shadow-2xl rounded-2xl transform hover:scale-105 transition-all duration-300 bg-white/10 backdrop-blur-sm"
            onClick={onDonateClick}
          >
            Donate to the Cause
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SponsorshipCTA;
