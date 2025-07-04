'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { mockClubs } from '@/lib/data/mock-data';

export default function ForgotPasswordPage() {
  const club = mockClubs[0];
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setIsLoading(false);
    setMessage(t('forgotPassword.messageSent'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
          <h1 className="mt-6 text-3xl font-semibold">{t('forgotPassword.title')}</h1>
          <p className="mt-2 text-gray-200">{t('forgotPassword.subtitle')}</p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          {message ? (
            <p className="text-green-600 text-center">{message}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t('forgotPassword.emailLabel')}
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
              <button type="submit" disabled={isLoading} className="w-full py-2">
                {isLoading ? t('forgotPassword.sending') : t('forgotPassword.sendLink')}
              </button>
              <p className="text-center text-sm">
                <Link href="/club-login">{t('forgotPassword.backToSignIn')}</Link>
              </p>
            </form>
          )}

          <p className="mt-6 text-center text-gray-400 text-sm">
            {t('forgotPassword.footer', { year: new Date().getFullYear() })}
          </p>
        </div>
      </main>
    </div>
  );
}
