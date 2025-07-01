
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Quote } from "lucide-react";
import { useState } from "react";

const DonationSection = () => {
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

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    const selectedCountryData = countries.find(c => c.name === country);
    setSelectedCurrency(selectedCountryData?.currency || "");
  };

  return (
    <section className="py-20 bg-gradient-to-br from-white via-brand-light-mint/10 to-white dark:from-gray-900 dark:via-brand-dark-teal/10 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl font-bold bg-gradient-to-r from-brand-primary to-brand-dark-teal dark:from-brand-mint dark:to-brand-light-mint bg-clip-text text-transparent mb-4">
            Make a Donation
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 font-ibm-plex">
            Every contribution, no matter the size, helps us provide free transportation and build stronger church communities.
          </p>
          
          {/* Bible Verse about Generous Giving */}
          <div className="bg-gradient-to-r from-brand-light-mint/20 to-brand-mint/20 dark:from-brand-dark-teal/20 dark:to-brand-mint/20 p-6 rounded-xl max-w-2xl mx-auto mb-8 border border-brand-light-mint/50 dark:border-brand-mint/30 shadow-lg">
            <Quote className="h-6 w-6 text-brand-mint dark:text-brand-light-mint mx-auto mb-3" />
            <p className="text-gray-700 dark:text-gray-300 italic mb-2 font-ibm-plex">
              "Remember this—a farmer who plants only a few seeds will get a small crop. But the one who plants generously will get a generous crop. For God loves a person who gives cheerfully."
            </p>
            <p className="text-brand-mint dark:text-brand-light-mint font-semibold text-sm font-poppins">2 Corinthians 9:6-8</p>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 dark:bg-gray-800/80 dark:border-gray-700 backdrop-blur-sm border border-brand-light-mint/30 dark:border-brand-mint/30 shadow-xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-gray-900 dark:text-white font-poppins">Support Our Mission</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 font-ibm-plex">
                Select your country and contribute any amount to sponsor Gospool's development
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                    Select Your Country
                  </label>
                  <Select onValueChange={handleCountryChange}>
                    <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white border-brand-light-mint/50 focus:border-brand-mint">
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
                  <div className="bg-gradient-to-r from-brand-light-mint/20 to-brand-mint/20 dark:bg-gray-700 p-4 rounded-lg border border-brand-light-mint/50">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-ibm-plex">Currency for {selectedCountry}:</p>
                    <p className="font-semibold text-gray-900 dark:text-white font-poppins">{selectedCurrency}</p>
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-brand-primary to-brand-dark-teal hover:from-brand-dark-teal hover:to-brand-mint text-white py-4 text-lg font-poppins shadow-lg transform hover:scale-105 transition-all duration-300"
                disabled={!selectedCountry}
              >
                Donate Now
              </Button>
              
              <div className="text-center pt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-ibm-plex">
                  Secure payments powered by trusted payment processors
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;
