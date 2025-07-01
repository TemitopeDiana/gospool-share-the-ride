
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { useState } from "react";

const BoardMemberSection = () => {
  const [showBoardAmount, setShowBoardAmount] = useState(false);

  const boardMembers = [
    { name: "Coming Soon", role: "Be the first board member", amount: "Founding Member" },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Board of Sponsors
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 font-ibm-plex">
            Join our exclusive board of visionary sponsors who are making a transformational impact on church communities across Nigeria and beyond.
          </p>
          
          {/* Bible Verse about Supporting Gospel Workers */}
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg max-w-2xl mx-auto border border-brand-light-mint/30 dark:border-brand-mint/30">
            <Quote className="h-6 w-6 text-brand-purple mx-auto mb-3" />
            <p className="text-gray-700 dark:text-gray-300 italic mb-2 font-ibm-plex">
              "In the same way, the Lord ordered that those who preach the Good News should be supported by those who benefit from it."
            </p>
            <p className="text-brand-purple font-semibold text-sm font-poppins">1 Corinthians 9:14</p>
          </div>
        </div>
        
        {/* Become a Board Member */}
        <div className="max-w-3xl mx-auto mb-16">
          <Card className="border-2 border-brand-blue dark:bg-gray-700 dark:border-brand-mint">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-brand-blue dark:text-brand-mint mb-2 font-playfair">
                Become a Board Member
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-300 font-ibm-plex">
                Join our founding board of sponsors and shape the future of church transportation
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-4">
                <div className="text-6xl">👑</div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-xl text-gray-900 dark:text-white font-poppins">Exclusive Benefits</h3>
                  <ul className="text-left space-y-2 text-gray-600 dark:text-gray-300 max-w-md mx-auto font-ibm-plex">
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
                  className="bg-brand-blue hover:bg-blue-600 text-white px-8 py-3 font-poppins"
                >
                  Become a Board Member
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-brand-blue text-white p-4 rounded-lg">
                    <p className="text-2xl font-bold font-poppins">₦5,000,000</p>
                    <p className="text-sm font-ibm-plex">Minimum contribution for board membership</p>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 font-poppins">
                    Join the Board Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Current Board Members */}
        <div className="max-w-3xl mx-auto">
          <Card className="dark:bg-gray-700 dark:border-gray-600">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900 dark:text-white mb-2 font-playfair">
                Current Board Members
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 font-ibm-plex">
                Visionary leaders supporting our mission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {boardMembers.map((member, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                    <div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold font-poppins">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white font-poppins">{member.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-ibm-plex">{member.role}</p>
                      <p className="text-xs text-brand-blue dark:text-brand-mint font-ibm-plex">{member.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6 p-4 bg-blue-50 dark:bg-gray-600 rounded-lg">
                <p className="text-brand-blue dark:text-brand-mint font-medium font-poppins">Be among the first to join our board!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BoardMemberSection;
