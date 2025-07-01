
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div className="min-h-screen font-inter">
      <Navigation />
      <Hero />
      <Features />
      <CallToAction />
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
