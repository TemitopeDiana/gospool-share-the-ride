
import { Church, Quote } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: "🙏",
      title: "Never Miss Church Again",
      description: "Reliable transportation ensures you can attend every service, bible study, and special program your church offers."
    },
    {
      icon: "🆓",
      title: "Completely Free",
      description: "No cost to ride! Our platform connects you with church members offering free rides, removing financial barriers to worship."
    },
    {
      icon: "🛡️",
      title: "Safe & Trusted",
      description: "Travel with verified church members and fellow believers. Every driver is part of your faith community with proper verification."
    },
    {
      icon: "🤝",
      title: "Build Lasting Friendships",
      description: "Form meaningful connections with other church members during your journey. Strengthen fellowship beyond Sunday services."
    },
    {
      icon: "🚌",
      title: "Church Bus Coordination",
      description: "Easy coordination for church-provided transportation. Organize group travel for retreats, conferences, and special events."
    },
    {
      icon: "🌱",
      title: "Eco-Friendly Impact",
      description: "Reduce traffic and environmental impact by sharing rides. Care for God's creation through community transportation."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
            Bringing the Church Family Together
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gospool removes transportation barriers and creates opportunities for fellowship, 
            ensuring every member can participate fully in church life while building stronger community bonds.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-xl text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bible Verses about Supporting Each Other */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-lg">
            <Quote className="h-8 w-8 text-brand-blue mb-4" />
            <p className="text-gray-700 italic text-lg mb-3">
              "Share each other's burdens, and in this way obey the law of Christ."
            </p>
            <p className="text-brand-blue font-semibold">Galatians 6:2</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-purple-50 p-8 rounded-lg">
            <Quote className="h-8 w-8 text-brand-green mb-4" />
            <p className="text-gray-700 italic text-lg mb-3">
              "So encourage each other and build each other up, just as you are already doing."
            </p>
            <p className="text-brand-green font-semibold">1 Thessalonians 5:11</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-lg">
            <Quote className="h-8 w-8 text-brand-purple mb-4" />
            <p className="text-gray-700 italic text-lg mb-3">
              "As iron sharpens iron, so a friend sharpens a friend."
            </p>
            <p className="text-brand-purple font-semibold">Proverbs 27:17</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-lg">
            <Quote className="h-8 w-8 text-brand-blue mb-4" />
            <p className="text-gray-700 italic text-lg mb-3">
              "If one part suffers, all the parts suffer with it, and if one part is honored, all the parts are glad."
            </p>
            <p className="text-brand-blue font-semibold">1 Corinthians 12:26</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
