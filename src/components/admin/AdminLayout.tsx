
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { AppSidebar } from './AppSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminThemeProvider } from '@/contexts/AdminThemeContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAdmin, isLoading, session } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <AdminThemeProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AdminHeader />
            <main className="flex-1 overflow-auto">
              <div className="container mx-auto px-4 py-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AdminThemeProvider>
  );
};
