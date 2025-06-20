'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ManualRequestModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation('manualRequest');
  const [request, setRequest] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!request.trim()) {
      alert(t('alertEnterRequest'));
      return;
    }

    if (!deadline) {
      alert(t('alertSelectDeadline'));
      return;
    }

    setSubmitted(true);
    setRequest('');
    setDeadline('');
    // Optionally send data to an API
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        {!submitted ? (
          <>
            <h2 className="text-xl font-semibold mb-2">{t('manual_request.title')}</h2>
            <p className="mb-4 text-sm text-gray-600">{t('manual_request.description')}</p>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('manual_request.requestDetailsLabel')}
            </label>
            <textarea
              className="w-full h-32 p-2 border rounded mb-4"
              placeholder={t('manual_request.requestPlaceholder')}
              value={request}
              onChange={(e) => setRequest(e.target.value)}
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('manual_request.deadlineLabel')}
            </label>
            <input
              type="date"
              className="w-full p-2 border rounded mb-4"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-sm rounded hover:bg-gray-400"
              >
                {t('manual_request.back')}
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                {t('manual_request.sendRequest')}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-green-600 font-medium">{t('manual_request.thankYou')}</p>
            <div className="mt-4 text-right">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                {t('manual_request.close')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
