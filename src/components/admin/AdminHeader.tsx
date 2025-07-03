
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { LogOut, User, Home, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const AdminHeader = () => {
  const { session, signOut } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackToWebsite = () => {
    window.open('/', '_blank');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    const titles: { [key: string]: string } = {
      '/admin': 'Dashboard',
      '/admin/donations': 'Donations',
      '/admin/sponsorships': 'Sponsorships',
      '/admin/reports': 'Impact Reports',
      '/admin/projects': 'Projects',
      '/admin/news': 'News',
      '/admin/team': 'Team Members',
      '/admin/advisors': 'Board Advisors',
      '/admin/sponsors': 'Impact Sponsors',
      '/admin/applications': 'Team Applications',
    };
    return titles[path] || 'Admin Panel';
  };

  return (
    <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
      <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
        <div className="flex items-center gap-x-2">
          {location.pathname !== '/admin' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToWebsite}
            className="text-gray-500 hover:text-gray-700"
          >
            <Home className="h-4 w-4" />
            Website
          </Button>
        </div>
        
        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="flex flex-1 items-center">
            <h1 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />
            <div className="flex items-center gap-x-4">
              <div className="flex items-center gap-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  {session?.user?.email}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
