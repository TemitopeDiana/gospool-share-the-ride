
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ImpactHero from "@/components/impact/ImpactHero";
import ProjectsSection from "@/components/impact/ProjectsSection";
import NewsSection from "@/components/impact/NewsSection";
import ImpactTeamSection from "@/components/impact/ImpactTeamSection";
import { Toaster } from "@/components/ui/toaster";
import { usePageTracking } from "@/hooks/useAnalytics";

const Impact = () => {
  usePageTracking('/impact');
  return (
    <div className="min-h-screen font-inter overflow-x-hidden pt-16">
      <Navigation />
      <ImpactHero />
      <ProjectsSection />
      <NewsSection />
      <ImpactTeamSection />
      <Footer />
      <Toaster />
    </div>
  );
};

export default Impact;
