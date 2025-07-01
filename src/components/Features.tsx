
import { Church } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: "🤝",
      title: "Faith-Based Community",
      description: "Connect with verified church members and fellow believers for safe, trusted rides."
    },
    {
      icon: "💰",
      title: "Share the Cost",
      description: "Split fuel costs fairly while building meaningful relationships along the way."
    },
    {
      icon: "🛡️",
      title: "Safety First",
      description: "All drivers are verified church members with background checks and references."
    },
    {
      icon: "🌱",
      title: "Eco-Friendly",
      description: "Reduce carbon footprint by sharing rides and caring for God's creation."
    },
    {
      icon: "📱",
      title: "Easy to Use",
      description: "Simple app interface designed for all ages and technical skill levels."
    },
    {
      icon: "⛪",
      title: "Church Integration",
      description: "Seamlessly connects with your church directory and event calendar."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
            Built for Community
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gospool brings together technology and faith to create meaningful connections 
            while making transportation more accessible and affordable for everyone.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </div>
    </section>
  );
};

export default Features;
