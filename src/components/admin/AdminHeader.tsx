
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/hooks/useAdmin';
import { LogOut, Sun, Moon } from 'lucide-react';
import { useAdminTheme } from '@/contexts/AdminThemeContext';

export const AdminHeader = () => {
  const { session, signOut } = useAdmin();
  const { theme, toggleTheme } = useAdminTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <img 
            src="/lovable-uploads/bb40c7c8-e5f2-456f-93e1-67a40d9ff480.png" 
            alt="Gospool Logo" 
            className="h-10 w-auto"
          />
          <div className="hidden md:flex flex-col">
            <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Gospool Management System</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 hover:bg-accent"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-medium text-foreground">Administrator</span>
            <span className="text-xs text-muted-foreground">{session?.user?.email}</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="flex items-center space-x-2 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
