import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to login page from root
  redirect('/club-login');

  // This won't be reached due to the redirect
  return null;
}
