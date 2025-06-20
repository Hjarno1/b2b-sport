'use client';

import { useState } from 'react';
<<<<<<< HEAD
import { useTranslation } from 'react-i18next';
=======
>>>>>>> main

export default function ManualRequestModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
<<<<<<< HEAD
  const { t } = useTranslation('manualRequest');
=======
>>>>>>> main
  const [request, setRequest] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!request.trim()) {
<<<<<<< HEAD
      alert(t('alertEnterRequest'));
=======
      alert('Please enter your request before submitting.');
>>>>>>> main
      return;
    }

    if (!deadline) {
<<<<<<< HEAD
      alert(t('alertSelectDeadline'));
=======
      alert('Please select a deadline.');
>>>>>>> main
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
<<<<<<< HEAD
            <h2 className="text-xl font-semibold mb-2">{t('manual_request.title')}</h2>
            <p className="mb-4 text-sm text-gray-600">{t('manual_request.description')}</p>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('manual_request.requestDetailsLabel')}
            </label>
            <textarea
              className="w-full h-32 p-2 border rounded mb-4"
              placeholder={t('manual_request.requestPlaceholder')}
=======
            <h2 className="text-xl font-semibold mb-2">Manual Request</h2>
            <p className="mb-4 text-sm text-gray-600">
              Please describe what you need. Our team will contact you within 48 hours.
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1">Request Details</label>
            <textarea
              className="w-full h-32 p-2 border rounded mb-4"
              placeholder="What are you looking for?"
>>>>>>> main
              value={request}
              onChange={(e) => setRequest(e.target.value)}
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
<<<<<<< HEAD
              {t('manual_request.deadlineLabel')}
=======
              Deadline - When do you need it?
>>>>>>> main
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
<<<<<<< HEAD
                {t('manual_request.back')}
=======
                Back
>>>>>>> main
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
<<<<<<< HEAD
                {t('manual_request.sendRequest')}
=======
                Send Request
>>>>>>> main
              </button>
            </div>
          </>
        ) : (
          <>
<<<<<<< HEAD
            <p className="text-green-600 font-medium">{t('manual_request.thankYou')}</p>
=======
            <p className="text-green-600 font-medium">
              Thank you for your request – You will hear from us within 48 hours.
            </p>
>>>>>>> main
            <div className="mt-4 text-right">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
<<<<<<< HEAD
                {t('manual_request.close')}
=======
                Close
>>>>>>> main
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
