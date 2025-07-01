
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SponsorshipHero from "@/components/sponsorship/SponsorshipHero";
import DonationSection from "@/components/sponsorship/DonationSection";
import BoardMemberSection from "@/components/sponsorship/BoardMemberSection";
import BenefitsSection from "@/components/sponsorship/BenefitsSection";
import ImpactSection from "@/components/sponsorship/ImpactSection";
import SponsorshipCTA from "@/components/sponsorship/SponsorshipCTA";

const Sponsorship = () => {
  return (
    <div className="min-h-screen font-inter">
      <Navigation />
      <SponsorshipHero />
      <DonationSection />
      <BoardMemberSection />
      <BenefitsSection />
      <ImpactSection />
      <SponsorshipCTA />
      <Footer />
    </div>
  );
};

export default Sponsorship;
