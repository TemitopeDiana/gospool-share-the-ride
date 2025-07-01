
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const NewsSection = () => {
  const news = [
    {
      title: "Gospool Launches in Lagos",
      date: "March 2024",
      summary: "Successfully launched our free church transportation service in Lagos, connecting over 50 church communities.",
      category: "Launch"
    },
    {
      title: "Partnership with Local Churches",
      date: "February 2024",
      summary: "Established partnerships with 25+ churches across Nigeria to expand our reach and impact.",
      category: "Partnership"
    },
    {
      title: "Community Impact Recognition",
      date: "January 2024",
      summary: "Received recognition from local community leaders for our contribution to spiritual accessibility.",
      category: "Recognition"
    },
    {
      title: "Technology Innovation Award",
      date: "December 2023",
      summary: "Honored for innovative use of technology in solving transportation challenges for faith communities.",
      category: "Award"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-brand-light-mint/10 dark:from-gray-900 dark:via-gray-800 dark:to-brand-dark-teal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-brand-primary to-brand-mint dark:from-brand-mint dark:to-brand-light-mint bg-clip-text text-transparent mb-3 sm:mb-4">
            Latest News
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-ibm-plex leading-relaxed">
            Stay updated with our latest achievements, partnerships, and community impact stories.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {news.map((item, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 dark:bg-gray-800/80 dark:border-gray-700 border border-brand-light-mint/30">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    item.category === 'Launch' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    item.category === 'Partnership' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    item.category === 'Recognition' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-ibm-plex">{item.date}</span>
                </div>
                <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white font-playfair">{item.title}</CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-ibm-plex leading-relaxed">
                  {item.summary}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
