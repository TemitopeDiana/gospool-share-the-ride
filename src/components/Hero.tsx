
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-left">
            <h1 className="font-playfair text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Free Rides to
              <span className="text-brand-blue block">Church & Fellowship</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Never miss church services or programs again. Connect with fellow believers 
              for safe, free transportation that strengthens community bonds while making 
              church more accessible for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-brand-blue hover:bg-blue-600 text-white px-8 py-3 text-lg">
                Find a Ride
              </Button>
              <Button size="lg" variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white px-8 py-3 text-lg">
                Register Your Church
              </Button>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center justify-center mb-6">
                <Map className="h-16 w-16 text-brand-green" />
              </div>
              <h3 className="font-semibold text-xl text-gray-900 mb-4 text-center">
                Your Journey to Faith Starts Here
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-brand-blue rounded-full"></div>
                  <span className="text-gray-600">Free rides to all church events</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-brand-green rounded-full"></div>
                  <span className="text-gray-600">Safe travel with church family</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-brand-purple rounded-full"></div>
                  <span className="text-gray-600">Never miss a service again</span>
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
