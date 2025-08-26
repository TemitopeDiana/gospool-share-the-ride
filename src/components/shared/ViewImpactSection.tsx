
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

const ViewImpactSection = () => {
  const handleViewImpact = () => {
    // Navigate to impact page and scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-brand-mint/10 via-brand-light-mint/20 to-brand-primary/10 dark:from-brand-dark-teal/20 dark:via-brand-mint/10 dark:to-brand-primary/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-brand-mint/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-brand-primary/20 rounded-full blur-xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-brand-primary to-brand-mint dark:from-brand-mint dark:to-brand-light-mint bg-clip-text text-transparent mb-4 sm:mb-6">
            See Our Impact in Action
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-800 dark:text-gray-200 mb-6 sm:mb-8 font-ibm-plex leading-relaxed">
            Discover the stories, projects, and initiatives that showcase how your support is transforming communities and strengthening faith.
          </p>
          
          <Link to="/impact" onClick={handleViewImpact}>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-brand-primary to-brand-dark-teal hover:from-brand-dark-teal hover:to-brand-mint text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-poppins font-semibold shadow-xl rounded-xl sm:rounded-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 touch-manipulation"
            >
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              View Our Impact
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ViewImpactSection;
