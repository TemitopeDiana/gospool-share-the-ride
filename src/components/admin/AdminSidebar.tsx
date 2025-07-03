
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
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

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <h1 className="text-xl font-bold text-gray-900">Gospool Admin</h1>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start',
                        isActive
                          ? 'bg-gray-50 text-indigo-600'
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                      )}
                      onClick={() => navigate(item.href)}
                    >
                      <item.icon
                        className={cn(
                          'h-5 w-5 mr-3 shrink-0',
                          isActive ? 'text-indigo-600' : 'text-gray-400'
                        )}
                      />
                      {item.name}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};
