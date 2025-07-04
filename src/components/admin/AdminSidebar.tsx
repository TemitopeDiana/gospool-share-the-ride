
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const location = useLocation();

  const { data: userRole } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data?.role || 'user';
    }
  });

  // Check for super_admin role - cast to string to handle the type comparison
  const isSuperAdmin = (userRole as string) === 'super_admin';

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
      name: 'Sponsorships',
      href: '/admin/sponsorships',
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
      name: 'Sponsors',
      href: '/admin/sponsors',
      icon: Award,
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
    <nav className="space-y-1">
      {allItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <item.icon
              className={cn(
                'mr-3 h-5 w-5 transition-colors',
                isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
              )}
              aria-hidden="true"
            />
            <span className="truncate">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default AdminSidebar;
