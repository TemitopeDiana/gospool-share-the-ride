
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, Bus, Globe, Shield } from "lucide-react";
import { useState } from "react";
import PitchDeckForm from "./PitchDeckForm";

const BenefitsSection = () => {
  const [showPitchDeckForm, setShowPitchDeckForm] = useState(false);

  const benefits = [
    {
      icon: <Heart className="h-10 w-10 text-brand-mint" />,
      title: "Transform Lives",
      description: "Your contribution directly impacts thousands of church members by removing transportation barriers and strengthening Christian communities.",
      gradient: "from-brand-mint to-brand-light-mint"
    },
    {
      icon: <Bus className="h-10 w-10 text-brand-primary" />,
      title: "Provide Transportation Fleet",
      description: "Funds help us provide buses for church services, church events, and Christian conferences and gatherings across Nigeria and beyond, ensuring no one misses worship due to transportation challenges.",
      gradient: "from-brand-primary to-brand-dark-teal"
    },
    {
      icon: <Globe className="h-10 w-10 text-brand-dark-teal" />,
      title: "Nationwide Expansion",
      description: "Support our mission to reach every church in Nigeria and expand to other countries, connecting millions of believers and strengthening the global Christian community.",
      gradient: "from-brand-dark-teal to-brand-mint"
    },
    {
      icon: <Shield className="h-10 w-10 text-brand-mint" />,
      title: "Platform Development & Incentives",
      description: "Your donations ensure continuous platform development, maintenance, and occasional fuel allowances and free servicing for car owners to encourage ride sharing within Christian communities.",
      gradient: "from-brand-light-mint to-brand-primary"
    }
  ];

  return (
    <>
      <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-brand-light-mint/10 dark:from-gray-900 dark:via-gray-800 dark:to-brand-dark-teal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-playfair text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Your Impact & How We Use Funds
            </h2>
            <p className="text-2xl text-gray-800 dark:text-gray-200 max-w-4xl mx-auto font-ibm-plex leading-relaxed">
              Transparency is core to our mission. See how your contribution will create lasting change in Christian communities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-8 hover:shadow-2xl transition-all duration-300 dark:bg-gray-800/80 dark:border-gray-700 border-2 border-brand-light-mint/30 dark:border-brand-mint/30 rounded-3xl transform hover:scale-105">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 p-4 bg-gradient-to-br from-brand-light-mint/20 to-brand-mint/10 rounded-2xl">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-2xl text-gray-900 dark:text-white mb-4 font-poppins">
                      {benefit.title}
                    </h3>
                    <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed font-ibm-plex">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Fund Allocation */}
          <Card className="p-12 bg-gradient-to-br from-brand-light-mint/30 via-white to-brand-mint/20 dark:from-gray-800 dark:via-gray-700 dark:to-brand-dark-teal/20 border-2 border-brand-light-mint/30 dark:border-brand-mint/30 rounded-3xl shadow-2xl">
            <CardHeader className="text-center pb-12">
              <CardTitle className="text-4xl lg:text-5xl text-gray-900 dark:text-white mb-6 font-playfair">
                Fund Allocation Breakdown
              </CardTitle>
              <CardDescription className="text-xl text-gray-800 dark:text-gray-200 font-ibm-plex">
                Every amount received is invested strategically for maximum impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8 text-center mb-8">
                <div className="space-y-4 p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl">
                  <div className="text-5xl font-bold text-brand-primary dark:text-brand-mint font-poppins">30%</div>
                  <h4 className="font-semibold text-xl text-gray-900 dark:text-white font-poppins">Platform Development & Maintenance</h4>
                  <p className="text-lg text-gray-800 dark:text-gray-200 font-ibm-plex">Continuous improvement, new features, security updates, platform sustenance and technical infrastructure</p>
                </div>
                <div className="space-y-4 p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl">
                  <div className="text-5xl font-bold text-brand-dark-teal dark:text-brand-light-mint font-poppins">40%</div>
                  <h4 className="font-semibold text-xl text-gray-900 dark:text-white font-poppins">Transportation Fleet & Services</h4>
                  <p className="text-lg text-gray-800 dark:text-gray-200 font-ibm-plex">Providing buses for church services, events, conferences, and possible fuel allowances and car servicing to encourage ride sharing</p>
                </div>
                <div className="space-y-4 p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl">
                  <div className="text-5xl font-bold text-brand-mint dark:text-brand-light-mint font-poppins">30%</div>
                  <h4 className="font-semibold text-xl text-gray-900 dark:text-white font-poppins">Marketing & Expansion</h4>
                  <p className="text-lg text-gray-800 dark:text-gray-200 font-ibm-plex">Promoting the platform and its benefits to churches across Nigeria and expanding to other countries</p>
                </div>
              </div>
              
              <div className="text-center">
                <Button
                  onClick={() => setShowPitchDeckForm(true)}
                  className="bg-gradient-to-r from-brand-primary to-brand-dark-teal text-white px-8 py-4 text-lg font-poppins font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Read Current & Future Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {showPitchDeckForm && (
        <PitchDeckForm onClose={() => setShowPitchDeckForm(false)} />
      )}
    </>
  );
};

export default BenefitsSection;
