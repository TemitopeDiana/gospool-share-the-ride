import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  FileText, 
  Award, 
  Briefcase,
  Newspaper,
  Settings,
  UserCheck,
  Clock,
  CreditCard,
  HandHeart,
  UserPlus,
  Menu,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';

export function AppSidebar() {
  const location = useLocation();
  const { isSuperAdmin } = useAdmin();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
    },
    {
      name: 'Donations',
      href: '/admin/donations',
      icon: DollarSign,
    },
    {
      name: 'Recent Donors',
      href: '/admin/recent-donors',
      icon: Users,
    },
    {
      name: 'Sponsor Requests',
      href: '/admin/sponsor-requests',
      icon: HandHeart,
    },
    {
      name: 'Impact Sponsors',
      href: '/admin/sponsors',
      icon: Award,
    },
    {
      name: 'Impact Reports',
      href: '/admin/impact-reports',
      icon: FileText,
    },
    {
      name: 'Volunteer Applications',
      href: '/admin/volunteer-applications',
      icon: UserPlus,
    },
    {
      name: 'Projects',
      href: '/admin/projects',
      icon: Briefcase,
    },
    {
      name: 'News',
      href: '/admin/news',
      icon: Newspaper,
    },
    {
      name: 'Team Members',
      href: '/admin/team',
      icon: UserCheck,
    },
    {
      name: 'Board Advisors',
      href: '/admin/advisors',
      icon: Users,
    },
    {
      name: 'Admin Users',
      href: '/admin/users',
      icon: Settings,
    },
  ];

  // Super admin only items
  const superAdminItems = [
    {
      name: 'Pending Changes',
      href: '/admin/pending-changes',
      icon: Clock,
    },
    {
      name: 'Paystack Diagnostics',
      href: '/admin/paystack-diagnostics',
      icon: CreditCard,
    },
  ];

  const allItems = isSuperAdmin ? [...navigationItems, ...superAdminItems] : navigationItems;

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center space-x-2">
          <SidebarTrigger className="h-6 w-6" />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">Admin Panel</span>
              <span className="text-xs text-muted-foreground">Gospool CMS</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {allItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.name}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}