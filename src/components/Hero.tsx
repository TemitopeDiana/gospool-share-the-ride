
import { Button } from "@/components/ui/button";
import { Quote } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-brand-light-mint/30 via-white to-brand-mint/20 dark:from-brand-dark-teal dark:via-gray-800 dark:to-brand-teal py-20 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-brand-mint/20 dark:bg-brand-mint/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-brand-light-mint/30 dark:bg-brand-light-mint/15 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-brand-primary/20 dark:bg-brand-primary/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-left">
            <h1 className="font-poppins text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              Free Rides to
              <span className="text-brand-primary dark:text-brand-mint block bg-gradient-to-r from-brand-primary to-brand-dark-teal dark:from-brand-mint dark:to-brand-light-mint bg-clip-text text-transparent">
                Church & Fellowship
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed font-ibm-plex">
              Join a community-driven carpool network that connects church members for safe, 
              free transportation. Never miss services again while building stronger bonds 
              with your church family and helping the environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="bg-gradient-to-r from-brand-primary to-brand-dark-teal hover:from-brand-dark-teal hover:to-brand-primary text-white px-8 py-3 text-lg font-poppins shadow-lg transform hover:scale-105 transition-all duration-300">
                Find a Ride
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-brand-mint text-brand-mint hover:bg-brand-mint hover:text-white dark:border-brand-light-mint dark:text-brand-light-mint dark:hover:bg-brand-light-mint dark:hover:text-brand-dark-teal px-8 py-3 text-lg font-poppins shadow-lg transform hover:scale-105 transition-all duration-300">
                Register Your Church
              </Button>
            </div>

            {/* Bible Verses */}
            <div className="space-y-6">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-brand-light-mint/30 dark:border-brand-mint/30 shadow-lg">
                <Quote className="h-6 w-6 text-brand-primary dark:text-brand-mint mb-3" />
                <p className="text-gray-700 dark:text-gray-300 italic mb-2 font-ibm-plex">
                  "Let us think of ways to motivate one another to acts of love and good works. And let us not neglect our meeting together, as some people do, but encourage one another."
                </p>
                <p className="text-brand-primary dark:text-brand-mint font-semibold text-sm font-poppins">Hebrews 10:24-25</p>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-brand-light-mint/30 dark:border-brand-mint/30 shadow-lg">
                <Quote className="h-6 w-6 text-brand-mint dark:text-brand-light-mint mb-3" />
                <p className="text-gray-700 dark:text-gray-300 italic mb-2 font-ibm-plex">
                  "Two people are better off than one, for they can help each other succeed. If one person falls, the other can reach out and help."
                </p>
                <p className="text-brand-mint dark:text-brand-light-mint font-semibold text-sm font-poppins">Ecclesiastes 4:9-10</p>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="bg-gradient-to-br from-white to-brand-light-mint/20 dark:from-gray-800 dark:to-brand-dark-teal/30 rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 border border-brand-light-mint/50 dark:border-brand-mint/30">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-brand-mint to-brand-light-mint rounded-full p-2">
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
              </div>
              <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-4 text-center font-poppins">
                Your Journey to Faith Starts Here
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-brand-primary to-brand-dark-teal rounded-full shadow-sm"></div>
                  <span className="text-gray-600 dark:text-gray-300 font-ibm-plex">Free rides to all church events</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-brand-mint to-brand-light-mint rounded-full shadow-sm"></div>
                  <span className="text-gray-600 dark:text-gray-300 font-ibm-plex">Safe travel with church family</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-brand-dark-teal to-brand-mint rounded-full shadow-sm"></div>
                  <span className="text-gray-600 dark:text-gray-300 font-ibm-plex">Never miss a service again</span>
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
