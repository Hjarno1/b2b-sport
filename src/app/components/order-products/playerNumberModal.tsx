<<<<<<< HEAD
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
=======
import React from 'react';
import { Product } from '@/lib/data/mock-data';
>>>>>>> main

interface Props {
  tempNumbers: string[];
  setTempNumbers: (nums: string[]) => void;
  onCancel: () => void;
  onConfirm: () => void;
<<<<<<< HEAD
=======
  activeProduct: Product;
>>>>>>> main
}

const PlayerNumberModal: React.FC<Props> = ({
  tempNumbers,
  setTempNumbers,
  onCancel,
  onConfirm,
}) => {
<<<<<<< HEAD
  const { t } = useTranslation('playerNumberModal');

  const handleChange = (index: number, value: string) => {
    // Only numeric, max 3 digits
    const sanitized = value.replace(/\D/g, '').slice(0, 3);
    const newNums = [...tempNumbers];
    newNums[index] = sanitized;
    setTempNumbers(newNums);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-auto shadow-lg">
        <h3 className="text-2xl font-semibold text-center mb-4">
          {t('player_number_modal.title')}
        </h3>
        {/* Flex-wrap container prevents off-screen overflow */}
        <div className="flex flex-wrap justify-center gap-4 max-h-[60vh] overflow-auto p-2">
=======
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg">
        <h3 className="text-lg font-semibold">Enter player numbers</h3>
        <div className="grid grid-cols-2 gap-2">
>>>>>>> main
          {tempNumbers.map((num, i) => (
            <input
              key={i}
              type="text"
<<<<<<< HEAD
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={3}
              className="border rounded w-16 p-2 text-center"
              placeholder={t('player_number_modal.placeholder', { index: i + 1 })}
              value={num}
              onChange={(e) => handleChange(i, e.target.value)}
            />
          ))}
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" onClick={onCancel}>
            {t('player_number_modal.cancel')}
=======
              className="border p-2 rounded"
              placeholder={`#${i + 1}`}
              value={num}
              onChange={(e) => {
                const newNums = [...tempNumbers];
                newNums[i] = e.target.value;
                setTempNumbers(newNums);
              }}
            />
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" onClick={onCancel}>
            Cancel
>>>>>>> main
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={onConfirm}
          >
<<<<<<< HEAD
            {t('player_number_modal.confirm')}
=======
            Confirm
>>>>>>> main
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerNumberModal;
