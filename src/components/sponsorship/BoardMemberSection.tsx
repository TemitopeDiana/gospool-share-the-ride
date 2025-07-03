
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import BoardMemberForm from "./BoardMemberForm";

interface BoardMemberSectionProps {
  shouldAutoOpen?: boolean;
}

const BoardMemberSection = ({ shouldAutoOpen }: BoardMemberSectionProps) => {
  const [showSponsorAmount, setShowSponsorAmount] = useState(false);
  const [showSponsorForm, setShowSponsorForm] = useState(false);

  const impactSponsors = [
    { name: "Coming Soon", role: "Be the first impact sponsor", amount: "Founding Sponsor" },
  ];

  useEffect(() => {
    if (shouldAutoOpen) {
      setShowSponsorAmount(true);
    }
  }, [shouldAutoOpen]);

  if (showSponsorForm) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-brand-light-mint/20 via-white to-gray-50 dark:from-brand-dark-teal/20 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BoardMemberForm onClose={() => setShowSponsorForm(false)} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-brand-light-mint/20 via-white to-gray-50 dark:from-brand-dark-teal/20 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
            Impact Sponsors
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-ibm-plex leading-relaxed px-4">
            Join our exclusive community of visionary impact sponsors making a transformational difference in Christian communities across Nigeria and beyond. Whether you're an individual, church, or organization, your partnership enables us to break down transportation barriers and strengthen faith communities.
          </p>
        </div>
        
        {/* Become an Impact Sponsor */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <Card className="border-3 border-brand-blue dark:bg-gray-800/80 dark:border-brand-mint rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 mx-4 sm:mx-0">
            <CardHeader className="text-center pb-4 sm:pb-6">
              <div className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-3">👑</div>
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-brand-blue dark:text-brand-mint mb-2 sm:mb-3 font-playfair px-2">
                Become an Impact Sponsor
              </CardTitle>
              <CardDescription className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 font-ibm-plex px-2">
                Join our founding community of impact sponsors and shape the future of church transportation. Individuals, churches, and organizations are all welcome to contribute and make a lasting impact.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="font-semibold text-lg sm:text-xl text-gray-900 dark:text-white font-poppins">Exclusive Benefits</h3>
                  <ul className="text-left space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-ibm-plex">
                    <li className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-2 h-2 bg-brand-mint rounded-full mt-2 flex-shrink-0"></div>
                      <span>Permanent recognition on our website</span>
                    </li>
                    <li className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-2 h-2 bg-brand-mint rounded-full mt-2 flex-shrink-0"></div>
                      <span>Biannual impact reports and updates</span>
                    </li>
                    <li className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-2 h-2 bg-brand-mint rounded-full mt-2 flex-shrink-0"></div>
                      <span>Direct input on app features and expansion</span>
                    </li>
                    <li className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-2 h-2 bg-brand-mint rounded-full mt-2 flex-shrink-0"></div>
                      <span>Exclusive impact sponsor certificate</span>
                    </li>
                    <li className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-2 h-2 bg-brand-mint rounded-full mt-2 flex-shrink-0"></div>
                      <span>Priority access to all features and offerings of the platform and many more</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {!showSponsorAmount ? (
                <Button 
                  onClick={() => setShowSponsorAmount(true)}
                  className="bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-brand-blue text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-poppins font-semibold rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto touch-manipulation"
                >
                  Become an Impact Sponsor
                </Button>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-gradient-to-r from-brand-blue to-blue-600 text-white p-4 sm:p-6 rounded-xl shadow-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="text-center">
                        <p className="text-lg sm:text-xl font-bold font-poppins">₦5,000,000</p>
                        <p className="text-xs sm:text-sm font-ibm-plex">Nigerian Naira</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg sm:text-xl font-bold font-poppins">$5,000</p>
                        <p className="text-xs sm:text-sm font-ibm-plex">US Dollar equivalent</p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm font-ibm-plex mt-2 text-center">Minimum contribution for impact sponsorship</p>
                  </div>
                  <Button 
                    onClick={() => setShowSponsorForm(true)}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-poppins font-semibold rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto touch-manipulation"
                  >
                    Become a Sponsor Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Current Impact Sponsors */}
        <div className="max-w-4xl mx-auto">
          <Card className="dark:bg-gray-800/80 dark:border-gray-700 rounded-xl sm:rounded-2xl shadow-2xl border border-brand-light-mint/30 mx-4 sm:mx-0">
            <CardHeader className="text-center pb-4 sm:pb-6">
              <CardTitle className="text-xl sm:text-2xl text-gray-900 dark:text-white mb-2 sm:mb-3 font-playfair px-2">
                Current Impact Sponsors
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-ibm-plex px-2">
                Visionary leaders supporting our mission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {impactSponsors.map((sponsor, index) => (
                  <div key={index} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-brand-light-mint/10 dark:from-gray-700 dark:to-gray-600 rounded-xl">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-brand-blue to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg font-poppins shadow-lg flex-shrink-0">
                      {sponsor.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white font-poppins truncate">{sponsor.name}</h4>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-ibm-plex">{sponsor.role}</p>
                      <p className="text-xs sm:text-sm text-brand-blue dark:text-brand-mint font-ibm-plex font-medium">{sponsor.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-brand-light-mint/20 dark:from-gray-700 dark:to-gray-600 rounded-xl">
                <p className="text-brand-blue dark:text-brand-mint font-medium text-base sm:text-lg font-poppins">Be among the first to become an impact sponsor!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BoardMemberSection;
