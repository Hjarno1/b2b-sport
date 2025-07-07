'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { UserRole } from '@/lib/data/mock-data';
import { useTranslation } from 'react-i18next';
import { getClubById } from '@/lib/data/mock-data';
import {
  LayoutDashboard,
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

export function Sidebar({
  isCollapsed = false,
  toggle,
}: {
  isCollapsed: boolean;
  toggle: (value: boolean) => void;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const roleKeyMap: Record<UserRole, string> = {
    [UserRole.ClubAdmin]: 'club_roles.club_admin',
    [UserRole.ClubStaff]: 'club_roles.club_staff',
    [UserRole.ClubFinance]: 'club_roles.club_finance',
  };

  const clubFinanceItems: SidebarItem[] = [
    {
      name: t('sidebar.dashboard'),
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: t('sidebar.club_agreements'),
      href: '/club-agreements',
      icon: <ClipboardCheck className="h-5 w-5" />,
    },
    {
      name: t('sidebar.invoices'),
      href: '/invoices',
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      name: t('sidebar.settings'),
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const clubAdminItems: SidebarItem[] = [
    {
      name: t('sidebar.dashboard'),
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: t('sidebar.staff_management'),
      href: '/staff-management',
      icon: <UserCog className="h-5 w-5" />,
    },
    {
      name: t('sidebar.agreements'),
      href: '/agreements',
      icon: <ClipboardCheck className="h-5 w-5" />,
    },
    {
      name: t('sidebar.products'),
      href: '/order-create-admin',
      icon: <Shirt className="h-5 w-5" />,
    },
    {
      name: t('sidebar.orders'),
      href: '/orders',
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      name: t('sidebar.settings'),
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const clubStaffItems: SidebarItem[] = [
    {
      name: t('sidebar.dashboard'),
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: t('sidebar.player_management'),
      href: '/player-roster',
      icon: <UserCircle className="h-5 w-5" />,
    },
    {
      name: t('sidebar.kit_details'),
      href: '/kit-setup',
      icon: <Shirt className="h-5 w-5" />,
    },
    {
      name: t('sidebar.products'),
      href: '/order-create-staff',
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      name: t('sidebar.teams_setup'),
      href: '/teams-setup',
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: t('sidebar.order_tracking'),
      href: '/order-tracking',
      icon: <ShoppingCart className="h-5 w-5" />,
    },
  ];

  // Select navigation items based on user role
  let navItems: SidebarItem[] = [];
  if (user?.role === UserRole.ClubAdmin) {
    navItems = clubAdminItems;
  } else if (user?.role === UserRole.ClubStaff) {
    navItems = clubStaffItems;
  } else if (user?.role === UserRole.ClubFinance) {
    navItems = clubFinanceItems;
  }

  const club = user?.clubId ? getClubById(user.clubId) : null;

  return (
    <div
      className={`h-full fixed bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-sidebar'
      }`}
    >
      {/* Header: Logo and Collapse Button */}
      <div className="flex h-16 items-center border-b px-3">
        {/* 1️⃣ This flex-1 box takes up all the space to the left of the button… */}
        <div className="flex-1 flex justify-center">
          <Link href="/" className="flex items-center flex-shrink-0">
            {isCollapsed ? (
              <div className="relative w-10 h-10 flex-shrink-0 overflow-hidden">
                <Image
                  src={club?.logo || '/default-club-logo.png'}
                  alt={club?.name || 'Club Logo'}
                  fill // absolutely fill the 40×40 box
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
            ) : (
              <div className="relative w-[143px] h-[40px] overflow-hidden">
                <Image
                  src={club?.logo || '/default-club-logo.png'}
                  alt={club?.name || 'Club Logo'}
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            )}
          </Link>
        </div>

        {/* 2️⃣ …and this pushes the toggle all the way to the right */}
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
              <p className="text-xs text-gray-500 truncate">
                {user?.role ? t(roleKeyMap[user.role]) : ''}
              </p>
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
