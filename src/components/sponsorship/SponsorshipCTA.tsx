
import { Button } from "@/components/ui/button";
import { Quote } from "lucide-react";

const SponsorshipCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-brand-blue to-brand-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-playfair text-4xl font-bold text-white mb-6">
          Ready to Transform Your Community?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto font-ibm-plex">
          Join the mission to make church accessible for everyone through free, safe transportation.
        </p>
        
        {/* Bible Verse about Treasure in Heaven */}
        <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg max-w-2xl mx-auto mb-8 border border-white/30">
          <Quote className="h-6 w-6 text-white mx-auto mb-3" />
          <p className="text-white italic mb-2 font-ibm-plex">
            "Sell your possessions and give to the poor. This will store up treasure for you in heaven!"
          </p>
          <p className="text-blue-100 font-semibold text-sm font-poppins">Luke 12:33-34</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-brand-blue hover:bg-gray-100 px-8 py-3 text-lg font-poppins shadow-lg">
            Become a Board Member
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-blue px-8 py-3 text-lg font-poppins shadow-lg">
            Donate to the Cause
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SponsorshipCTA;
