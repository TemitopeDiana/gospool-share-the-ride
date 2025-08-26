
import { Button } from "@/components/ui/button";
import { Quote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Hero = () => {
  const { toast } = useToast();

  const handleComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available soon!",
    });
  };

  return (
    <section className="relative bg-gradient-to-br from-white via-brand-light-mint/10 to-gray-50 dark:from-gray-900 dark:via-brand-dark-teal/10 dark:to-gray-800 py-12 sm:py-16 lg:py-24 overflow-hidden">
      {/* Modern geometric background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 sm:top-20 left-4 sm:left-20 w-20 sm:w-40 h-20 sm:h-40 bg-gradient-to-br from-brand-mint/30 to-brand-light-mint/20 rounded-2xl sm:rounded-3xl rotate-12 animate-float"></div>
        <div className="absolute bottom-16 sm:bottom-32 right-4 sm:right-16 w-16 sm:w-32 h-16 sm:h-32 bg-gradient-to-br from-brand-primary/20 to-brand-dark-teal/30 rounded-xl sm:rounded-2xl -rotate-6 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 sm:right-1/3 w-12 sm:w-24 h-12 sm:h-24 bg-gradient-to-br from-brand-light-mint/40 to-brand-mint/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="animate-slide-in-left order-2 lg:order-1">
            <h1 className="font-poppins text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6 sm:mb-8 text-center lg:text-left">
              Free Rides to
              <span className="text-brand-primary dark:text-brand-mint block bg-gradient-to-r from-brand-primary to-brand-dark-teal dark:from-brand-mint dark:to-brand-light-mint bg-clip-text text-transparent">
                Church & Fellowship
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-800 dark:text-gray-200 mb-8 sm:mb-12 leading-relaxed font-ibm-plex text-center lg:text-left">
              Join a faith-driven carpool network that connects church members for safe, 
              free and reliable transportation. Never miss services again while building stronger bonds 
              with your church family and helping the environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8 sm:mb-16 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-brand-primary to-brand-dark-teal hover:from-brand-dark-teal hover:to-brand-primary text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-poppins font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl w-full sm:w-auto touch-manipulation"
                onClick={handleComingSoon}
              >
                Register Your Church
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-3 border-brand-mint text-brand-mint hover:bg-brand-mint hover:text-white dark:border-brand-light-mint dark:text-brand-light-mint dark:hover:bg-brand-light-mint dark:hover:text-brand-dark-teal px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-poppins font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl w-full sm:w-auto touch-manipulation"
                onClick={handleComingSoon}
              >
                Find a Ride
              </Button>
            </div>

            {/* Bible Verses */}
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-brand-light-mint/30 dark:border-brand-mint/30 shadow-2xl">
                <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-brand-primary dark:text-brand-mint mb-3 sm:mb-4" />
                <p className="text-gray-700 dark:text-gray-300 italic text-base sm:text-lg mb-2 sm:mb-3 font-ibm-plex leading-relaxed">
                  "Let us think of ways to motivate one another to acts of love and good works. And let us not neglect our meeting together, as some people do, but encourage one another."
                </p>
                <p className="text-brand-primary dark:text-brand-mint font-semibold text-base sm:text-lg font-poppins">Hebrews 10:24-25</p>
              </div>
              
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-brand-light-mint/30 dark:border-brand-mint/30 shadow-2xl">
                <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-brand-mint dark:text-brand-light-mint mb-3 sm:mb-4" />
                <p className="text-gray-700 dark:text-gray-300 italic text-base sm:text-lg mb-2 sm:mb-3 font-ibm-plex leading-relaxed">
                  "Two people are better off than one, for they can help each other succeed. If one person falls, the other can reach out and help."
                </p>
                <p className="text-brand-mint dark:text-brand-light-mint font-semibold text-base sm:text-lg font-poppins">Ecclesiastes 4:9-10</p>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in order-1 lg:order-2 mb-8 lg:mb-0">
            <div className="bg-gradient-to-br from-white to-brand-light-mint/30 dark:from-gray-800 dark:to-brand-dark-teal/30 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 transform rotate-1 hover:rotate-0 transition-transform duration-500 border-2 border-brand-light-mint/50 dark:border-brand-mint/30 mx-4 sm:mx-0">
              <div className="flex items-center justify-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-gradient-to-br from-brand-mint to-brand-light-mint rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-xl">
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
              </div>
              <h3 className="font-semibold text-xl sm:text-2xl text-gray-900 dark:text-white mb-4 sm:mb-6 text-center font-poppins">
                Your Journey to Faith Starts Here
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-brand-primary to-brand-dark-teal rounded-full shadow-lg flex-shrink-0"></div>
                  <span className="text-base sm:text-lg text-gray-800 dark:text-gray-200 font-ibm-plex">Free rides to all church events</span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-brand-mint to-brand-light-mint rounded-full shadow-lg flex-shrink-0"></div>
                  <span className="text-base sm:text-lg text-gray-800 dark:text-gray-200 font-ibm-plex">Safe travel with church family</span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-brand-dark-teal to-brand-mint rounded-full shadow-lg flex-shrink-0"></div>
                  <span className="text-base sm:text-lg text-gray-800 dark:text-gray-200 font-ibm-plex">Never miss a service again</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
