import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Church, Heart, Users, Bus, Globe, Shield, TrendingUp } from "lucide-react";
import { useState } from "react";

const Sponsorship = () => {
  const [showBoardAmount, setShowBoardAmount] = useState(false);
  
  const packages = [
    {
      name: "Community Partner",
      price: "$500",
      period: "/month",
      features: [
        "Church logo in app",
        "Monthly usage analytics",
        "Priority customer support",
        "Community impact reports"
      ],
      popular: false
    },
    {
      name: "Faith Leader",
      price: "$1,200",
      period: "/month",
      features: [
        "Everything in Community Partner",
        "Custom church branding",
        "Event integration",
        "Advanced analytics dashboard",
        "Priority feature requests"
      ],
      popular: true
    },
    {
      name: "Regional Champion",
      price: "$2,500",
      period: "/month",
      features: [
        "Everything in Faith Leader",
        "Multi-church network support",
        "Custom church network support",
        "Custom integrations",
        "Dedicated account manager",
        "Beta feature access",
        "Annual strategy session"
      ],
      popular: false
    }
  ];

  const boardMembers = [
    { name: "Coming Soon", role: "Be the first board member", amount: "Founding Member" },
  ];

  const benefits = [
    {
      icon: <Heart className="h-8 w-8 text-brand-blue" />,
      title: "Transform Lives",
      description: "Your contribution directly impacts thousands of church members by removing transportation barriers and strengthening faith communities."
    },
    {
      icon: <Bus className="h-8 w-8 text-brand-green" />,
      title: "Free Transportation Fleet",
      description: "Funds help us purchase and maintain buses that provide completely free transportation to church services across Nigeria and beyond."
    },
    {
      icon: <Globe className="h-8 w-8 text-brand-purple" />,
      title: "Nationwide Expansion",
      description: "Support our mission to reach every church in Nigeria and expand to other countries, connecting millions of believers."
    },
    {
      icon: <Shield className="h-8 w-8 text-brand-blue" />,
      title: "Safe & Reliable Service",
      description: "Your donations ensure we maintain the highest safety standards and provide reliable transportation for all church members."
    }
  ];

  return (
    <div className="min-h-screen font-inter">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Church className="h-16 w-16 text-brand-blue mx-auto mb-6" />
          <h1 className="font-playfair text-5xl font-bold text-gray-900 mb-6">
            Support Gospool's Mission
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Help us create a world where no one misses church due to transportation barriers. 
            Your contribution powers free rides, connects communities, and strengthens faith.
          </p>
        </div>
      </section>

      {/* General Donation Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
              Make a Donation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every contribution, no matter the size, helps us provide free transportation and build stronger church communities.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-gray-900">Support Our Mission</CardTitle>
                <CardDescription className="text-gray-600">
                  Choose your currency and contribute any amount to sponsor Gospool's development
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Button className="bg-green-600 hover:bg-green-700 text-white py-4 text-lg">
                    Donate in Naira (₦)
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg">
                    Donate in USD ($)
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="border-gray-300 py-4 text-lg">
                    Donate in Euro (€)
                  </Button>
                  <Button variant="outline" className="border-gray-300 py-4 text-lg">
                    Other Currencies
                  </Button>
                </div>
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    Secure payments powered by trusted payment processors
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Board of Sponsors Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
              Board of Sponsors
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our exclusive board of visionary sponsors who are making a transformational impact on church communities across Nigeria and beyond.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Become a Board Member */}
            <Card className="border-2 border-brand-blue">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-brand-blue mb-2">
                  Become a Board Member
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Join our founding board of sponsors and shape the future of church transportation
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="space-y-4">
                  <div className="text-6xl">👑</div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-xl">Exclusive Benefits</h3>
                    <ul className="text-left space-y-2 text-gray-600">
                      <li>• Permanent recognition on our website and app</li>
                      <li>• Quarterly impact reports and updates</li>
                      <li>• Direct input on app features and expansion</li>
                      <li>• Exclusive board member certificate</li>
                      <li>• Annual appreciation event invitation</li>
                    </ul>
                  </div>
                </div>
                
                {!showBoardAmount ? (
                  <Button 
                    onClick={() => setShowBoardAmount(true)}
                    className="bg-brand-blue hover:bg-blue-600 text-white px-8 py-3"
                  >
                    Become a Board Member
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-brand-blue text-white p-4 rounded-lg">
                      <p className="text-2xl font-bold">₦5,000,000</p>
                      <p className="text-sm">Minimum contribution for board membership</p>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                      Join the Board Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Current Board Members */}
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900 mb-2">
                  Current Board Members
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Visionary leaders supporting our mission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {boardMembers.map((member, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.role}</p>
                        <p className="text-xs text-brand-blue">{member.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-brand-blue font-medium">Be among the first to join our board!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits & Fund Usage Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
              Your Impact & How We Use Funds
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparency is core to our mission. See exactly how your contribution creates lasting change in church communities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Fund Allocation */}
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-green-50">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-gray-900 mb-4">
                Fund Allocation Breakdown
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Every naira and dollar is invested strategically for maximum impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-brand-blue">40%</div>
                  <h4 className="font-semibold text-gray-900">App Development & Maintenance</h4>
                  <p className="text-sm text-gray-600">Continuous improvement, new features, security updates, and technical infrastructure</p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-brand-green">35%</div>
                  <h4 className="font-semibold text-gray-900">Free Transportation Fleet</h4>
                  <p className="text-sm text-gray-600">Purchasing, maintaining, and operating buses for completely free church transportation</p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-brand-purple">25%</div>
                  <h4 className="font-semibold text-gray-900">Marketing & Expansion</h4>
                  <p className="text-sm text-gray-600">Promoting the app to churches across Nigeria and expanding to other countries</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
              Choose Your Partnership Level
            </h2>
            <p className="text-xl text-gray-600">
              Flexible sponsorship options designed to fit churches of all sizes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card 
                key={index} 
                className={`relative ${pkg.popular ? 'border-brand-blue shadow-lg scale-105' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-brand-blue text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    <span className="text-4xl font-bold text-gray-900">{pkg.price}</span>
                    <span className="text-lg">{pkg.period}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-brand-green rounded-full mr-3"></div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      pkg.popular 
                        ? 'bg-brand-blue hover:bg-blue-600 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
              Making a Real Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how churches are already transforming their communities with Gospool
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-brand-blue mb-2">85%</div>
              <p className="text-gray-600">Increase in church attendance</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-brand-green mb-2">12K+</div>
              <p className="text-gray-600">Rides shared monthly</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-brand-purple mb-2">450+</div>
              <p className="text-gray-600">Partner churches</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-blue to-brand-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-4xl font-bold text-white mb-6">
            Ready to Transform Your Community?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of churches already using Gospool to build stronger, 
            more connected communities through shared transportation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-brand-blue hover:bg-gray-100 px-8 py-3 text-lg">
              Schedule a Demo
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-blue px-8 py-3 text-lg">
              Download Partnership Kit
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sponsorship;
