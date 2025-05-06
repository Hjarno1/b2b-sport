// src/components/layout/sidebar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { UserRole } from '@/lib/data/mock-data';
import {
  LayoutDashboard,
  Building2,
  FileText,
  ClipboardList,
  Users,
  Settings,
  UserCog,
  ShoppingBag,
  ShoppingCart,
  Shirt,
  ChevronLeft,
  LogOut,
  UserCircle,
  ClipboardCheck,
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

// B2B Admin can use business terminology - they understand the system
const b2bAdminItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: 'Club Management',
    href: '/club-management',
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    name: 'Agreement Templates',
    href: '/agreement-templates',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: 'Active Agreements',
    href: '/active-agreements',
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    name: 'User Management',
    href: '/user-management',
    icon: <Users className="h-5 w-5" />,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

// Club Admin uses more task-oriented language but still understands some business concepts
const clubAdminItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: 'Staff Management',
    href: '/staff-management',
    icon: <UserCog className="h-5 w-5" />,
  },
  {
    name: 'Agreements', // Changed from "Agreements" to "Kit Requests"
    href: '/agreements',
    icon: <ClipboardCheck className="h-5 w-5" />,
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

// Club Staff uses completely user-friendly language focused on their actual tasks
const clubStaffItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: 'Player Roster', // Changed from "Roster Management" to "Player Roster"
    href: '/player-roster',
    icon: <UserCircle className="h-5 w-5" />,
  },
  {
    name: 'Kit Details',
    href: '/kit-setup',
    icon: <Shirt className="h-5 w-5" />,
  },
  {
    name: 'Teams Setup',
    href: '/teams-setup',
    icon: <Users className="h-5 w-5" />,
  },
  {
    name: 'Order Tracking', // Changed from "Order Status" to "Order Tracking"
    href: '/order-tracking',
    icon: <ShoppingCart className="h-5 w-5" />,
  },
];

export function Sidebar({
  isCollapsed = false,
  toggle,
}: {
  isCollapsed: boolean;
  toggle: (value: boolean) => void;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Select navigation items based on user role
  let navItems: SidebarItem[] = [];
  if (user?.role === UserRole.B2BSportAdmin) {
    navItems = b2bAdminItems;
  } else if (user?.role === UserRole.ClubAdmin) {
    navItems = clubAdminItems;
  } else if (user?.role === UserRole.ClubStaff) {
    navItems = clubStaffItems;
  }

  return (
    <div
      className={`h-full fixed bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-sidebar'
      }`}
    >
      {/* Header: Logo and Collapse Button */}
      <div className="flex h-16 items-center justify-between border-b px-3">
        <Link href="/" className="flex items-center">
          {isCollapsed ? (
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full">
              <span className="text-white font-bold">B2B</span>
            </div>
          ) : (
            <Image src="/logo.png" alt="Logo" width={143} height={40} />
          )}
        </Link>
        <button onClick={() => toggle(!isCollapsed)} className="text-gray-500 hover:text-primary">
          <ChevronLeft
            className={`h-5 w-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* User Profile Card */}
      <div className="flex items-center gap-3 px-3 py-4 border-b">
        <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden">
          <Image
            src={user?.avatar || '/faces/default-avatar.jpg'}
            alt={user?.name || 'User Avatar'}
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
        {!isCollapsed && (
          <>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role}</p>
            </div>
            <button onClick={logout} className="text-gray-500 hover:text-primary transition-colors">
              <LogOut size={16} />
            </button>
          </>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="px-3 py-6 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center text-sm px-3 py-2.5 rounded-md transition-colors ${
                    isCollapsed ? 'justify-center' : 'gap-x-3'
                  } ${
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className={`flex-shrink-0 ${isActive ? 'text-primary' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
