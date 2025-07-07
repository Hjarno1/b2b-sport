'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { mockClubs } from '@/lib/data/mock-data';
import CollapsibleText from '@/components/collapsibleText';
import EmblaCarousel from '@/components/emblaCarousel';

// Groups dropdown options (10 total)
const groupOptions = [
  'U15 drenge 1. div.',
  'U15 drenge 2. div.',
  'U15 piger 1. div.',
  'U15 piger 2. div.',
  'U17 drenge 1. div.',
  'U17 drenge 2. div.',
  'U17 piger 1. div.',
  'U17 piger 2. div.',
  'U19 piger',
  'U19 drenge',
];

// Product details including multiple images and description
const products = [
  {
    id: 'LT91195',
    name: 'Powerbank 5000mAh med dit eget navn',
    image: '/products/powerbank.png',
    details: {
      images: ['/products/powerbank.png', '/products/powerbank-1.png'],
      description:
        'Ultratynd powerbank (5000mAh) med et stilfuldt design og flot mat finish. Denne powerbank er en god tilføjelse til dit mobile tilbehør.',
    },
  },
  {
    id: 'LT98826',
    name: 'Flaske 500ml med dit eget navn',
    image: '/products/rswing.png',
    details: {
      images: ['/products/rswing.png'],
      description:
        'Flaske i genanvendt rustfrit stål og med en buttery soft touch-finish. Den dobbeltvægget vakuumisolerede flaske holder drikkevarer kolde eller varme i længere tid og er lækagesikker til brug på farten.',
    },
  },
  {
    id: 'LT45805',
    name: 'Højtaler 5W med dit eget navn',
    image: '/products/muse-speaker.png',
    details: {
      images: [
        '/products/muse-speaker.png',
        '/products/muse-speaker-1.png',
        '/products/muse-speaker-2.png',
        '/products/muse-speaker-3.png',
      ],
      description:
        'Denne kompakte, bærbare bluetooth-højttaler har overraskende god lyd på trods af sin lille størrelse. Desuden giver stofbetrækket højttaleren et trendy udseende. Den ideelle højttaler til rejsen. Det indbyggede batteri oplades hurtigt og garanterer lang lyttetid. Oplad med det medfølgende USB-kabel.',
    },
  },
];
export default function ClientWinnerPage({ code }: { code: string }) {
  const club = mockClubs[0];
  const token = code;

  const [status, setStatus] = useState<'checking' | 'invalid' | 'used' | 'ready'>('checking');
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[0] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalProduct, setModalProduct] = useState<(typeof products)[0] | null>(null);
  const [group, setGroup] = useState('');
  const [clubName, setClubName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [printName, setPrintName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
  }, []);
  useEffect(() => {
    fetch(`/api/ribecup/validate?code=${token}`)
      .then((res) => res.json())
      .then(({ valid, used }) => {
        if (!valid) setStatus('invalid');
        else if (used) setStatus('used');
        else setStatus('ready');
      })
      .catch(() => setStatus('invalid'));
  }, [token]);

  if (status === 'checking')
    return <p className="text-center mt-16 text-lg">✨ Kontrollerer din kode… ✨</p>;
  if (status === 'invalid')
    return (
      <p className="text-center mt-16 text-red-600 font-bold">
        🚫 Ugyldig eller manglende kode! 🚫
      </p>
    );
  if (status === 'used')
    return <p className="text-center mt-16 text-gray-600">✅ Denne præmie er allerede indløst.</p>;
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <Image
            src={club.logo || '/placeholder-logo.png'}
            alt="Logo"
            width={120}
            height={120}
            className="mx-auto rounded-full"
          />
          <h2 className="mt-6 text-2xl font-bold">Tak, {firstName}!</h2>
          <p className="mt-2">
            Tak for dit valg og fordi du deltog i Ribe Cup 2025! Din præmie sendes til {clubName}{' '}
            (gruppe: {group}) senest d. 15.9.2025.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-red-200 to-pink-200 animate-gradient p-4">
      <header className="bg-yellow-400 shadow-lg rounded-lg p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-20 rotate-12">
          <Image src="/trophy.png" alt="Trophy" width={200} height={200} />
        </div>
        <Image
          src={club.logo || '/placeholder-logo.png'}
          alt="Logo"
          width={120}
          height={120}
          className="mx-auto "
        />
        <h1 className="mt-6 text-4xl font-extrabold text-white drop-shadow-lg">
          TILLYKKE RIBE CUP 2025
        </h1>
        <p className="mt-2 text-yellow-900 text-lg font-medium">
          Vælg din personlige præmie herunder
        </p>
      </header>

      <main className="max-w-5xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedProduct(p)}
            className={`cursor-pointer transform hover:scale-105 transition bg-white rounded-2xl shadow-2xl p-6 text-center relative ${
              selectedProduct?.id === p.id
                ? 'ring-4 ring-yellow-500 bg-yellow-50'
                : 'ring-4 ring-transparent'
            }`}
          >
            <div className="relative w-[180px] h-[180px] mx-auto">
              <Image src={p.image} alt={p.name} fill className="object-contain" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-gray-800 drop-shadow-md">{p.name}</h3>
            <button
              type="button"
              className="mt-2 text-sm text-indigo-600 hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                setModalProduct(p);
                setShowModal(true);
              }}
            >
              Se mere
            </button>
          </div>
        ))}
      </main>

      {showModal && modalProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden w-full max-w-lg max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{modalProduct.name}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            {/* Scrollable & Carousel */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              {/* collapsible description */}
              <CollapsibleText text={modalProduct.details.description} />
              {/* carousel for images */}
              <EmblaCarousel slides={modalProduct.details.images} />
            </div>
          </div>
        </div>
      )}

      <section className="max-w-lg mx-auto mt-12">
        {selectedProduct ? (
          <form
            className="bg-white rounded-2xl p-8 shadow-2xl space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              await fetch('/api/ribecup/redeem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  code: token,
                  productId: selectedProduct.id,
                  clubName,
                  firstName,
                  lastName,
                  printName,
                  group,
                }),
              });
              confetti({ particleCount: 200, spread: 100 });
              setSubmitted(true);
            }}
          >
            <h2 className="text-2xl font-bold text-gray-800">Din præmie: {selectedProduct.name}</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Klubbens navn</label>
              <input
                type="text"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vælg række</label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
              >
                <option value="" disabled>
                  Vælg række...
                </option>
                {groupOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Fornavn</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Efternavn</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ønsket navnetryk på min valgte præmie
              </label>
              <input
                type="text"
                value={printName}
                onChange={(e) => setPrintName(e.target.value)}
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-yellow-500 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-yellow-600 transition transform hover:scale-105"
            >
              Bekræft dit valg
            </button>
          </form>
        ) : (
          <p className="text-center text-xl font-medium text-gray-700">
            Vælg venligst en præmie ovenfor for at komme i gang!
          </p>
        )}
      </section>
    </div>
  );
}
