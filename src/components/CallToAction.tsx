
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-brand-primary via-brand-dark-teal to-brand-mint dark:from-brand-dark-teal dark:via-brand-primary dark:to-brand-mint relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-40 h-40 bg-brand-light-mint/20 rounded-full animate-float"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-brand-mint/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="font-playfair text-4xl font-bold text-white mb-6">
          Join Your Church Community Today
        </h2>
        <p className="text-xl text-brand-light-mint/90 dark:text-white/90 mb-8 max-w-2xl mx-auto font-ibm-plex">
          Whether you need a free ride to church or want to help fellow members attend services, 
          Gospool makes it simple to connect and strengthen your faith community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-brand-primary hover:bg-brand-light-mint hover:text-brand-dark-teal px-8 py-3 text-lg shadow-xl transform hover:scale-105 transition-all duration-300 font-poppins font-semibold">
            Get Started Free
          </Button>
          <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-brand-primary px-8 py-3 text-lg shadow-xl transform hover:scale-105 transition-all duration-300 font-poppins font-semibold bg-white/10 backdrop-blur-sm">
            <Link to="/sponsorship" className="text-white hover:text-brand-primary">
              Register Your Church
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
