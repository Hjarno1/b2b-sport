// src/app/(auth)/layout.tsx
import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  // In a real app, you would check the session/token here
  // For demo, we'll use a simple cookie check
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('user');

  // If already logged in, redirect to dashboard
  if (isLoggedIn) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}