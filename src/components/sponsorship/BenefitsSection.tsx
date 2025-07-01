
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Bus, Globe, Shield, Quote } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Heart className="h-8 w-8 text-brand-mint" />,
      title: "Transform Lives",
      description: "Your contribution directly impacts thousands of church members by removing transportation barriers and strengthening faith communities.",
      gradient: "from-brand-mint to-brand-light-mint"
    },
    {
      icon: <Bus className="h-8 w-8 text-brand-primary" />,
      title: "Free Transportation Fleet",
      description: "Funds help us purchase and maintain buses that provide completely free transportation to church services across Nigeria and beyond.",
      gradient: "from-brand-primary to-brand-dark-teal"
    },
    {
      icon: <Globe className="h-8 w-8 text-brand-dark-teal" />,
      title: "Nationwide Expansion",
      description: "Support our mission to reach every church in Nigeria and expand to other countries, connecting millions of believers.",
      gradient: "from-brand-dark-teal to-brand-mint"
    },
    {
      icon: <Shield className="h-8 w-8 text-brand-mint" />,
      title: "Safe & Reliable Service",
      description: "Your donations ensure we maintain the highest safety standards and provide reliable transportation for all church members.",
      gradient: "from-brand-light-mint to-brand-primary"
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Impact & How We Use Funds
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 font-ibm-plex">
            Transparency is core to our mission. See exactly how your contribution creates lasting change in church communities.
          </p>
          
          {/* Bible Verse about Using Resources for God's Kingdom */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg max-w-3xl mx-auto border border-brand-light-mint/30 dark:border-brand-mint/30">
            <Quote className="h-6 w-6 text-brand-purple mx-auto mb-3" />
            <p className="text-gray-700 dark:text-gray-300 italic mb-2 font-ibm-plex">
              "Tell them to use their money to do good. They should be rich in good works and generous to those in need, always being ready to share with others."
            </p>
            <p className="text-brand-purple font-semibold text-sm font-poppins">1 Timothy 6:18</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700 border border-brand-light-mint/30 dark:border-brand-mint/30">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-2 font-poppins">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-ibm-plex">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Fund Allocation */}
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700 mb-16 border border-brand-light-mint/30 dark:border-brand-mint/30">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-gray-900 dark:text-white mb-4 font-playfair">
              Fund Allocation Breakdown
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-300 font-ibm-plex">
              Every naira and dollar is invested strategically for maximum impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-brand-blue font-poppins">40%</div>
                <h4 className="font-semibold text-gray-900 dark:text-white font-poppins">App Development & Maintenance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-ibm-plex">Continuous improvement, new features, security updates, and technical infrastructure</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-brand-green font-poppins">35%</div>
                <h4 className="font-semibold text-gray-900 dark:text-white font-poppins">Free Transportation Fleet</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-ibm-plex">Purchasing, maintaining, and operating buses for completely free church transportation</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-brand-purple font-poppins">25%</div>
                <h4 className="font-semibold text-gray-900 dark:text-white font-poppins">Marketing & Expansion</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-ibm-plex">Promoting the app to churches across Nigeria and expanding to other countries</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Bible Verses about Giving */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-lg border border-brand-light-mint/30 dark:border-brand-mint/30">
            <Quote className="h-8 w-8 text-brand-blue mb-4" />
            <p className="text-gray-700 dark:text-gray-300 italic text-lg mb-3 font-ibm-plex">
              "Honor the Lord with your wealth and with the best part of everything you produce."
            </p>
            <p className="text-brand-blue font-semibold font-poppins">Proverbs 3:9-10</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-lg border border-brand-light-mint/30 dark:border-brand-mint/30">
            <Quote className="h-8 w-8 text-brand-green mb-4" />
            <p className="text-gray-700 dark:text-gray-300 italic text-lg mb-3 font-ibm-plex">
              "We who are strong must be considerate of those who are sensitive about things like this. We must not just please ourselves."
            </p>
            <p className="text-brand-green font-semibold font-poppins">Romans 15:1-2</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
