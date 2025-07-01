
import { Quote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SponsorshipHero = () => {
  const { toast } = useToast();

  const handleComingSoon = (buttonName: string) => {
    toast({
      title: "Coming Soon!",
      description: `${buttonName} functionality will be available soon.`,
    });
  };

  return (
    <section className="relative bg-gradient-to-br from-white via-brand-light-mint/20 to-brand-mint/10 dark:from-gray-900 dark:via-brand-dark-teal/20 dark:to-brand-teal/10 py-32 overflow-hidden">
      {/* Modern geometric background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-brand-mint/30 to-brand-light-mint/20 rounded-3xl rotate-12 animate-float"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-gradient-to-br from-brand-primary/20 to-brand-dark-teal/30 rounded-2xl -rotate-6 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-brand-light-mint/40 to-brand-mint/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="w-20 h-20 flex items-center justify-center mx-auto mb-8 bg-gradient-to-br from-brand-mint via-brand-light-mint to-white rounded-2xl p-3 shadow-2xl border border-brand-light-mint/30">
          <img 
            src="/lovable-uploads/52524576-df42-4ff1-ae6b-916c64b5f607.png" 
            alt="Gospool Logo" 
            className="w-14 h-14 dark:hidden"
          />
          <img 
            src="/lovable-uploads/2ddb1688-61b9-4b51-b259-c1f342934418.png" 
            alt="Gospool Logo" 
            className="w-14 h-14 hidden dark:block"
          />
        </div>
        
        <h1 className="font-playfair text-6xl lg:text-7xl font-bold bg-gradient-to-r from-brand-primary via-brand-dark-teal to-brand-mint dark:from-brand-mint dark:via-brand-light-mint dark:to-white bg-clip-text text-transparent mb-8 leading-tight">
          Support Gospool's Mission
        </h1>
        
        <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 font-ibm-plex leading-relaxed">
          Help us create a world where no one misses church due to transportation barriers. 
          Your contribution powers free rides, connects communities, and strengthens faith.
        </p>

        {/* Bible Verse */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg p-8 rounded-3xl border-2 border-brand-light-mint/30 dark:border-brand-mint/30 shadow-2xl max-w-4xl mx-auto mb-12">
          <Quote className="h-8 w-8 text-brand-primary dark:text-brand-mint mb-4 mx-auto" />
          <p className="text-gray-700 dark:text-gray-300 italic text-lg mb-3 font-ibm-plex leading-relaxed">
            "Honor the Lord with your wealth and with the best part of everything you produce. Then he will fill your barns with grain, and your vats will overflow with new wine."
          </p>
          <p className="text-brand-primary dark:text-brand-mint font-semibold text-lg font-poppins">Proverbs 3:9-10 (NLT)</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-md mx-auto">
          <button 
            onClick={() => handleComingSoon("Donate Now")}
            className="px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-dark-teal text-white rounded-2xl font-poppins font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-brand-dark-teal/20"
          >
            Donate Now
          </button>
          <button 
            onClick={() => handleComingSoon("Join Board")}
            className="px-8 py-4 bg-white dark:bg-gray-800 text-brand-primary dark:text-brand-mint rounded-2xl font-poppins font-semibold text-lg shadow-xl hover:shadow-2xl border-2 border-brand-mint dark:border-brand-light-mint transform hover:scale-105 transition-all duration-300"
          >
            Join Board
          </button>
        </div>
      </div>
    </section>
  );
};

export default SponsorshipHero;
