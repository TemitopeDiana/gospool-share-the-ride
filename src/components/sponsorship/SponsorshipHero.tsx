
import { Quote } from "lucide-react";

interface SponsorshipHeroProps {
  onDonateClick?: () => void;
  onJoinBoardClick?: () => void;
}

const SponsorshipHero = ({ onDonateClick, onJoinBoardClick }: SponsorshipHeroProps) => {
  return (
    <section className="relative bg-gradient-to-br from-white via-brand-light-mint/20 to-brand-mint/10 dark:from-gray-900 dark:via-brand-dark-teal/20 dark:to-brand-teal/10 py-16 sm:py-24 lg:py-32 overflow-hidden">
      {/* Modern geometric background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-24 sm:w-40 h-24 sm:h-40 bg-gradient-to-br from-brand-mint/30 to-brand-light-mint/20 rounded-2xl sm:rounded-3xl rotate-12 animate-float"></div>
        <div className="absolute bottom-16 sm:bottom-32 right-8 sm:right-16 w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-br from-brand-primary/20 to-brand-dark-teal/30 rounded-xl sm:rounded-2xl -rotate-6 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-br from-brand-light-mint/40 to-brand-mint/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-6 sm:mb-8 bg-gradient-to-br from-brand-mint via-brand-light-mint to-white rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-2xl border border-brand-light-mint/30">
          <img 
            src="/lovable-uploads/52524576-df42-4ff1-ae6b-916c64b5f607.png" 
            alt="Gospool Logo" 
            className="w-10 h-10 sm:w-14 sm:h-14 dark:hidden"
          />
          <img 
            src="/lovable-uploads/2ddb1688-61b9-4b51-b259-c1f342934418.png" 
            alt="Gospool Logo" 
            className="w-10 h-10 sm:w-14 sm:h-14 hidden dark:block"
          />
        </div>
        
        <h1 className="font-playfair text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-brand-primary via-brand-dark-teal to-brand-mint dark:from-brand-mint dark:via-brand-light-mint dark:to-white bg-clip-text text-transparent mb-6 sm:mb-8 leading-tight px-2">
          Support Gospool's Mission
        </h1>
        
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8 sm:mb-12 font-ibm-plex leading-relaxed px-4">
          Help us create a world where no one misses church due to transportation barriers. 
          Your contribution powers free rides, connects communities, and strengthens faith.
        </p>

        {/* Bible Verse */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border-2 border-brand-light-mint/30 dark:border-brand-mint/30 shadow-2xl max-w-4xl mx-auto mb-8 sm:mb-12">
          <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-brand-primary dark:text-brand-mint mb-3 sm:mb-4 mx-auto" />
          <p className="text-gray-700 dark:text-gray-300 italic text-base sm:text-lg mb-2 sm:mb-3 font-ibm-plex leading-relaxed">
            "Honor the Lord with your wealth and with the best part of everything you produce. Then he will fill your barns with grain, and your vats will overflow with new wine."
          </p>
          <p className="text-brand-primary dark:text-brand-mint font-semibold text-base sm:text-lg font-poppins">Proverbs 3:9-10 (NLT)</p>
        </div>
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 lg:space-x-6 justify-center max-w-lg mx-auto px-4">
          <button 
            onClick={onDonateClick}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-brand-primary to-brand-dark-teal text-white rounded-xl sm:rounded-2xl font-poppins font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-brand-dark-teal/20 w-full sm:w-auto"
          >
            Donate Now
          </button>
          <button 
            onClick={onJoinBoardClick}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-800 text-brand-primary dark:text-brand-mint rounded-xl sm:rounded-2xl font-poppins font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl border-2 border-brand-mint dark:border-brand-light-mint transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
          >
            Join Board
          </button>
        </div>
      </div>
    </section>
  );
};

export default SponsorshipHero;
