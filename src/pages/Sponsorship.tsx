
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

const Sponsorship = () => {
  return (
    <div className="min-h-screen font-inter">
      <Navigation />
      <SponsorshipHero />
      <DonationSection />
      <RecentDonors />
      <BoardMemberSection />
      <BenefitsSection />
      <ImpactSection />
      <SponsorshipCTA />
      <Footer />
      <Toaster />
    </div>
  );
};

export default Sponsorship;
