
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Presentation,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Donations', href: '/admin/donations', icon: DollarSign },
  { name: 'Sponsorships', href: '/admin/sponsorships', icon: HandHeart },
  { name: 'Sponsor Requests', href: '/admin/sponsor-requests', icon: ClipboardList },
  { name: 'Impact Reports', href: '/admin/impact-reports', icon: FileBarChart },
  { name: 'Pitch Deck Requests', href: '/admin/pitch-deck-requests', icon: Presentation },
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
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('admin-sidebar-collapsed', isCollapsed.toString());
  }, [isCollapsed]);

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
      {/* Header with Logo */}
      <div className={cn(
        "flex shrink-0 items-center border-b border-sidebar-border transition-all duration-200",
        collapsed ? "h-16 px-2 justify-center" : "h-16 px-6"
      )}>
        <div className="flex items-center gap-3">
          <img
            className="h-8 w-auto"
            src="public/images/Logo mark v2 dark.png"
            alt="Gospool"
            onError={e => {
              (e.currentTarget as HTMLImageElement).src = '/images/Logomark v1 white.png';
            }}
          />
          {!collapsed && (
            <div className="hidden lg:block">
              <h1 className="text-lg font-bold text-sidebar-foreground">Gospool</h1>
              <p className="text-xs text-sidebar-foreground/70">Admin Panel</p>
            </div>
          )}
        </div>
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto lg:hidden text-sidebar-foreground"
          onClick={() => setIsMobileOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
        {/* Desktop collapse button */}
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto hidden lg:flex text-sidebar-foreground"
          onClick={toggleCollapsed}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
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
                    'w-full h-10 px-3 transition-all duration-200',
                    collapsed ? 'justify-center' : 'justify-start',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90'
                      : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                  onClick={() => {
                    navigate(item.href);
                    setIsMobileOpen(false);
                  }}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className={cn(
                    "h-4 w-4 shrink-0",
                    collapsed ? "" : "mr-3"
                  )} />
                  {!collapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className={cn(
        "p-4 border-t border-sidebar-border",
        collapsed && "px-2"
      )}>
        <div className={cn(
          "text-xs text-sidebar-foreground/70",
          collapsed ? "text-center" : ""
        )}>
          {collapsed ? "© 2024" : "© 2024 Gospool"}
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
      <div className={cn(
        "hidden lg:flex lg:flex-col transition-all duration-200",
        isCollapsed ? "lg:w-16" : "lg:w-64"
      )}>
        <SidebarContent collapsed={isCollapsed} />
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
