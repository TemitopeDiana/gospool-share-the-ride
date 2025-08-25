
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ProjectsSection = () => {
  const projects = [
    {
      title: "Free Church Transportation Network",
      description: "Connecting church members with reliable, free transportation to worship services across major cities.",
      image: "/images/Logo mark v2 dark.png",
      stats: "500+ rides provided",
      status: "Active"
    },
    {
      title: "Community Outreach Programs",
      description: "Supporting local churches in their community service initiatives and outreach programs.",
      image: "/images/Logo mark v2 dark.png",
      stats: "12 communities served",
      status: "Expanding"
    },
    {
      title: "Digital Faith Platform",
      description: "Building technology solutions that strengthen faith communities and improve accessibility.",
      image: "/images/Logo mark v2 dark.png",
      stats: "In Development",
      status: "Coming Soon"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-brand-primary to-brand-mint dark:from-brand-mint dark:to-brand-light-mint bg-clip-text text-transparent mb-3 sm:mb-4">
            Our Projects
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-ibm-plex leading-relaxed">
            Transforming communities through innovative solutions and faithful service.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 dark:bg-gray-800/80 dark:border-gray-700 border border-brand-light-mint/30">
              <div className="aspect-video bg-gradient-to-br from-brand-light-mint/20 to-brand-mint/10 flex items-center justify-center p-4">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white font-playfair">{project.title}</CardTitle>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    project.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    project.status === 'Expanding' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-ibm-plex leading-relaxed">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-brand-light-mint/20 to-brand-mint/10 dark:bg-gray-700/50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-brand-primary dark:text-brand-mint font-poppins">{project.stats}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
