
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  DollarSign,
  HandHeart,
  FileBarChart,
  FolderOpen,
  Newspaper,
  Users,
  UserCheck,
  Building2,
  FileText,
  Settings,
  Menu,
  X,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Donations', href: '/admin/donations', icon: DollarSign },
  { name: 'Sponsorships', href: '/admin/sponsorships', icon: HandHeart },
  { name: 'Impact Reports', href: '/admin/reports', icon: FileBarChart },
  { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { name: 'News', href: '/admin/news', icon: Newspaper },
  { name: 'Team Members', href: '/admin/team', icon: Users },
  { name: 'Board Advisors', href: '/admin/advisors', icon: UserCheck },
  { name: 'Impact Sponsors', href: '/admin/sponsors', icon: Building2 },
  { name: 'Applications', href: '/admin/applications', icon: FileText },
  { name: 'Admin Users', href: '/admin/users', icon: Settings },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-card border-r border-border">
      {/* Header with Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
        <div className="flex items-center gap-3">
          <img
            className="h-8 w-auto"
            src="/lovable-uploads/52524576-df42-4ff1-ae6b-916c64b5f607.png"
            alt="Gospool"
          />
          <div className="hidden lg:block">
            <h1 className="text-lg font-bold text-foreground">Gospool</h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul role="list" className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start h-10 px-3',
                    isActive
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                  onClick={() => {
                    navigate(item.href);
                    setIsMobileOpen(false);
                  }}
                >
                  <item.icon className="h-4 w-4 mr-3 shrink-0" />
                  {item.name}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          © 2024 Gospool
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 z-50">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};
