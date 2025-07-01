
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { church } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <church className="h-8 w-8 text-brand-blue" />
            <span className="font-playfair text-2xl font-bold text-gray-900">
              Gospool
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-gray-700 hover:text-brand-blue transition-colors font-medium ${
                location.pathname === '/' ? 'text-brand-blue' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/sponsorship" 
              className={`text-gray-700 hover:text-brand-blue transition-colors font-medium ${
                location.pathname === '/sponsorship' ? 'text-brand-blue' : ''
              }`}
            >
              Sponsorship
            </Link>
            <Button className="bg-brand-blue hover:bg-blue-600 text-white">
              Join Now
            </Button>
          </div>
          
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
