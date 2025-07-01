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
    <section className="relative bg-gradient-to-br from-white via-brand-light-mint/10 to-gray-50 dark:from-gray-900 dark:via-brand-dark-teal/10 dark:to-gray-800 py-24 overflow-hidden">
      {/* Modern geometric background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-brand-mint/30 to-brand-light-mint/20 rounded-3xl rotate-12 animate-float"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-gradient-to-br from-brand-primary/20 to-brand-dark-teal/30 rounded-2xl -rotate-6 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-brand-light-mint/40 to-brand-mint/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-slide-in-left">
            <h1 className="font-poppins text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-8">
              Free Rides to
              <span className="text-brand-primary dark:text-brand-mint block bg-gradient-to-r from-brand-primary to-brand-dark-teal dark:from-brand-mint dark:to-brand-light-mint bg-clip-text text-transparent">
                Church & Fellowship
              </span>
            </h1>
            <p className="text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed font-ibm-plex">
              Join a community-driven carpool network that connects church members for safe, 
              free transportation. Never miss services again while building stronger bonds 
              with your church family and helping the environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 mb-16">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-brand-primary to-brand-dark-teal hover:from-brand-dark-teal hover:to-brand-primary text-white px-12 py-6 text-xl font-poppins font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl"
                onClick={handleComingSoon}
              >
                Find a Ride
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-3 border-brand-mint text-brand-mint hover:bg-brand-mint hover:text-white dark:border-brand-light-mint dark:text-brand-light-mint dark:hover:bg-brand-light-mint dark:hover:text-brand-dark-teal px-12 py-6 text-xl font-poppins font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl"
                onClick={handleComingSoon}
              >
                Register Your Church
              </Button>
            </div>

            {/* Bible Verses */}
            <div className="space-y-8">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg p-8 rounded-3xl border-2 border-brand-light-mint/30 dark:border-brand-mint/30 shadow-2xl">
                <Quote className="h-8 w-8 text-brand-primary dark:text-brand-mint mb-4" />
                <p className="text-gray-700 dark:text-gray-300 italic text-lg mb-3 font-ibm-plex leading-relaxed">
                  "Let us think of ways to motivate one another to acts of love and good works. And let us not neglect our meeting together, as some people do, but encourage one another."
                </p>
                <p className="text-brand-primary dark:text-brand-mint font-semibold text-lg font-poppins">Hebrews 10:24-25</p>
              </div>
              
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg p-8 rounded-3xl border-2 border-brand-light-mint/30 dark:border-brand-mint/30 shadow-2xl">
                <Quote className="h-8 w-8 text-brand-mint dark:text-brand-light-mint mb-4" />
                <p className="text-gray-700 dark:text-gray-300 italic text-lg mb-3 font-ibm-plex leading-relaxed">
                  "Two people are better off than one, for they can help each other succeed. If one person falls, the other can reach out and help."
                </p>
                <p className="text-brand-mint dark:text-brand-light-mint font-semibold text-lg font-poppins">Ecclesiastes 4:9-10</p>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="bg-gradient-to-br from-white to-brand-light-mint/30 dark:from-gray-800 dark:to-brand-dark-teal/30 rounded-3xl shadow-2xl p-10 transform rotate-2 hover:rotate-0 transition-transform duration-500 border-2 border-brand-light-mint/50 dark:border-brand-mint/30">
              <div className="flex items-center justify-center mb-8">
                <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-brand-mint to-brand-light-mint rounded-3xl p-3 shadow-xl">
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
              </div>
              <h3 className="font-semibold text-2xl text-gray-900 dark:text-white mb-6 text-center font-poppins">
                Your Journey to Faith Starts Here
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-gradient-to-r from-brand-primary to-brand-dark-teal rounded-full shadow-lg"></div>
                  <span className="text-lg text-gray-600 dark:text-gray-300 font-ibm-plex">Free rides to all church events</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-gradient-to-r from-brand-mint to-brand-light-mint rounded-full shadow-lg"></div>
                  <span className="text-lg text-gray-600 dark:text-gray-300 font-ibm-plex">Safe travel with church family</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-gradient-to-r from-brand-dark-teal to-brand-mint rounded-full shadow-lg"></div>
                  <span className="text-lg text-gray-600 dark:text-gray-300 font-ibm-plex">Never miss a service again</span>
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
