'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function InvitePage() {
  const { t } = useTranslation('invite');
  const params = useParams();
  const token = params?.id as string | undefined;
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);

  type Field = {
    id: string;
    name: string;
    type: 'text' | 'number' | 'select';
    required?: boolean;
    description?: string;
    options?: string[];
  };

  type PlayerData = {
    fields: Field[];
  };

  useEffect(() => {
    if (!token) return;

    const invites = JSON.parse(localStorage.getItem('playerInvites') || '{}');
    const data = invites[token];
    setPlayerData(data);
  }, [token]);

  if (!playerData) return <p className="p-8">{t('invite.invalid_invite')}</p>;

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">{t('invite.fill_title')}</h1>

      {playerData.fields.map((field: Field) => (
        <div key={field.id} className="mb-4">
          <label className="block font-medium mb-1">
            {field.name} {field.required && <span className="text-red-500">*</span>}
          </label>

          {field.type === 'select' ? (
            <select
              defaultValue=""
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="">{t('invite.select_placeholder', { name: field.name })}</option>
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

          {field.description && <p className="mt-1 text-xs text-gray-500">{field.description}</p>}
        </div>
      ))}

      <button className="mt-4 bg-primary text-white px-4 py-2 rounded">{t('invite.submit')}</button>
    </div>
  );
}
