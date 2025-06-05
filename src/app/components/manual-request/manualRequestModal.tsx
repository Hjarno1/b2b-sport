'use client';

import { useState } from 'react';

export default function ManualRequestModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [request, setRequest] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!request.trim()) {
      alert('Please enter your request before submitting.');
      return;
    }

    if (!deadline) {
      alert('Please select a deadline.');
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
            <h2 className="text-xl font-semibold mb-2">Manual Request</h2>
            <p className="mb-4 text-sm text-gray-600">
              Please describe what you need. Our team will contact you within 48 hours.
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1">Request Details</label>
            <textarea
              className="w-full h-32 p-2 border rounded mb-4"
              placeholder="What are you looking for?"
              value={request}
              onChange={(e) => setRequest(e.target.value)}
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline - When do you need it?
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
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Send Request
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-green-600 font-medium">
              Thank you for your request – You will hear from us within 48 hours.
            </p>
            <div className="mt-4 text-right">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
