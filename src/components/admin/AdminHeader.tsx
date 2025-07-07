
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/hooks/useAdmin';
import { LogOut, Sun, Moon, Menu } from 'lucide-react';
import { useAdminTheme } from '@/contexts/AdminThemeContext';
import { SidebarTrigger } from '@/components/ui/sidebar';

export const AdminHeader = () => {
  const { session, signOut } = useAdmin();
  const { theme, toggleTheme } = useAdminTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sidebar-border bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-7 w-7" />
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/bb40c7c8-e5f2-456f-93e1-67a40d9ff480.png" 
              alt="Gospool Logo" 
              className="h-8 w-auto"
            />
            <div className="hidden border-l border-sidebar-border pl-3 sm:block">
              <h1 className="text-lg font-semibold text-sidebar-foreground">Admin Dashboard</h1>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <div className="hidden text-sm text-sidebar-foreground/70 sm:block">
            {session?.user?.email}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="h-8 gap-2 border-sidebar-border bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-3 w-3" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
