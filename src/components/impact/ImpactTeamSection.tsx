import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const ImpactTeamSection = () => {
  const teamMembers = [
    {
      role: "Founder/Product Owner",
      name: "Coming Soon",
      church: "TBD",
      linkedin: "#",
      avatar: ""
    },
    {
      role: "Product Manager",
      name: "Coming Soon",
      church: "TBD", 
      linkedin: "#",
      avatar: ""
    },
    {
      role: "Full Stack Developer",
      name: "Coming Soon",
      church: "TBD",
      linkedin: "#",
      avatar: ""
    },
    {
      role: "Full Stack Developer",
      name: "Coming Soon",
      church: "TBD",
      linkedin: "#",
      avatar: ""
    },
    {
      role: "Full Stack Developer",
      name: "Coming Soon",
      church: "TBD",
      linkedin: "#",
      avatar: ""
    },
    {
      role: "Mobile Developer",
      name: "Coming Soon",
      church: "TBD",
      linkedin: "#",
      avatar: ""
    },
    {
      role: "Mobile Developer",
      name: "Coming Soon",
      church: "TBD",
      linkedin: "#",
      avatar: ""
    },
    {
      role: "UI/UX Designer",
      name: "Coming Soon",
      church: "TBD",
      linkedin: "#",
      avatar: ""
    },
    {
      role: "Board of Advisors",
      name: "Coming Soon",
      church: "TBD",
      linkedin: "#",
      avatar: ""
    },
    {
      role: "Board of Advisors",
      name: "Coming Soon",
      church: "TBD",
      linkedin: "#",
      avatar: ""
    }
  ];

  const renderTeamMember = (member: any, index: number) => (
    <Card key={`${member.role}-${index}`} className="hover:shadow-xl transition-all duration-300 dark:bg-gray-800/80 dark:border-gray-700 border border-brand-light-mint/30">
      <CardHeader className="text-center pb-3">
        <div className="flex justify-center mb-4">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
            <AvatarImage src={member.avatar} alt={member.name} />
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
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-ibm-plex">
            <span className="font-medium">Church:</span> {member.church}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-full border-brand-mint/50 hover:bg-brand-mint/10 dark:border-brand-mint dark:hover:bg-brand-mint/20"
          onClick={() => window.open(member.linkedin, '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          LinkedIn
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-brand-light-mint/20 via-white to-gray-50 dark:from-brand-dark-teal/20 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-brand-primary to-brand-mint dark:from-brand-mint dark:to-brand-light-mint bg-clip-text text-transparent mb-3 sm:mb-4">
            Impact Team
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-ibm-plex leading-relaxed">
            Meet the dedicated team building the future of church transportation across Nigeria and beyond.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {teamMembers.map((member, index) => renderTeamMember(member, index))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-brand-light-mint/20 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 font-poppins">
              Join Our Team
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-ibm-plex mb-4">
              We're looking for passionate individuals to join our mission of connecting church communities.
            </p>
            <Button className="bg-gradient-to-r from-brand-primary to-brand-dark-teal hover:from-brand-dark-teal hover:to-brand-mint text-white font-poppins">
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactTeamSection;