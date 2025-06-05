'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function InvitePage() {
  const params = useParams();
  const token = params?.id as string | undefined; // ✅ change from 'token' to 'id'
  const [playerData, setPlayerData] = useState<any | null>(null);

  useEffect(() => {
    if (!token) return;

    const invites = JSON.parse(localStorage.getItem('playerInvites') || '{}');

    const data = invites[token];
    setPlayerData(data);

  }, [token]);

  if (!playerData) return <p className="p-8">Invalid or expired invite 😢</p>;

  console.log(playerData)

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">👤 Fill Out Your Player Info</h1>
      {playerData.fields.map((field: any) => {

      return (
        <div key={field.id} className="mb-4">
          <label className="block font-medium mb-1">
            {field.name} {field.required && <span className="text-red-500">*</span>}
          </label>

          {field.type === 'select' ? (
            <select
              defaultValue=""
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="">Select {field.name}</option>
              {field.options?.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type === 'number' ? 'number' : 'text'}
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              placeholder={field.description}
            />
          )}

          {field.description && (
            <p className="mt-1 text-xs text-gray-500">{field.description}</p>
          )}
        </div>
      );
    })}


      <button className="mt-4 bg-primary text-white px-4 py-2 rounded">Submit</button>
    </div>
  );
}
