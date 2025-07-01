
import { Button } from "@/components/ui/button";
import { Map, Quote } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-left">
            <h1 className="font-playfair text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              Free Rides to
              <span className="text-brand-teal block">Church & Fellowship</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Join a community-driven carpool network that connects church members for safe, 
              free transportation. Never miss services again while building stronger bonds 
              with your church family and helping the environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="bg-brand-teal hover:bg-teal-700 text-white px-8 py-3 text-lg">
                Find a Ride
              </Button>
              <Button size="lg" variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white dark:border-brand-green dark:text-brand-green px-8 py-3 text-lg">
                Register Your Church
              </Button>
            </div>

            {/* Bible Verses */}
            <div className="space-y-6">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg">
                <Quote className="h-6 w-6 text-brand-teal mb-3" />
                <p className="text-gray-700 dark:text-gray-300 italic mb-2">
                  "Let us think of ways to motivate one another to acts of love and good works. And let us not neglect our meeting together, as some people do, but encourage one another."
                </p>
                <p className="text-brand-teal font-semibold text-sm">Hebrews 10:24-25</p>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg">
                <Quote className="h-6 w-6 text-brand-green mb-3" />
                <p className="text-gray-700 dark:text-gray-300 italic mb-2">
                  "Two people are better off than one, for they can help each other succeed. If one person falls, the other can reach out and help."
                </p>
                <p className="text-brand-green font-semibold text-sm">Ecclesiastes 4:9-10</p>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/7eae2d36-486c-4f8e-aa01-ca9414ab4528.png" 
                    alt="Gospool Logo" 
                    className="w-16 h-16 dark:hidden"
                  />
                  <img 
                    src="/lovable-uploads/2ddb1688-61b9-4b51-b259-c1f342934418.png" 
                    alt="Gospool Logo" 
                    className="w-16 h-16 hidden dark:block"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-4 text-center">
                Your Journey to Faith Starts Here
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-brand-teal rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300">Free rides to all church events</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-brand-green rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300">Safe travel with church family</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-brand-purple rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300">Never miss a service again</span>
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
