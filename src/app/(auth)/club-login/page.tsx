// src/app/(auth)/club-login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/lib/context/auth-context';
import { UserRole, mockClubs } from '@/lib/data/mock-data';

export default function ClubLoginPage() {
  const club = mockClubs[0];
  const { t } = useTranslation();
  const [role, setRole] = useState<UserRole>(UserRole.ClubAdmin);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(role);
      router.push('/dashboard');
    } catch {
      setError('Failed to login. Please try again.');
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
              className="rounded-full"
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

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Role select */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                {t('login.select_role')}
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value={UserRole.ClubAdmin}>{t('club_roles.club_admin')}</option>
                <option value={UserRole.ClubStaff}>{t('club_roles.club_staff')}</option>
                <option value={UserRole.ClubFinance}>{t('club_roles.club_finance')}</option>
              </select>
            </div>

            {/* Demo creds */}
            <div className="rounded-lg bg-gray-100 p-4 text-sm text-gray-600">
              <p>
                <span className="font-medium">{t('login.demo_credentials')}</span>
              </p>
              <p>{t('login.demo_email')}</p>
              <p>{t('login.demo_password')}</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg text-white font-medium shadow-md ${
                isLoading
                  ? 'bg-blue-400 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              } flex justify-center items-center`}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  {t('login.sign_in')}
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400 text-sm">
            B2B Sport © {new Date().getFullYear()}
          </p>
        </div>
      </main>
    </div>
  );
}
