// src/components/layout/header.tsx
'use client';

import { useState, useEffect } from 'react'; // Add this at the top
import { useAuth } from '@/lib/context/auth-context';
import { Bell, HelpCircle, Search } from 'lucide-react';
import NotificationInformation from '@/app/components/shared/notificationInformation';
<<<<<<< HEAD
import { UserRole } from '@/lib/data/mock-data';
import { ShoppingCart as CartIcon } from 'lucide-react';
import { ShoppingCart } from '@/app/components/cart/ShoppingCart';
import { useTranslation } from 'react-i18next';
=======
>>>>>>> main

export function Header({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
<<<<<<< HEAD
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { t } = useTranslation('orderOverview');

  useEffect(() => {
    const stored = localStorage.getItem('submittedOrders');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHasNotifications(true);
        } else {
          setHasNotifications(false);
        }
      } catch {
        setHasNotifications(false);
      }
    }
  }, []);
=======

  useEffect(() => {
  const stored = localStorage.getItem('submittedOrders');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setHasNotifications(true);
      } else {
        setHasNotifications(false);
      }
    } catch {
      setHasNotifications(false);
    }
  }
}, []);
>>>>>>> main

  const { user } = useAuth();
  const showCart = user?.role === UserRole.ClubAdmin || user?.role === UserRole.ClubStaff;

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
            placeholder={t('search.placeholder')}
            className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-gray-100 relative"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Bell size={20} className="text-gray-500" />
            {hasNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            )}
          </button>
          <NotificationInformation isOpen={dropdownOpen} />
        </div>

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
        {showCart && (
          <button onClick={() => setIsCartOpen(true)} aria-label="Open cart">
            <CartIcon size={20} />
          </button>
        )}
      </div>
      {showCart && <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
    </header>
  );
}
