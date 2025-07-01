
import { Quote } from "lucide-react";

const SponsorshipHero = () => {
  return (
    <section className="bg-gradient-to-br from-brand-light-mint/30 via-white to-brand-mint/20 dark:from-brand-dark-teal dark:via-gray-800 dark:to-brand-teal py-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-brand-mint/20 dark:bg-brand-mint/10 rounded-full animate-float"></div>
        <div className="absolute bottom-40 right-20 w-24 h-24 bg-brand-light-mint/30 dark:bg-brand-light-mint/15 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-brand-mint to-brand-light-mint rounded-full p-2 shadow-lg">
          <img 
            src="/lovable-uploads/52524576-df42-4ff1-ae6b-916c64b5f607.png" 
            alt="Gospool Logo" 
            className="w-12 h-12 dark:hidden"
          />
          <img 
            src="/lovable-uploads/2ddb1688-61b9-4b51-b259-c1f342934418.png" 
            alt="Gospool Logo" 
            className="w-12 h-12 hidden dark:block"
          />
        </div>
        <h1 className="font-playfair text-5xl font-bold bg-gradient-to-r from-brand-primary to-brand-dark-teal dark:from-brand-mint dark:to-brand-light-mint bg-clip-text text-transparent mb-6">
          Support Gospool's Mission
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 font-ibm-plex">
          Help us create a world where no one misses church due to transportation barriers. 
          Your contribution powers free rides, connects communities, and strengthens faith.
        </p>
        
        {/* Bible Verse about Supporting Gospel Workers */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl max-w-3xl mx-auto mt-8 border border-brand-light-mint/30 dark:border-brand-mint/30 shadow-lg">
          <Quote className="h-8 w-8 text-brand-primary dark:text-brand-mint mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-300 italic text-lg mb-3 font-ibm-plex">
            "But how can they call on him to save them unless they believe in him? And how can they believe in him if they have never heard about him? And how can they hear about him unless someone tells them? And how will anyone go and tell them without being sent? That is why the Scriptures say, 'How beautiful are the feet of messengers who bring good news!'"
          </p>
          <p className="text-brand-primary dark:text-brand-mint font-semibold font-poppins">Romans 10:14-15</p>
        </div>
      </div>
    </section>
  );
};

export default SponsorshipHero;
