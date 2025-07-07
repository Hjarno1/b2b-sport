import { redirect } from 'next/navigation';

export default function LoginRedirectPage() {
  redirect('/club-login');
}

//BELOW IS THE ORIGINAL LOGIN PAGE CODE

// 'use client';
// export const dynamic = 'force-dynamic';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { LogIn } from 'lucide-react';
// import { UserRole } from '@/lib/data/mock-data';
// import { useAuth } from '@/lib/context/auth-context';
// import Image from 'next/image';
// import { useTranslation } from 'react-i18next';

// export default function LoginPage() {
//   const [role, setRole] = useState<UserRole>(UserRole.ClubAdmin);
//   const [email, setEmail] = useState(''); // ← added
//   const [password, setPassword] = useState(''); // ← added
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();
//   const { login } = useAuth();
//   const { t } = useTranslation();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       await login(email, password); // ← use email/password
//       router.push('/dashboard');
//     } catch (err) {
//       console.error('Login error:', err);
//       setError(t('login.error'));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       {/* Header with logo */}
//       <div className="py-6 border-b bg-white">
//         <div className="max-w-md mx-auto px-4 flex justify-center">
//           <Image src="/logo.png" alt="B2B Sport Logo" width={143} height={40} />
//         </div>
//       </div>

//       <div className="flex-1 flex items-center justify-center p-4">
//         <div className="w-full max-w-md">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
//             <div className="text-center mb-8">
//               <h1 className="text-2xl font-bold text-gray-900">{t('login.welcome')}</h1>
//               <p className="mt-2 text-gray-500 text-sm">{t('login.description')}</p>
//             </div>

//             {error && (
//               <div className="p-3 mb-6 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Role selector */}
//               <div>
//                 <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
//                   {t('login.select_role')}
//                 </label>
//                 <div className="relative">
//                   <select
//                     id="role"
//                     value={role}
//                     onChange={(e) => setRole(e.target.value as UserRole)}
//                     className="w-full text-gray-900 bg-white border border-gray-300 rounded-md py-2.5 pl-3 pr-10 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
//                   >
//                     <option value={UserRole.ClubAdmin}>{t('club_roles.club_admin')}</option>
//                     <option value={UserRole.ClubStaff}>{t('club_roles.club_staff')}</option>
//                     <option value={UserRole.ClubFinance}>{t('club_roles.club_finance')}</option>
//                   </select>
//                   <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                     <svg
//                       className="h-4 w-4 text-gray-400"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//                 <p className="mt-2 text-xs text-gray-500">{t('login.demo_note')}</p>
//               </div>

//               {/* Email field */}
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                   {t('login.emailLabel')}
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
//                 />
//               </div>

//               {/* Password field */}
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                   {t('login.passwordLabel')}
//                 </label>
//                 <input
//                   id="password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
//                 />
//               </div>

//               {/* Demo credentials */}
//               <div className="rounded-md bg-gray-50 p-4 border border-gray-100">
//                 <h3 className="text-sm font-medium text-gray-700">{t('login.demo_credentials')}</h3>
//                 <p className="mt-1 text-xs text-gray-500">
//                   {t('login.demo_email')}
//                   <br />
//                   {t('login.demo_password')}
//                 </p>
//               </div>

//               {/* Submit */}
//               <div>
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
//                     isLoading ? 'opacity-70 cursor-not-allowed' : ''
//                   }`}
//                 >
//                   {isLoading ? (
//                     <span className="flex items-center">
//                       <svg
//                         className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         />
//                       </svg>
//                       {t('login.signing_in')}
//                     </span>
//                   ) : (
//                     <>
//                       <LogIn className="w-5 h-5 mr-2" />
//                       <span>{t('login.sign_in')}</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//           <div className="text-center mt-6">
//             <p className="text-sm text-gray-500">
//               {t('login.copyright', { year: new Date().getFullYear() })}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
