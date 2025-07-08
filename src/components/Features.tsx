
import { Quote } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: "🙏",
      title: "Never Miss Church Again",
      description: "Reliable transportation ensures you can attend every service, bible study, and special program your church offers.",
      gradient: "from-brand-primary to-brand-dark-teal"
    },
    {
      icon: "🆓",
      title: "Completely Free",
      description: "No cost to ride! Our platform connects you with church members offering free rides, removing financial barriers to worship.",
      gradient: "from-brand-mint to-brand-light-mint"
    },
    {
      icon: "🛡️",
      title: "Safe & Trusted",
      description: "Travel with verified church members and fellow believers. Every driver is part of your faith community with proper verification.",
      gradient: "from-brand-dark-teal to-brand-mint"
    },
    {
      icon: "🤝",
      title: "Build Lasting Friendships",
      description: "Form meaningful connections with other church members during your journey. Strengthen fellowship beyond Sunday services.",
      gradient: "from-brand-mint to-brand-primary"
    },
    {
      icon: "🚌",
      title: "Church Bus Coordination",
      description: "Easy coordination for church-provided transportation. Organize group travel for retreats, conferences, and special events.",
      gradient: "from-brand-light-mint to-brand-dark-teal"
    },
    {
      icon: "🌱",
      title: "Eco-Friendly Impact",
      description: "Reduce traffic and environmental impact by sharing rides. Care for God's creation through community transportation.",
      gradient: "from-brand-primary to-brand-mint"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-white via-brand-light-mint/10 to-white dark:from-gray-900 dark:via-brand-dark-teal/10 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold bg-gradient-to-r from-brand-primary to-brand-dark-teal dark:from-brand-mint dark:to-brand-light-mint bg-clip-text text-transparent mb-4">
            Bringing the Church Family Together
          </h2>
          <p className="text-lg sm:text-xl text-gray-800 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Gospool removes transportation barriers and creates opportunities for fellowship, 
            ensuring every member can participate fully in church life while building stronger community bonds.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 hover:shadow-xl transition-all duration-300 animate-fade-in border border-brand-light-mint/30 dark:border-brand-mint/30 group hover:scale-105 touch-manipulation"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center text-xl sm:text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto sm:mx-0`}>
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg sm:text-xl text-gray-900 dark:text-white mb-3 font-poppins text-center sm:text-left">
                {feature.title}
              </h3>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-ibm-plex text-sm sm:text-base text-center sm:text-left">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bible Verses about Supporting Each Other */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-brand-light-mint/20 to-brand-mint/20 dark:from-brand-dark-teal/20 dark:to-brand-mint/20 p-6 sm:p-8 rounded-xl backdrop-blur-sm border border-brand-light-mint/50 dark:border-brand-mint/30 shadow-lg">
            <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-brand-primary dark:text-brand-mint mb-3 sm:mb-4" />
            <p className="text-gray-700 dark:text-gray-300 italic text-base sm:text-lg mb-2 sm:mb-3 font-ibm-plex leading-relaxed">
              "Share each other's burdens, and in this way obey the law of Christ."
            </p>
            <p className="text-brand-primary dark:text-brand-mint font-semibold font-poppins text-sm sm:text-base">Galatians 6:2</p>
          </div>
          
          <div className="bg-gradient-to-r from-brand-mint/20 to-brand-primary/20 dark:from-brand-mint/20 dark:to-brand-light-mint/20 p-6 sm:p-8 rounded-xl backdrop-blur-sm border border-brand-light-mint/50 dark:border-brand-mint/30 shadow-lg">
            <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-brand-mint dark:text-brand-light-mint mb-3 sm:mb-4" />
            <p className="text-gray-700 dark:text-gray-300 italic text-base sm:text-lg mb-2 sm:mb-3 font-ibm-plex leading-relaxed">
              "So encourage each other and build each other up, just as you are already doing."
            </p>
            <p className="text-brand-mint dark:text-brand-light-mint font-semibold font-poppins text-sm sm:text-base">1 Thessalonians 5:11</p>
          </div>
          
          <div className="bg-gradient-to-r from-brand-primary/20 to-brand-dark-teal/20 dark:from-brand-dark-teal/20 dark:to-brand-mint/20 p-6 sm:p-8 rounded-xl backdrop-blur-sm border border-brand-light-mint/50 dark:border-brand-mint/30 shadow-lg">
            <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-brand-dark-teal dark:text-brand-mint mb-3 sm:mb-4" />
            <p className="text-gray-700 dark:text-gray-300 italic text-base sm:text-lg mb-2 sm:mb-3 font-ibm-plex leading-relaxed">
              "As iron sharpens iron, so a friend sharpens a friend."
            </p>
            <p className="text-brand-dark-teal dark:text-brand-mint font-semibold font-poppins text-sm sm:text-base">Proverbs 27:17</p>
          </div>
          
          <div className="bg-gradient-to-r from-brand-dark-teal/20 to-brand-light-mint/20 dark:from-brand-mint/20 dark:to-brand-primary/20 p-6 sm:p-8 rounded-xl backdrop-blur-sm border border-brand-light-mint/50 dark:border-brand-mint/30 shadow-lg">
            <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-brand-mint dark:text-brand-light-mint mb-3 sm:mb-4" />
            <p className="text-gray-700 dark:text-gray-300 italic text-base sm:text-lg mb-2 sm:mb-3 font-ibm-plex leading-relaxed">
              "If one part suffers, all the parts suffer with it, and if one part is honored, all the parts are glad."
            </p>
            <p className="text-brand-mint dark:text-brand-light-mint font-semibold font-poppins text-sm sm:text-base">1 Corinthians 12:26</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
