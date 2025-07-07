'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { winnerCodes } from '@/lib/data/mock-data';

export default function CodeEntryPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();

    if (!trimmed) {
      setError('Indtast venligst en kode');
      return;
    }

    const entry = winnerCodes[trimmed];
    if (!entry || entry.used) {
      setError('Ugyldig eller allerede brugt kode');
      return;
    }

    router.push(`/rhk/ribecupvinder2025/${trimmed}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* Ribe HK Branding */}
      <div className="mb-10">
        <Image
          src="/clubs/ribehk.png"
          alt="Ribe HK"
          width={180}
          height={90}
          className="object-contain"
        />
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-[#4a86e8] mb-4 text-center">
          Indtast din vinderkode
        </h1>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Fx: RHK2025WIN"
          className="w-full p-3 border border-gray-300 rounded mb-3 text-lg"
        />

        {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-[#4a86e8] text-white p-3 rounded font-semibold hover:bg-blue-700 transition"
        >
          Gå videre
        </button>
      </form>
    </div>
  );
}
