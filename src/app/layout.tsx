import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/context/auth-context';
import { CartProvider } from '@/app/providers/CartProvider';
import { I18nProvider } from '@/app/providers/I18nProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'B2B Sport',
  description: 'Platform for B2B Sport',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <I18nProvider>{children}</I18nProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
