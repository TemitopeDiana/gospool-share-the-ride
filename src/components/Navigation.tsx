
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

const Navigation = () => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  return (
    <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src="/lovable-uploads/52524576-df42-4ff1-ae6b-916c64b5f607.png" 
                alt="Gospool Logo" 
                className="w-10 h-10 dark:hidden"
              />
              <img 
                src="/lovable-uploads/2ddb1688-61b9-4b51-b259-c1f342934418.png" 
                alt="Gospool Logo" 
                className="w-10 h-10 hidden dark:block"
              />
            </div>
            <span className="font-poppins text-2xl font-bold text-gray-900 dark:text-white">
              GOSPOOL
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-gray-700 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary transition-colors font-medium font-ibm-plex ${
                location.pathname === '/' ? 'text-brand-primary' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/sponsorship" 
              className={`text-gray-700 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary transition-colors font-medium font-ibm-plex ${
                location.pathname === '/sponsorship' ? 'text-brand-primary' : ''
              }`}
            >
              Sponsorship
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white">
              Join Now
            </Button>
          </div>
          
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
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
