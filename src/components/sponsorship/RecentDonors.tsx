
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RecentDonors = () => {
  const recentDonors = [
    { name: "John Smith", amount: "₦50,000", date: "2024-12-28", isAnonymous: false },
    { name: "Anonymous", amount: "₦25,000", date: "2024-12-27", isAnonymous: true },
    { name: "Sarah Johnson", amount: "₦100,000", date: "2024-12-26", isAnonymous: false },
    { name: "Anonymous", amount: "₦75,000", date: "2024-12-25", isAnonymous: true },
    { name: "Michael Brown", amount: "₦30,000", date: "2024-12-24", isAnonymous: false },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-white via-brand-light-mint/10 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-brand-dark-teal/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="dark:bg-gray-800/80 dark:border-gray-700 rounded-3xl shadow-2xl border border-brand-light-mint/30">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl text-gray-900 dark:text-white mb-4 font-playfair">
              Recent Donors
            </CardTitle>
            <CardDescription className="text-xl text-gray-600 dark:text-gray-300 font-ibm-plex">
              Thank you to our generous supporters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDonors.map((donor, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-brand-light-mint/10 dark:from-gray-700 dark:to-gray-600 rounded-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-dark-teal rounded-full flex items-center justify-center text-white font-bold text-lg font-poppins shadow-lg">
                      {donor.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white font-poppins">{donor.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-ibm-plex">{donor.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-brand-primary dark:text-brand-mint font-poppins">{donor.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RecentDonors;
