// src/app/(dashboard)/layout.tsx
import { ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

interface DashboardLayoutWrapperProps {
  children: ReactNode;
}

export default async function DashboardLayoutWrapper({ children }: DashboardLayoutWrapperProps) {
  // In a real app, you would check the session/token here
  // For demo, we'll use a simple cookie check
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('user');

  if (!isLoggedIn) {
    redirect('/login');
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}