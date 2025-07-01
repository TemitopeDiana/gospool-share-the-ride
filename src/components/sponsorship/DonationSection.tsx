
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
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-brand-light-mint/10 dark:from-gray-900 dark:via-gray-800 dark:to-brand-dark-teal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="font-playfair text-5xl lg:text-6xl font-bold bg-gradient-to-r from-brand-primary to-brand-mint dark:from-brand-mint dark:to-brand-light-mint bg-clip-text text-transparent mb-6">
            Make a Donation
          </h2>
          <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-ibm-plex leading-relaxed">
            Every contribution, no matter the size, helps us provide free transportation and build stronger church communities.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Card className="p-10 dark:bg-gray-800/80 dark:border-gray-700 backdrop-blur-lg border border-brand-light-mint/30 dark:border-brand-mint/30 shadow-2xl rounded-3xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl text-gray-900 dark:text-white font-playfair mb-2">Support Our Mission</CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-400 font-ibm-plex">
                Select your country and contribute any amount to sponsor Gospool's development
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3 font-poppins">
                    Select Your Country
                  </label>
                  <Select onValueChange={handleCountryChange}>
                    <SelectTrigger className="w-full h-14 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-2xl text-lg">
                      <SelectValue placeholder="Choose your country" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600 rounded-2xl">
                      {countries.map((country) => (
                        <SelectItem key={country.name} value={country.name} className="dark:text-white dark:focus:bg-gray-600 text-lg py-3">
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedCountry && (
                  <div className="bg-gradient-to-r from-brand-light-mint/30 to-brand-mint/20 dark:bg-gradient-to-r dark:from-gray-700 dark:to-gray-600 p-6 rounded-2xl border border-brand-light-mint/50">
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-2 font-ibm-plex">Currency for {selectedCountry}:</p>
                    <p className="font-bold text-xl text-gray-900 dark:text-white font-poppins">{selectedCurrency}</p>
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-brand-primary to-brand-dark-teal hover:from-brand-dark-teal hover:to-brand-mint text-white py-6 text-xl font-poppins font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl"
                disabled={!selectedCountry}
              >
                Donate Now
              </Button>
              
              <div className="text-center pt-6">
                <p className="text-lg text-gray-500 dark:text-gray-400 font-ibm-plex">
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
