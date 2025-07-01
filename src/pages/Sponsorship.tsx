
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SponsorshipHero from "@/components/sponsorship/SponsorshipHero";
import DonationSection from "@/components/sponsorship/DonationSection";
import RecentDonors from "@/components/sponsorship/RecentDonors";
import BoardMemberSection from "@/components/sponsorship/BoardMemberSection";
import BenefitsSection from "@/components/sponsorship/BenefitsSection";
import ImpactSection from "@/components/sponsorship/ImpactSection";
import SponsorshipCTA from "@/components/sponsorship/SponsorshipCTA";
import { Toaster } from "@/components/ui/toaster";
import { useState, useRef } from "react";

const Sponsorship = () => {
  const [shouldScrollToDonation, setShouldScrollToDonation] = useState(false);
  const [shouldScrollToBoard, setShouldScrollToBoard] = useState(false);
  const donationRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const handleDonateClick = () => {
    setShouldScrollToDonation(true);
    setTimeout(() => {
      donationRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleJoinBoardClick = () => {
    setShouldScrollToBoard(true);
    setTimeout(() => {
      boardRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen font-inter overflow-x-hidden">
      <Navigation />
      <SponsorshipHero onDonateClick={handleDonateClick} onJoinBoardClick={handleJoinBoardClick} />
      <div ref={donationRef}>
        <DonationSection shouldAutoOpen={shouldScrollToDonation} />
      </div>
      <RecentDonors />
      <div ref={boardRef}>
        <BoardMemberSection shouldAutoOpen={shouldScrollToBoard} />
      </div>
      <BenefitsSection />
      <ImpactSection />
      <SponsorshipCTA onDonateClick={handleDonateClick} onJoinBoardClick={handleJoinBoardClick} />
      <Footer />
      <Toaster />
    </div>
  );
};

export default Sponsorship;
