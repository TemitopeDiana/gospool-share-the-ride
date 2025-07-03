
import { useAdmin } from '@/hooks/useAdmin';
import { useAdminTheme } from '@/contexts/AdminThemeContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Home, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const AdminHeader = () => {
  const { session, signOut } = useAdmin();
  const { theme, toggleTheme } = useAdminTheme();
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
      '/admin/users': 'Admin Users',
    };
    return titles[path] || 'Admin Panel';
  };

  return (
    <div className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6">
        {/* Navigation buttons */}
        <div className="flex items-center gap-x-2">
          {location.pathname !== '/admin' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToWebsite}
            className="text-muted-foreground hover:text-foreground"
          >
            <Home className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Website</span>
          </Button>
        </div>
        
        {/* Page title */}
        <div className="flex flex-1 items-center min-w-0">
          <h1 className="text-lg font-semibold text-foreground truncate">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-x-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          {/* User info */}
          <div className="hidden sm:flex items-center gap-x-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium truncate max-w-32">
              {session?.user?.email}
            </span>
          </div>

          {/* Sign out */}
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Sign out</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
