
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Users } from 'lucide-react';
import { VolunteerForm } from './sponsorship/VolunteerForm';

export const CallToAction = () => {
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community of changemakers and help us create lasting impact in lives around the world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
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
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
            >
              <Users className="mr-2 h-5 w-5" />
              Volunteer With Us
            </Button>
          </div>
          
          <p className="text-blue-200 mt-6 text-sm">
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
