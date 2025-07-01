
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Bus, Globe, Shield } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Heart className="h-10 w-10 text-brand-mint" />,
      title: "Transform Lives",
      description: "Your contribution directly impacts thousands of church members by removing transportation barriers and strengthening faith communities.",
      gradient: "from-brand-mint to-brand-light-mint"
    },
    {
      icon: <Bus className="h-10 w-10 text-brand-primary" />,
      title: "Free Transportation Fleet",
      description: "Funds help us purchase and maintain buses that provide completely free transportation to church services across Nigeria and beyond.",
      gradient: "from-brand-primary to-brand-dark-teal"
    },
    {
      icon: <Globe className="h-10 w-10 text-brand-dark-teal" />,
      title: "Nationwide Expansion",
      description: "Support our mission to reach every church in Nigeria and expand to other countries, connecting millions of believers.",
      gradient: "from-brand-dark-teal to-brand-mint"
    },
    {
      icon: <Shield className="h-10 w-10 text-brand-mint" />,
      title: "Safe & Reliable Service",
      description: "Your donations ensure we maintain the highest safety standards and provide reliable transportation for all church members.",
      gradient: "from-brand-light-mint to-brand-primary"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-brand-light-mint/10 dark:from-gray-900 dark:via-gray-800 dark:to-brand-dark-teal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="font-playfair text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Your Impact & How We Use Funds
          </h2>
          <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-ibm-plex leading-relaxed">
            Transparency is core to our mission. See exactly how your contribution creates lasting change in church communities.
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
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-ibm-plex">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Fund Allocation */}
        <Card className="p-12 bg-gradient-to-br from-blue-50 via-green-50 to-brand-light-mint/20 dark:from-gray-800 dark:via-gray-700 dark:to-brand-dark-teal/20 border-2 border-brand-light-mint/30 dark:border-brand-mint/30 rounded-3xl shadow-2xl">
          <CardHeader className="text-center pb-12">
            <CardTitle className="text-4xl lg:text-5xl text-gray-900 dark:text-white mb-6 font-playfair">
              Fund Allocation Breakdown
            </CardTitle>
            <CardDescription className="text-xl text-gray-600 dark:text-gray-300 font-ibm-plex">
              Every naira and dollar is invested strategically for maximum impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4 p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl">
                <div className="text-5xl font-bold text-brand-blue font-poppins">40%</div>
                <h4 className="font-semibold text-xl text-gray-900 dark:text-white font-poppins">App Development & Maintenance</h4>
                <p className="text-lg text-gray-600 dark:text-gray-300 font-ibm-plex">Continuous improvement, new features, security updates, and technical infrastructure</p>
              </div>
              <div className="space-y-4 p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl">
                <div className="text-5xl font-bold text-brand-green font-poppins">35%</div>
                <h4 className="font-semibold text-xl text-gray-900 dark:text-white font-poppins">Free Transportation Fleet</h4>
                <p className="text-lg text-gray-600 dark:text-gray-300 font-ibm-plex">Purchasing, maintaining, and operating buses for completely free church transportation</p>
              </div>
              <div className="space-y-4 p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl">
                <div className="text-5xl font-bold text-brand-purple font-poppins">25%</div>
                <h4 className="font-semibold text-xl text-gray-900 dark:text-white font-poppins">Marketing & Expansion</h4>
                <p className="text-lg text-gray-600 dark:text-gray-300 font-ibm-plex">Promoting the app to churches across Nigeria and expanding to other countries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BenefitsSection;
