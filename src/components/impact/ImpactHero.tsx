
import { Quote } from "lucide-react";

const ImpactHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-white via-brand-light-mint/20 to-brand-mint/10 dark:from-gray-900 dark:via-brand-dark-teal/20 dark:to-brand-teal/10 py-16 sm:py-24 lg:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-24 sm:w-40 h-24 sm:h-40 bg-gradient-to-br from-brand-mint/30 to-brand-light-mint/20 rounded-2xl sm:rounded-3xl rotate-12 animate-float"></div>
        <div className="absolute bottom-16 sm:bottom-32 right-8 sm:right-16 w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-br from-brand-primary/20 to-brand-dark-teal/30 rounded-xl sm:rounded-2xl -rotate-6 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-6 sm:mb-8 bg-gradient-to-br from-brand-mint via-brand-light-mint to-white rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-2xl border border-brand-light-mint/30">
          <img 
            src="/images/Logo mark v2 dark.png" 
            alt="Gospool Logo" 
            className="w-10 h-10 sm:w-14 sm:h-14 dark:hidden"
          />
          <img 
            src="/images/Logomark v1 white.png" 
            alt="Gospool Logo" 
            className="w-10 h-10 sm:w-14 sm:h-14 hidden dark:block"
          />
        </div>
        
        <h1 className="font-playfair text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-brand-primary via-brand-dark-teal to-brand-mint dark:from-brand-mint dark:via-brand-light-mint dark:to-white bg-clip-text text-transparent mb-6 sm:mb-8 leading-tight px-2">
          Our Impact Story
        </h1>
        
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-800 dark:text-gray-200 max-w-4xl mx-auto mb-8 sm:mb-12 font-ibm-plex leading-relaxed px-4">
          Discover how Gospool is transforming communities, connecting hearts, and strengthening faith through innovative transportation solutions and community initiatives.
        </p>

        {/* Bible Verse */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border-2 border-brand-light-mint/30 dark:border-brand-mint/30 shadow-2xl max-w-4xl mx-auto">
          <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-brand-primary dark:text-brand-mint mb-3 sm:mb-4 mx-auto" />
          <p className="text-gray-700 dark:text-gray-300 italic text-base sm:text-lg mb-2 sm:mb-3 font-ibm-plex leading-relaxed">
            "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up."
          </p>
          <p className="text-brand-primary dark:text-brand-mint font-semibold text-base sm:text-lg font-poppins">Galatians 6:9 (NIV)</p>
        </div>
      </div>
    </section>
  );
};

export default ImpactHero;
