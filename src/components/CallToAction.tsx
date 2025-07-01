
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-brand-blue to-brand-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-playfair text-4xl font-bold text-white mb-6">
          Ready to Join the Community?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Whether you need a ride or want to share your journey with others, 
          Gospool makes it easy to connect with your church family.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-brand-blue hover:bg-gray-100 px-8 py-3 text-lg">
            Download App
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-blue px-8 py-3 text-lg">
            <Link to="/sponsorship">
              Partner With Us
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
