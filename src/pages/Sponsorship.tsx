import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Church, Heart, Users, Bus, Globe, Shield, Quote } from "lucide-react";
import { useState } from "react";

const Sponsorship = () => {
  const [showBoardAmount, setShowBoardAmount] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  
  const countries = [
    { name: "Nigeria", currency: "NGN (₦)" },
    { name: "United States", currency: "USD ($)" },
    { name: "United Kingdom", currency: "GBP (£)" },
    { name: "Canada", currency: "CAD ($)" },
    { name: "Germany", currency: "EUR (€)" },
    { name: "France", currency: "EUR (€)" },
    { name: "South Africa", currency: "ZAR (R)" },
    { name: "Ghana", currency: "GHS (₵)" },
    { name: "Kenya", currency: "KES (KSh)" },
    { name: "Other", currency: "Multiple currencies available" }
  ];

  const boardMembers = [
    { name: "Coming Soon", role: "Be the first board member", amount: "Founding Member" },
  ];

  const benefits = [
    {
      icon: <Heart className="h-8 w-8 text-brand-teal" />,
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
      icon: <Shield className="h-8 w-8 text-brand-teal" />,
      title: "Safe & Reliable Service",
      description: "Your donations ensure we maintain the highest safety standards and provide reliable transportation for all church members."
    }
  ];

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    const selectedCountryData = countries.find(c => c.name === country);
    setSelectedCurrency(selectedCountryData?.currency || "");
  };

  return (
    <div className="min-h-screen font-inter">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <img 
              src="/lovable-uploads/7eae2d36-486c-4f8e-aa01-ca9414ab4528.png" 
              alt="Gospool Logo" 
              className="w-16 h-16 dark:hidden"
            />
            <img 
              src="/lovable-uploads/2ddb1688-61b9-4b51-b259-c1f342934418.png" 
              alt="Gospool Logo" 
              className="w-16 h-16 hidden dark:block"
            />
          </div>
          <h1 className="font-playfair text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Support Gospool's Mission
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Help us create a world where no one misses church due to transportation barriers. 
            Your contribution powers free rides, connects communities, and strengthens faith.
          </p>
          
          {/* Bible Verse about Supporting Gospel Workers */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-lg max-w-3xl mx-auto mt-8">
            <Quote className="h-8 w-8 text-brand-teal mx-auto mb-4" />
            <p className="text-gray-700 dark:text-gray-300 italic text-lg mb-3">
              "But how can they call on him to save them unless they believe in him? And how can they believe in him if they have never heard about him? And how can they hear about him unless someone tells them? And how will anyone go and tell them without being sent? That is why the Scriptures say, 'How beautiful are the feet of messengers who bring good news!'"
            </p>
            <p className="text-brand-teal font-semibold">Romans 10:14-15</p>
          </div>
        </div>
      </section>

      {/* General Donation Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Make a Donation
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Every contribution, no matter the size, helps us provide free transportation and build stronger church communities.
            </p>
            
            {/* Bible Verse about Generous Giving */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-6 rounded-lg max-w-2xl mx-auto mb-8">
              <Quote className="h-6 w-6 text-brand-green mx-auto mb-3" />
              <p className="text-gray-700 dark:text-gray-300 italic mb-2">
                "Remember this—a farmer who plants only a few seeds will get a small crop. But the one who plants generously will get a generous crop. For God loves a person who gives cheerfully."
              </p>
              <p className="text-brand-green font-semibold text-sm">2 Corinthians 9:6-8</p>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-gray-900 dark:text-white">Support Our Mission</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Select your country and contribute any amount to sponsor Gospool's development
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Your Country
                    </label>
                    <Select onValueChange={handleCountryChange}>
                      <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Choose your country" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        {countries.map((country) => (
                          <SelectItem key={country.name} value={country.name} className="dark:text-white dark:focus:bg-gray-600">
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedCountry && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Currency for {selectedCountry}:</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedCurrency}</p>
                    </div>
                  )}
                </div>
                
                <Button 
                  className="w-full bg-brand-blue hover:bg-blue-600 text-white py-4 text-lg"
                  disabled={!selectedCountry}
                >
                  Donate Now
                </Button>
                
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Secure payments powered by trusted payment processors
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Become a Board Member Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Board of Sponsors
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Join our exclusive board of visionary sponsors who are making a transformational impact on church communities across Nigeria and beyond.
            </p>
            
            {/* Bible Verse about Supporting Gospel Workers */}
            <div className="bg-white p-6 rounded-lg max-w-2xl mx-auto">
              <Quote className="h-6 w-6 text-brand-purple mx-auto mb-3" />
              <p className="text-gray-700 italic mb-2">
                "In the same way, the Lord ordered that those who preach the Good News should be supported by those who benefit from it."
              </p>
              <p className="text-brand-purple font-semibold text-sm">1 Corinthians 9:14</p>
            </div>
          </div>
          
          {/* Become a Board Member */}
          <div className="max-w-3xl mx-auto mb-16">
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
                    <ul className="text-left space-y-2 text-gray-600 max-w-md mx-auto">
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
          </div>

          {/* Current Board Members */}
          <div className="max-w-3xl mx-auto">
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
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Your Impact & How We Use Funds
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Transparency is core to our mission. See exactly how your contribution creates lasting change in church communities.
            </p>
            
            {/* Bible Verse about Using Resources for God's Kingdom */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg max-w-3xl mx-auto">
              <Quote className="h-6 w-6 text-brand-purple mx-auto mb-3" />
              <p className="text-gray-700 italic mb-2">
                "Tell them to use their money to do good. They should be rich in good works and generous to those in need, always being ready to share with others."
              </p>
              <p className="text-brand-purple font-semibold text-sm">1 Timothy 6:18</p>
            </div>
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
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-green-50 mb-16">
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

          {/* Additional Bible Verses about Giving */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-lg">
              <Quote className="h-8 w-8 text-brand-blue mb-4" />
              <p className="text-gray-700 italic text-lg mb-3">
                "Honor the Lord with your wealth and with the best part of everything you produce."
              </p>
              <p className="text-brand-blue font-semibold">Proverbs 3:9-10</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-purple-50 p-8 rounded-lg">
              <Quote className="h-8 w-8 text-brand-green mb-4" />
              <p className="text-gray-700 italic text-lg mb-3">
                "We who are strong must be considerate of those who are sensitive about things like this. We must not just please ourselves."
              </p>
              <p className="text-brand-green font-semibold">Romans 15:1-2</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 dark:text-white mb-4">
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
            Join the mission to make church accessible for everyone through free, safe transportation.
          </p>
          
          {/* Bible Verse about Treasure in Heaven */}
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg max-w-2xl mx-auto mb-8">
            <Quote className="h-6 w-6 text-white mx-auto mb-3" />
            <p className="text-white italic mb-2">
              "Sell your possessions and give to the poor. This will store up treasure for you in heaven!"
            </p>
            <p className="text-blue-100 font-semibold text-sm">Luke 12:33-34</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-brand-blue hover:bg-gray-100 px-8 py-3 text-lg">
              Become a Board Member
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-blue px-8 py-3 text-lg">
              Donate to the Cause
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sponsorship;
