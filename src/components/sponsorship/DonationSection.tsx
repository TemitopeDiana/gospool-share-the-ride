
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import DonationForm from "./DonationForm";
import { useToast } from "@/hooks/use-toast";

interface DonationSectionProps {
  shouldAutoOpen?: boolean;
}

const DonationSection = ({ shouldAutoOpen }: DonationSectionProps) => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [showDonationForm, setShowDonationForm] = useState(false);
  const { toast } = useToast();
  
  const countries = [
    { name: "Nigeria", currency: "NGN (₦)", available: true },
    { name: "United States", currency: "USD ($)", available: false },
    { name: "United Kingdom", currency: "GBP (£)", available: false },
    { name: "Canada", currency: "CAD ($)", available: false },
    { name: "Germany", currency: "EUR (€)", available: false },
    { name: "France", currency: "EUR (€)", available: false },
    { name: "South Africa", currency: "ZAR (R)", available: false },
    { name: "Ghana", currency: "GHS (₵)", available: false },
    { name: "Kenya", currency: "KES (KSh)", available: false },
    { name: "Uganda", currency: "UGX (USh)", available: false },
    { name: "Tanzania", currency: "TZS (TSh)", available: false },
    { name: "Rwanda", currency: "RWF (Fr)", available: false },
    { name: "Ethiopia", currency: "ETB (Br)", available: false },
    { name: "Cameroon", currency: "XAF (Fr)", available: false },
    { name: "Ivory Coast", currency: "XOF (Fr)", available: false },
    { name: "Senegal", currency: "XOF (Fr)", available: false },
    { name: "Other", currency: "Multiple currencies available", available: false }
  ];

  useEffect(() => {
    if (shouldAutoOpen) {
      // Auto-select Nigeria as default when opened from hero
      setSelectedCountry("Nigeria");
      setSelectedCurrency("NGN (₦)");
    }
  }, [shouldAutoOpen]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    const selectedCountryData = countries.find(c => c.name === country);
    setSelectedCurrency(selectedCountryData?.currency || "");
  };

  const handleDonateClick = () => {
    if (!selectedCountry) {
      toast({
        title: "Country Required",
        description: "Please select your country before proceeding.",
        variant: "destructive",
      });
      return;
    }

    const selectedCountryData = countries.find(c => c.name === selectedCountry);
    if (!selectedCountryData?.available) {
      toast({
        title: "Coming Soon",
        description: "Payment processing for this country is coming soon. Only Nigeria is currently available.",
        variant: "destructive",
      });
      return;
    }

    setShowDonationForm(true);
  };

  if (showDonationForm) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-brand-light-mint/10 dark:from-gray-900 dark:via-gray-800 dark:to-brand-dark-teal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DonationForm
            selectedCountry={selectedCountry}
            selectedCurrency={selectedCurrency}
            onClose={() => setShowDonationForm(false)}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-brand-light-mint/10 dark:from-gray-900 dark:via-gray-800 dark:to-brand-dark-teal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-brand-primary to-brand-mint dark:from-brand-mint dark:to-brand-light-mint bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
            Make a Donation
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-800 dark:text-gray-200 max-w-3xl mx-auto font-ibm-plex leading-relaxed px-4">
            Every contribution, no matter the size, helps us provide free transportation and build stronger church communities.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Card className="p-4 sm:p-6 lg:p-8 dark:bg-gray-800/80 dark:border-gray-700 backdrop-blur-lg border border-brand-light-mint/30 dark:border-brand-mint/30 shadow-2xl rounded-xl sm:rounded-2xl mx-4 sm:mx-0">
            <CardHeader className="text-center pb-4 sm:pb-6">
              <CardTitle className="text-xl sm:text-2xl text-gray-900 dark:text-white font-playfair mb-2">Support Our Mission</CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-ibm-plex">
                Select your country and contribute any amount to sponsor Gospool's development
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                    Select Your Country *
                  </label>
                  <Select onValueChange={handleCountryChange} value={selectedCountry}>
                    <SelectTrigger className="w-full h-12 sm:h-14 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-sm sm:text-base touch-manipulation">
                      <SelectValue placeholder="Choose your country" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600 rounded-xl z-50">
                      {countries.map((country) => (
                        <SelectItem key={country.name} value={country.name} className="dark:text-white dark:focus:bg-gray-600 text-sm sm:text-base py-2 sm:py-3 touch-manipulation">
                          {country.name} {!country.available && "(Coming Soon)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedCountry && (
                  <div className="bg-gradient-to-r from-brand-light-mint/30 to-brand-mint/20 dark:bg-gradient-to-r dark:from-gray-700 dark:to-gray-600 p-3 sm:p-4 rounded-xl border border-brand-light-mint/50">
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-1 font-ibm-plex">Currency for {selectedCountry}:</p>
                    <p className="font-bold text-base sm:text-lg text-gray-900 dark:text-white font-poppins">{selectedCurrency}</p>
                    {!countries.find(c => c.name === selectedCountry)?.available && (
                      <p className="text-sm text-orange-600 dark:text-orange-400 mt-2 font-ibm-plex">Payment processing coming soon - Only Nigeria available now</p>
                    )}
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-brand-primary to-brand-dark-teal hover:from-brand-dark-teal hover:to-brand-mint text-white px-8 py-4 text-base sm:text-lg font-poppins font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 touch-manipulation"
                onClick={handleDonateClick}
              >
                Donate Now
              </Button>
              
              <div className="text-center pt-3 sm:pt-4">
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-ibm-plex">
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
