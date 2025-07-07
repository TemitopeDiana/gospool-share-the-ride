
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/hooks/useAdmin';
import { LogOut, Sun, Moon } from 'lucide-react';
import { useAdminTheme } from '@/contexts/AdminThemeContext';

export const AdminHeader = () => {
  const { session, signOut } = useAdmin();
  const { theme, toggleTheme } = useAdminTheme();

  return (
    <header className="bg-background border-b border-border px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <img 
            src="/lovable-uploads/bb40c7c8-e5f2-456f-93e1-67a40d9ff480.png" 
            alt="Gospool Logo" 
            className="h-8 w-auto"
          />
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-foreground">Admin Dashboard</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          
          <div className="hidden sm:block text-sm text-muted-foreground">
            {session?.user?.email}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
