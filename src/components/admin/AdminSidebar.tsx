
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  DollarSign, 
  Users, 
  FileText, 
  FolderOpen, 
  Newspaper,
  UserCheck,
  Award,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Donations', href: '/admin/donations', icon: DollarSign },
  { name: 'Sponsorships', href: '/admin/sponsorships', icon: Award },
  { name: 'Impact Reports', href: '/admin/reports', icon: FileText },
  { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { name: 'News', href: '/admin/news', icon: Newspaper },
  { name: 'Team Members', href: '/admin/team', icon: Users },
  { name: 'Board Advisors', href: '/admin/advisors', icon: UserCheck },
  { name: 'Impact Sponsors', href: '/admin/sponsors', icon: Award },
  { name: 'Team Applications', href: '/admin/applications', icon: Briefcase },
];

export const AdminSidebar = () => {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-brand-primary">
        <div className="flex h-16 flex-shrink-0 items-center px-4">
          <img
            className="h-8 w-auto"
            src="/lovable-uploads/52524576-df42-4ff1-ae6b-916c64b5f607.png"
            alt="Gospool Admin"
          />
          <span className="ml-2 text-white text-lg font-semibold">Admin</span>
        </div>
        <nav className="mt-5 flex-1 flex-col divide-y divide-brand-dark-teal overflow-y-auto">
          <div className="px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/admin'}
                className={({ isActive }) =>
                  cn(
                    isActive
                      ? 'bg-brand-dark-teal text-white'
                      : 'text-brand-light-mint hover:bg-brand-dark-teal hover:text-white',
                    'group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md'
                  )
                }
              >
                <item.icon className="mr-4 flex-shrink-0 h-6 w-6" aria-hidden="true" />
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};
