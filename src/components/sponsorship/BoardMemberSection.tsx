
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const BoardMemberSection = () => {
  const [showBoardAmount, setShowBoardAmount] = useState(false);

  const boardMembers = [
    { name: "Coming Soon", role: "Be the first board member", amount: "Founding Member" },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-brand-light-mint/20 via-white to-gray-50 dark:from-brand-dark-teal/20 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="font-playfair text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Board of Sponsors
          </h2>
          <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-ibm-plex leading-relaxed">
            Join our exclusive board of visionary sponsors who are making a transformational impact on church communities across Nigeria and beyond.
          </p>
        </div>
        
        {/* Become a Board Member */}
        <div className="max-w-4xl mx-auto mb-20">
          <Card className="border-3 border-brand-blue dark:bg-gray-800/80 dark:border-brand-mint rounded-3xl shadow-2xl p-4">
            <CardHeader className="text-center pb-8">
              <div className="text-8xl mb-4">👑</div>
              <CardTitle className="text-4xl text-brand-blue dark:text-brand-mint mb-4 font-playfair">
                Become a Board Member
              </CardTitle>
              <CardDescription className="text-xl text-gray-600 dark:text-gray-300 font-ibm-plex">
                Join our founding board of sponsors and shape the future of church transportation
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-2xl text-gray-900 dark:text-white font-poppins">Exclusive Benefits</h3>
                  <ul className="text-left space-y-3 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-ibm-plex">
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-brand-mint rounded-full"></div>
                      <span>Permanent recognition on our website and app</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-brand-mint rounded-full"></div>
                      <span>Quarterly impact reports and updates</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-brand-mint rounded-full"></div>
                      <span>Direct input on app features and expansion</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-brand-mint rounded-full"></div>
                      <span>Exclusive board member certificate</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-brand-mint rounded-full"></div>
                      <span>Annual appreciation event invitation</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {!showBoardAmount ? (
                <Button 
                  onClick={() => setShowBoardAmount(true)}
                  className="bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-brand-blue text-white px-12 py-4 text-xl font-poppins font-semibold rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Become a Board Member
                </Button>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-brand-blue to-blue-600 text-white p-8 rounded-2xl shadow-xl">
                    <p className="text-4xl font-bold font-poppins mb-2">₦5,000,000</p>
                    <p className="text-lg font-ibm-plex">Minimum contribution for board membership</p>
                  </div>
                  <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-600 text-white px-12 py-4 text-xl font-poppins font-semibold rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
                    Join the Board Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Current Board Members */}
        <div className="max-w-4xl mx-auto">
          <Card className="dark:bg-gray-800/80 dark:border-gray-700 rounded-3xl shadow-2xl border border-brand-light-mint/30">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl text-gray-900 dark:text-white mb-4 font-playfair">
                Current Board Members
              </CardTitle>
              <CardDescription className="text-xl text-gray-600 dark:text-gray-300 font-ibm-plex">
                Visionary leaders supporting our mission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {boardMembers.map((member, index) => (
                  <div key={index} className="flex items-center space-x-6 p-6 bg-gradient-to-r from-gray-50 to-brand-light-mint/10 dark:from-gray-700 dark:to-gray-600 rounded-2xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl font-poppins shadow-lg">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xl text-gray-900 dark:text-white font-poppins">{member.name}</h4>
                      <p className="text-lg text-gray-600 dark:text-gray-300 font-ibm-plex">{member.role}</p>
                      <p className="text-sm text-brand-blue dark:text-brand-mint font-ibm-plex font-medium">{member.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8 p-6 bg-gradient-to-r from-blue-50 to-brand-light-mint/20 dark:from-gray-700 dark:to-gray-600 rounded-2xl">
                <p className="text-brand-blue dark:text-brand-mint font-medium text-xl font-poppins">Be among the first to join our board!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BoardMemberSection;
