import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, MapPin, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useNavigate } from "react-router-dom";

const ProjectsSection = () => {
  const { toast } = useToast();
  const { trackContentEngagement, trackDonationFunnel } = useAnalytics();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Fetch projects from database
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Separate completed and ongoing projects
  const completedProjects = projects.filter(project => 
    project.status === 'completed' || project.progress_percentage === 100
  );
  
  const ongoingProjects = projects.filter(project => 
    project.status !== 'completed' && project.progress_percentage !== 100
  );

  const handleDonate = (projectId: string, projectTitle: string) => {
    // Track project donation interest
    trackContentEngagement('project', projectId, 'clicked');

    trackDonationFunnel('initiated', undefined, {
      source: 'project_page',
      project_id: projectId,
      project_title: projectTitle,
    });

    // Navigate to sponsorship page with project pre-selected
    navigate('/sponsorship', { 
      state: { 
        selectedProjectId: projectId,
        selectedProjectTitle: projectTitle 
      } 
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "TBD";
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const ProjectCard = ({ project, isOngoing = false }: { project: any, isOngoing?: boolean }) => (
    <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 dark:bg-gray-800/80 dark:border-gray-700 border ${
      isOngoing ? 'border-brand-mint/50' : 'border-brand-light-mint/30'
    }`}>
      <div className="aspect-video bg-gradient-to-br from-brand-light-mint/20 to-brand-mint/10 flex items-center justify-center p-4 relative overflow-hidden">
        {project.image_url ? (
          <img 
            src={project.image_url.startsWith('http') ? project.image_url : `/${project.image_url.replace(/^\//, '')}`}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={e => { e.currentTarget.src = '/images/Logo mark v2 dark.png'; }}
          />
        ) : (
          <img 
            src="/images/Logo mark v2 dark.png" 
            alt={project.title}
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
          />
        )}
        <div className="absolute top-3 right-3">
          <Badge variant={project.status === 'completed' ? 'default' : 'secondary'} className={`${
            project.status === 'completed' ? 'bg-green-500 text-white' :
            project.status === 'active' ? 'bg-blue-500 text-white' :
            project.status === 'planning' ? 'bg-yellow-500 text-white' :
            'bg-gray-500 text-white'
          }`}>
            {project.status || 'Active'}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white font-playfair">
          {project.title}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-ibm-plex leading-relaxed">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Project Stats */}
        <div className="grid grid-cols-2 gap-3">
          {project.location && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>{project.location}</span>
            </div>
          )}
          
          {project.budget && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Target className="h-4 w-4" />
              <span>{formatCurrency(project.budget)}</span>
            </div>
          )}
        </div>

        {/* Progress Section for Ongoing Projects */}
        {isOngoing && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progress
                </span>
                <span className="text-sm font-bold text-brand-primary dark:text-brand-mint">
                  {project.progress_percentage || 0}%
                </span>
              </div>
              <Progress value={project.progress_percentage || 0} className="h-2" />
            </div>

            {project.budget && (
              <div className="bg-gradient-to-r from-brand-light-mint/20 to-brand-mint/10 dark:bg-gray-700/50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Target Amount</span>
                  <span className="text-sm font-semibold text-brand-primary dark:text-brand-mint">
                    {formatCurrency(project.budget)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Raised So Far</span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(project.budget ? (project.budget * (project.progress_percentage || 0)) / 100 : 0)}
                  </span>
                </div>
              </div>
            )}

            <Button 
              onClick={() => handleDonate(project.id, project.title)}
              className="w-full bg-gradient-to-r from-brand-primary to-brand-dark-teal hover:from-brand-dark-teal hover:to-brand-primary text-white font-poppins font-semibold"
              size="sm"
            >
              Donate to This Project
            </Button>
          </>
        )}

        {/* Completion Info for Completed Projects */}
        {!isOngoing && (
          <div className="bg-gradient-to-r from-green-50 to-brand-light-mint/20 dark:from-green-900/20 dark:to-brand-dark-teal/20 p-3 rounded-lg">
            <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-semibold">Project Completed</span>
            </div>
            {project.budget && (
              <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                Total Investment: {formatCurrency(project.budget)}
              </p>
            )}
          </div>
        )}

        {/* Date Information */}
        {(project.start_date || project.end_date) && (
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
            <CalendarIcon className="h-3 w-3" />
            <span>
              {project.start_date && `Started: ${new Date(project.start_date).toLocaleDateString()}`}
              {project.start_date && project.end_date && ' | '}
              {project.end_date && `${project.status === 'completed' ? 'Completed' : 'Target'}: ${new Date(project.end_date).toLocaleDateString()}`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

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

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading projects...</p>
          </div>
        ) : (
          <>
            {/* Ongoing Projects Section */}
            {ongoingProjects.length > 0 && (
              <div className="mb-12 sm:mb-16">
                <div className="text-center mb-8">
                  <h3 className="font-playfair text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    Active Projects - Support Our Current Initiatives
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-ibm-plex">
                    These projects need your support to reach completion. Every donation brings us closer to our goals.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {ongoingProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} isOngoing={true} />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Projects Section */}
            {completedProjects.length > 0 && (
              <div>
                <div className="text-center mb-8">
                  <h3 className="font-playfair text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    Completed Projects - Our Impact Story
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-ibm-plex">
                    See the tangible results of our community's generous support and dedication.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {completedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} isOngoing={false} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {projects.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gradient-to-r from-brand-light-mint/20 to-brand-mint/10 dark:from-brand-dark-teal/20 dark:to-brand-mint/10 rounded-xl p-8">
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Projects Coming Soon
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-ibm-plex mb-6">
                    We're preparing exciting new projects to transform communities. Stay tuned!
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-brand-primary to-brand-dark-teal hover:from-brand-dark-teal hover:to-brand-primary text-white font-poppins font-semibold"
                    onClick={() => toast({
                      title: "Stay Updated",
                      description: "Follow our news section for project announcements!",
                    })}
                  >
                    Get Notified
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
