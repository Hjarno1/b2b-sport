import React from 'react';
import { Product } from '@/lib/data/mock-data';

interface Props {
  tempNumbers: string[];
  setTempNumbers: (nums: string[]) => void;
  onCancel: () => void;
  onConfirm: () => void;
  activeProduct: Product;
}

const PlayerNumberModal: React.FC<Props> = ({
  tempNumbers,
  setTempNumbers,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg">
        <h3 className="text-lg font-semibold">Enter player numbers</h3>
        <div className="grid grid-cols-2 gap-2">
          {tempNumbers.map((num, i) => (
            <input
              key={i}
              type="text"
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
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerNumberModal;
