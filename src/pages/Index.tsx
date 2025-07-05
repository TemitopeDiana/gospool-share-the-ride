
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { CallToAction } from "@/components/CallToAction";
import ViewImpactSection from "@/components/shared/ViewImpactSection";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div className="min-h-screen font-inter overflow-x-hidden">
      <Navigation />
      <Hero />
      <Features />
      <ViewImpactSection />
      <CallToAction />
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
