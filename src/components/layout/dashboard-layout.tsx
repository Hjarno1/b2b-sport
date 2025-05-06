// src/components/layout/dashboard-layout.tsx
'use client';

import { ReactNode, useState } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { useAuth } from '@/lib/context/auth-context';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isLoading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Sidebar isCollapsed={isCollapsed} toggle={setIsCollapsed} />
      <Header isCollapsed={isCollapsed} />
      <main className={`pt-16 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-sidebar'}`}>
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}