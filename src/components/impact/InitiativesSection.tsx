
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const InitiativesSection = () => {
  const initiatives = [
    {
      title: "Faith & Community Fellowship",
      description: "Creating opportunities for believers to connect, share, and grow together in faith.",
      impact: "Building stronger church communities",
      status: "Ongoing"
    },
    {
      title: "Accessibility for All",
      description: "Ensuring that physical limitations or transportation challenges don't prevent church attendance.",
      impact: "Removing barriers to worship",
      status: "Active"
    },
    {
      title: "Youth Engagement Program",
      description: "Encouraging young people to actively participate in church activities through improved accessibility.",
      impact: "Engaging next generation",
      status: "Planning"
    },
    {
      title: "Elder Care Support",
      description: "Providing reliable transportation solutions for elderly church members and those with mobility challenges.",
      impact: "Supporting vulnerable members",
      status: "Active"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-brand-primary to-brand-mint dark:from-brand-mint dark:to-brand-light-mint bg-clip-text text-transparent mb-3 sm:mb-4">
            Our Initiatives
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-ibm-plex leading-relaxed">
            Comprehensive programs designed to strengthen faith communities and make worship accessible to everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {initiatives.map((initiative, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 dark:bg-gray-800/80 dark:border-gray-700 border border-brand-light-mint/30">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white font-playfair">{initiative.title}</CardTitle>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    initiative.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    initiative.status === 'Ongoing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {initiative.status}
                  </span>
                </div>
                <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-ibm-plex leading-relaxed mb-3">
                  {initiative.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-brand-light-mint/20 to-brand-mint/10 dark:bg-gray-700/50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-brand-primary dark:text-brand-mint font-poppins">
                    Impact: {initiative.impact}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InitiativesSection;
