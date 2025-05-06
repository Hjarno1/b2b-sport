// src/components/layout/header.tsx
'use client';

import { useAuth } from '@/lib/context/auth-context';
import { Bell, HelpCircle, Search } from 'lucide-react';

export function Header({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const { user } = useAuth();
  console.log(user?.avatar);
  return (
    <header
      className={`h-16 bg-white border-b border-gray-200 fixed top-0 right-0 z-10 flex items-center justify-between px-6 ${
        isCollapsed ? 'left-20' : 'left-sidebar'
      }`}
    >
      <div className="flex items-center">
        <div className="relative mr-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <Bell size={20} className="text-gray-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        <button className="p-2 rounded-full hover:bg-gray-100">
          <HelpCircle size={20} className="text-gray-500" />
        </button>

        {/* <div className="h-8 mx-4 border-l border-gray-200"></div> */}

        {/* <div className="flex items-center">
          <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
            <Image
              src={user?.avatar || '/faces/default-avatar.jpg'}
              alt={user?.name || 'User Avatar'}
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>

          <button
            onClick={logout}
            className="flex items-center hover:text-primary transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div> */}
      </div>
    </header>
  );
}
