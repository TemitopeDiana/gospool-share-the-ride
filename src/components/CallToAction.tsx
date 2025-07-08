
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Users } from 'lucide-react';
import { VolunteerForm } from './sponsorship/VolunteerForm';

export const CallToAction = () => {
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary/80 to-primary/90 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-background/5 to-background/10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Join our community of changemakers and help us create lasting impact in lives around the world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild
              size="lg" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <a href="/sponsorship">
                <Heart className="mr-2 h-5 w-5" />
                Support Our Cause
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              onClick={() => setShowVolunteerForm(true)}
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Users className="mr-2 h-5 w-5" />
              Volunteer With Us
            </Button>
          </div>
          
          <p className="text-primary-foreground/70 mt-6 text-sm">
            Every contribution, big or small, creates ripples of positive change.
          </p>
        </div>
      </div>
      
      <VolunteerForm 
        open={showVolunteerForm} 
        onClose={() => setShowVolunteerForm(false)} 
      />
    </section>
  );
};
