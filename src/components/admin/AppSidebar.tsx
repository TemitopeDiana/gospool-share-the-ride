
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
  UserPlus
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export const AppSidebar = () => {
  const location = useLocation();
  const { isSuperAdmin } = useAdmin();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Donations',
      href: '/admin/donations',
      icon: DollarSign,
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
      name: 'Team Applications',
      href: '/admin/applications',
      icon: Users,
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
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">
            Administration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {allItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        to={item.href}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isSuperAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">
              Super Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {superAdminItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link
                          to={item.href}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200"
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};
