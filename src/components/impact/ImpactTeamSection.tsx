
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-react";

const ImpactTeamSection = () => {
  const { data: teamMembers = [], isLoading: teamLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: boardAdvisors = [], isLoading: advisorsLoading } = useQuery({
    queryKey: ['board-advisors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('board_advisors')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  const renderTeamMember = (member: any, index: number) => (
    <Card key={`${member.id}-${index}`} className="hover:shadow-xl transition-all duration-300 dark:bg-gray-800/80 dark:border-gray-700 border border-brand-light-mint/30">
      <CardHeader className="text-center pb-3">
        <div className="flex justify-center mb-4">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
            <AvatarImage src={member.image_url} alt={member.name} />
            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-brand-primary to-brand-mint text-white">
              {member.name.split(' ').map((n: string) => n.charAt(0)).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white font-playfair mb-1">
          {member.name}
        </CardTitle>
        <CardDescription className="text-sm font-medium text-brand-primary dark:text-brand-mint font-poppins">
          {member.role}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-3">
        {member.bio && (
          <p className="text-sm text-gray-800 dark:text-gray-200 font-ibm-plex">
            {member.bio}
          </p>
        )}
        {member.linkedin_url && member.linkedin_url !== '#' && (
          <Button
            size="sm"
            variant="outline"
            className="w-full border-brand-mint/50 hover:bg-brand-mint/10 dark:border-brand-mint dark:hover:bg-brand-mint/20"
            onClick={() => window.open(member.linkedin_url, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            LinkedIn
          </Button>
        )}
      </CardContent>
    </Card>
  );

  const renderBoardAdvisor = (advisor: any, index: number) => (
    <Card key={`${advisor.id}-${index}`} className="hover:shadow-xl transition-all duration-300 dark:bg-gray-800/80 dark:border-gray-700 border border-brand-light-mint/30">
      <CardHeader className="text-center pb-3">
        <div className="flex justify-center mb-4">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
            <AvatarImage src={advisor.image_url} alt={advisor.name} />
            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-brand-primary to-brand-mint text-white">
              {advisor.name.split(' ').map((n: string) => n.charAt(0)).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white font-playfair mb-1">
          {advisor.name}
        </CardTitle>
        <CardDescription className="text-sm font-medium text-brand-primary dark:text-brand-mint font-poppins">
          {advisor.title}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-3">
        {advisor.company && (
          <p className="text-sm text-gray-800 dark:text-gray-200 font-ibm-plex">
            <span className="font-medium">Company:</span> {advisor.company}
          </p>
        )}
        {advisor.bio && (
          <p className="text-sm text-gray-800 dark:text-gray-200 font-ibm-plex">
            {advisor.bio}
          </p>
        )}
        {advisor.linkedin_url && advisor.linkedin_url !== '#' && (
          <Button
            size="sm"
            variant="outline"
            className="w-full border-brand-mint/50 hover:bg-brand-mint/10 dark:border-brand-mint dark:hover:bg-brand-mint/20"
            onClick={() => window.open(advisor.linkedin_url, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            LinkedIn
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (teamLoading || advisorsLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-brand-light-mint/20 via-white to-gray-50 dark:from-brand-dark-teal/20 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-brand-light-mint/20 via-white to-gray-50 dark:from-brand-dark-teal/20 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-brand-primary to-brand-mint dark:from-brand-mint dark:to-brand-light-mint bg-clip-text text-transparent mb-3 sm:mb-4">
            Impact Team
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-800 dark:text-gray-200 max-w-3xl mx-auto font-ibm-plex leading-relaxed">
            Meet our passionate community of volunteers who are building the future of church transportation across Nigeria. Together, we're creating lasting impact through service and dedication.
          </p>
          
          {/* Bible Verse */}
          <div className="mt-8 sm:mt-10 mb-8 sm:mb-10 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-brand-light-mint/20 to-brand-mint/20 dark:from-brand-dark-teal/20 dark:to-brand-mint/20 rounded-2xl p-6 sm:p-8 border border-brand-mint/30 dark:border-brand-mint/20">
              <blockquote className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900 dark:text-white font-playfair italic leading-relaxed mb-3">
                "Therefore, my dear brothers and sisters, stand firm. Let nothing move you. Always give yourselves fully to the work of the Lord, because you know that your labor in the Lord is not in vain."
              </blockquote>
              <cite className="text-sm sm:text-base text-brand-primary dark:text-brand-mint font-poppins font-semibold">
                — 1 Corinthians 15:58 NLT
              </cite>
            </div>
          </div>
        </div>
        
        {teamMembers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {teamMembers.map((member, index) => renderTeamMember(member, index))}
          </div>
        )}

        {boardAdvisors.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <h3 className="font-playfair text-xl sm:text-2xl lg:text-3xl font-bold text-center bg-gradient-to-r from-brand-primary to-brand-mint dark:from-brand-mint dark:to-brand-light-mint bg-clip-text text-transparent mb-6 sm:mb-8">
              Board of Advisors
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
              {boardAdvisors.map((advisor, index) => renderBoardAdvisor(advisor, index))}
            </div>
          </div>
        )}

          <div className="text-center mt-8 sm:mt-12">
            <div className="bg-gradient-to-r from-brand-light-mint/30 to-brand-mint/20 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 font-poppins">
                Join Our Volunteer Community
              </h3>
              <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-ibm-plex mb-4">
                Be part of something meaningful! We're looking for passionate volunteers who want to make a difference in church communities across Nigeria. Whether you have technical skills, organizational abilities, or simply a heart to serve, there's a place for you in our mission.
              </p>
              <Button className="bg-gradient-to-r from-brand-primary to-brand-dark-teal hover:from-brand-dark-teal hover:to-brand-mint text-white font-poppins">
                Volunteer With Us
              </Button>
            </div>
          </div>
      </div>
    </section>
  );
};

export default ImpactTeamSection;
