// src/app/(auth)/club-login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/lib/context/auth-context';
import { mockClubs } from '@/lib/data/mock-data';
import Link from 'next/link';

export default function ClubLoginPage() {
  const club = mockClubs[0];
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch {
      setError(t('login.invalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* CLUB HERO */}
      <header className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="mx-auto w-40 h-40 rounded-full bg-white/20 flex items-center justify-center">
            <Image
              src={club.logo ?? '/placeholder-logo.png'}
              alt={`${club.name} Logo`}
              width={160}
              height={160}
              priority
            />
          </div>
          <h1 className="mt-6 text-3xl font-semibold">{club.name}</h1>
          <p className="mt-2 text-gray-200">{t('login.welcome')}</p>
        </div>
      </header>

      {/* LOGIN CARD */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center">{t('login.description')}</h2>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                {t('login.emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                {t('login.passwordLabel')}
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                >
                  {showPassword ? t('login.hidePassword') : t('login.showPassword')}
                </button>
              </div>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={isLoading} className="w-full py-2">
              {isLoading ? t('login.signingIn') : t('login.signIn')}
            </button>
            <p className="text-center text-sm">
              <Link href="/forgot-password">{t('login.forgotPassword')}</Link>
            </p>
          </form>

          <p className="mt-6 text-center text-gray-400 text-sm">
            B2B Sport © {new Date().getFullYear()}
          </p>
        </div>
      </main>
    </div>
  );
}
