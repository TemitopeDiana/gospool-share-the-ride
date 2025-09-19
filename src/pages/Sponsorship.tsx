
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SponsorshipHero from "@/components/sponsorship/SponsorshipHero";
import DonationSection from "@/components/sponsorship/DonationSection";
import RecentDonors from "@/components/sponsorship/RecentDonors";
import BoardMemberSection from "@/components/sponsorship/BoardMemberSection";
import BenefitsSection from "@/components/sponsorship/BenefitsSection";
import EnhancedImpactSection from "@/components/sponsorship/EnhancedImpactSection";
import SponsorshipCTA from "@/components/sponsorship/SponsorshipCTA";
import DownloadReportSection from "@/components/sponsorship/DownloadReportSection";
import ViewImpactSection from "@/components/shared/ViewImpactSection";
import { Toaster } from "@/components/ui/toaster";
import { useState, useRef, useEffect } from "react";
import { usePageTracking } from "@/hooks/useAnalytics";
import { useLocation } from "react-router-dom";

const Sponsorship = () => {
  usePageTracking('/sponsorship');
  const location = useLocation();
  
  const [shouldScrollToDonation, setShouldScrollToDonation] = useState(false);
  const [shouldScrollToSponsor, setShouldScrollToSponsor] = useState(false);
  const donationRef = useRef<HTMLDivElement>(null);
  const sponsorRef = useRef<HTMLDivElement>(null);

  // Check if we have a pre-selected project from navigation
  const preSelectedProject = location.state?.selectedProjectId || null;
  const preSelectedProjectTitle = location.state?.selectedProjectTitle || null;

  useEffect(() => {
    // If we have a pre-selected project, automatically scroll to donation section
    if (preSelectedProject) {
      setShouldScrollToDonation(true);
      setTimeout(() => {
        donationRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500); // Longer delay to ensure components are loaded
    }
  }, [preSelectedProject]);

  const handleDonateClick = () => {
    setShouldScrollToDonation(true);
    setTimeout(() => {
      donationRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleJoinSponsorClick = () => {
    setShouldScrollToSponsor(true);
    setTimeout(() => {
      sponsorRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen font-inter overflow-x-hidden pt-16">
      <Navigation />
      <SponsorshipHero onDonateClick={handleDonateClick} onJoinSponsorClick={handleJoinSponsorClick} />
      <div ref={donationRef}>
        <DonationSection 
          shouldAutoOpen={shouldScrollToDonation} 
          preSelectedProjectId={preSelectedProject}
          preSelectedProjectTitle={preSelectedProjectTitle}
        />
      </div>
      <RecentDonors />
      <div ref={sponsorRef}>
        <BoardMemberSection shouldAutoOpen={shouldScrollToSponsor} />
      </div>
      <BenefitsSection />
      <EnhancedImpactSection />
      <DownloadReportSection />
      <ViewImpactSection />
      <SponsorshipCTA onDonateClick={handleDonateClick} onJoinSponsorClick={handleJoinSponsorClick} />
      <Footer />
      <Toaster />
    </div>
  );
};

export default Sponsorship;
