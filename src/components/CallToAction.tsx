
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Users } from 'lucide-react';
import { VolunteerFormDialog } from './shared/VolunteerFormDialog';

export const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-brand-dark-teal via-brand-teal to-brand-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-brand-light-mint mb-8">
            Join our community of changemakers and help us create lasting impact in lives around the world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild
              size="lg" 
              className="bg-white text-brand-dark-teal hover:bg-brand-light-mint hover:text-brand-primary px-8 py-4 text-lg font-semibold border-2 border-white shadow-xl rounded-xl transform hover:scale-105 transition-all duration-300"
            >
              <a href="/sponsorship">
                <Heart className="mr-2 h-5 w-5" />
                Support Our Cause
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            
            <VolunteerFormDialog>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-brand-dark-teal px-8 py-4 text-lg font-semibold bg-white/10 backdrop-blur-sm rounded-xl transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Users className="mr-2 h-5 w-5" />
                Volunteer With Us
              </Button>
            </VolunteerFormDialog>
          </div>
          
          <p className="text-brand-light-mint/80 mt-6 text-sm">
            Every contribution, big or small, creates ripples of positive change.
          </p>
        </div>
      </div>
    </section>
  );
};
