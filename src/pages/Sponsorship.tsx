import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Church } from "lucide-react";

const Sponsorship = () => {
  const packages = [
    {
      name: "Community Partner",
      price: "$500",
      period: "/month",
      features: [
        "Church logo in app",
        "Monthly usage analytics",
        "Priority customer support",
        "Community impact reports"
      ],
      popular: false
    },
    {
      name: "Faith Leader",
      price: "$1,200",
      period: "/month",
      features: [
        "Everything in Community Partner",
        "Custom church branding",
        "Event integration",
        "Advanced analytics dashboard",
        "Priority feature requests"
      ],
      popular: true
    },
    {
      name: "Regional Champion",
      price: "$2,500",
      period: "/month",
      features: [
        "Everything in Faith Leader",
        "Multi-church network support",
        "Custom integrations",
        "Dedicated account manager",
        "Beta feature access",
        "Annual strategy session"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen font-inter">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Church className="h-16 w-16 text-brand-blue mx-auto mb-6" />
          <h1 className="font-playfair text-5xl font-bold text-gray-900 mb-6">
            Partner With Gospool
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join us in building stronger church communities through innovative ride-sharing solutions. 
            Together, we can make transportation accessible while fostering meaningful fellowship.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-playfair text-4xl font-bold text-center text-gray-900 mb-16">
            Why Partner With Us?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="font-semibold text-xl text-gray-900 mb-3">
                Strengthen Community Bonds
              </h3>
              <p className="text-gray-600">
                Help your congregation connect on a deeper level through shared experiences and mutual support.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="font-semibold text-xl text-gray-900 mb-3">
                Increase Attendance
              </h3>
              <p className="text-gray-600">
                Remove transportation barriers and see increased participation in church activities and services.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-6xl mb-4">💡</div>
              <h3 className="font-semibold text-xl text-gray-900 mb-3">
                Innovation Leadership
              </h3>
              <p className="text-gray-600">
                Position your church as a forward-thinking community that embraces technology for good.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
              Choose Your Partnership Level
            </h2>
            <p className="text-xl text-gray-600">
              Flexible sponsorship options designed to fit churches of all sizes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card 
                key={index} 
                className={`relative ${pkg.popular ? 'border-brand-blue shadow-lg scale-105' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-brand-blue text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    <span className="text-4xl font-bold text-gray-900">{pkg.price}</span>
                    <span className="text-lg">{pkg.period}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-brand-green rounded-full mr-3"></div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      pkg.popular 
                        ? 'bg-brand-blue hover:bg-blue-600 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
              Making a Real Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how churches are already transforming their communities with Gospool
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-brand-blue mb-2">85%</div>
              <p className="text-gray-600">Increase in church attendance</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-brand-green mb-2">12K+</div>
              <p className="text-gray-600">Rides shared monthly</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-brand-purple mb-2">450+</div>
              <p className="text-gray-600">Partner churches</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-blue to-brand-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-4xl font-bold text-white mb-6">
            Ready to Transform Your Community?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of churches already using Gospool to build stronger, 
            more connected communities through shared transportation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-brand-blue hover:bg-gray-100 px-8 py-3 text-lg">
              Schedule a Demo
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-blue px-8 py-3 text-lg">
              Download Partnership Kit
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sponsorship;
