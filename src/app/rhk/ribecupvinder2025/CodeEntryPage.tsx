'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { winnerCodes } from '@/lib/data/mock-data';

export default function CodeEntryPage() {
  const router = useRouter();
  const [segments, setSegments] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const inputs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleSegmentChange = (i: number, val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    const newSegments = [...segments];
    newSegments[i] = cleaned;
    setSegments(newSegments);

    if (cleaned.length === 4 && i < 3) {
      inputs[i + 1].current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === 'Backspace' && segments[i] === '' && i > 0) {
      inputs[i - 1].current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (segments.some((s) => s.length < 4)) {
      setError('Alle felter skal udfyldes');
      return;
    }

    const code = segments.join('');
    const entry = winnerCodes[code];

    if (!entry || entry.used) {
      setError('Ugyldig eller allerede brugt kode');
      return;
    }

    router.push(`/rhk/ribecupvinder2025/${code}`);
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

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#4a86e8] mb-6 text-center">Indtast din kode her</h1>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center">
              <input
                ref={inputs[i]}
                type="text"
                value={seg}
                onChange={(e) => handleSegmentChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                maxLength={4}
                className="w-16 sm:w-20 p-3 border border-gray-300 rounded text-center text-lg tracking-widest"
              />
              {i < segments.length - 1 && (
                <span className="mx-2 text-xl font-semibold text-gray-500">-</span>
              )}
            </div>
          ))}
        </div>

        {error && <p className="text-red-600 mb-3 text-sm text-center">{error}</p>}

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
