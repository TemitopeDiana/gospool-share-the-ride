
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { CallToAction } from "@/components/CallToAction";
import ViewImpactSection from "@/components/shared/ViewImpactSection";
import RecentDonors from "@/components/sponsorship/RecentDonors";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { usePageTracking } from "@/hooks/useAnalytics";

const Index = () => {
  usePageTracking('/');

  return (
    <div className="min-h-screen font-inter overflow-x-hidden pt-16">
      <Navigation />
      <Hero />
      <Features />
      <ViewImpactSection />
      <RecentDonors />
      <CallToAction />
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
