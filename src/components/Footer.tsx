
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
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
              <span className="font-poppins text-2xl font-bold">GOSPOOL</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md font-ibm-plex">
              Connecting church communities through safe, affordable ride sharing. 
              Building fellowship one journey at a time.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-brand-primary/80 transition-colors">
                <span className="text-sm font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-brand-primary/80 transition-colors">
                <span className="text-sm font-bold">@</span>
              </div>
              <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-brand-primary/80 transition-colors">
                <span className="text-sm font-bold">in</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 font-poppins">Quick Links</h3>
            <ul className="space-y-2 font-ibm-plex">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/sponsorship" className="text-gray-400 hover:text-white transition-colors">Sponsorship</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 font-poppins">Support</h3>
            <ul className="space-y-2 font-ibm-plex">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Safety</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 font-ibm-plex">
            © 2024 Gospool. All rights reserved. Built with faith and technology.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
