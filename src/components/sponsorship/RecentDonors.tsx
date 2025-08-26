
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RecentDonors = () => {
  const recentDonors = [
    { name: "John Smith", amount: "₦50,000", date: "2024-12-28", isAnonymous: false },
    { name: "Anonymous", amount: "₦25,000", date: "2024-12-27", isAnonymous: true },
    { name: "Sarah Johnson", amount: "₦100,000", date: "2024-12-26", isAnonymous: false },
    { name: "Anonymous", amount: "₦75,000", date: "2024-12-25", isAnonymous: true },
    { name: "Michael Brown", amount: "₦30,000", date: "2024-12-24", isAnonymous: false },
    { name: "Grace Chapel", amount: "₦150,000", date: "2024-12-23", isAnonymous: false },
    { name: "David Wilson", amount: "₦45,000", date: "2024-12-22", isAnonymous: false },
    { name: "Anonymous", amount: "₦60,000", date: "2024-12-21", isAnonymous: true },
    { name: "Faith Community", amount: "₦200,000", date: "2024-12-20", isAnonymous: false },
    { name: "Mary Okafor", amount: "₦35,000", date: "2024-12-19", isAnonymous: false },
    { name: "Anonymous", amount: "₦80,000", date: "2024-12-18", isAnonymous: true },
    { name: "Peter Adebayo", amount: "₦40,000", date: "2024-12-17", isAnonymous: false },
    { name: "Hope Church", amount: "₦120,000", date: "2024-12-16", isAnonymous: false },
    { name: "Anonymous", amount: "₦55,000", date: "2024-12-15", isAnonymous: true },
    { name: "Ruth Ogbonna", amount: "₦65,000", date: "2024-12-14", isAnonymous: false },
    { name: "Samuel Eze", amount: "₦90,000", date: "2024-12-13", isAnonymous: false },
    { name: "Anonymous", amount: "₦70,000", date: "2024-12-12", isAnonymous: true },
    { name: "Victory Assembly", amount: "₦180,000", date: "2024-12-11", isAnonymous: false },
    { name: "James Uche", amount: "₦50,000", date: "2024-12-10", isAnonymous: false },
    { name: "Anonymous", amount: "₦95,000", date: "2024-12-09", isAnonymous: true },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-white via-brand-light-mint/10 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-brand-dark-teal/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="dark:bg-gray-800/80 dark:border-gray-700 rounded-3xl shadow-2xl border border-brand-light-mint/30">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl lg:text-3xl text-gray-900 dark:text-white mb-3 font-playfair">
              Recent Donors
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-300 font-ibm-plex">
              Thank you to our generous supporters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentDonors.map((donor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-brand-light-mint/10 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-brand-light-mint/20 dark:border-gray-600">
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-ibm-plex">
                      {new Date(donor.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-brand-primary dark:text-brand-mint font-poppins">{donor.amount}</p>
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
