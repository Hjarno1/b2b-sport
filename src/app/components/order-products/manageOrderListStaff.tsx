'use client';

import React, { useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { OrderItem } from '@/lib/data/mock-data';

interface Props {
  orderList: OrderItem[];
  updateItem: (index: number, field: keyof OrderItem, value: string | number) => void;
  updatePlayerNumber: (itemIndex: number, numIndex: number, value: string) => void;
  scrollToItem: (index: number) => void;
  handleRemoveFromCart: (index: number) => void;
}

const ManageOrderListStaff: React.FC<Props> = ({
  orderList,
  updateItem,
  updatePlayerNumber,
  scrollToItem,
  handleRemoveFromCart,
}) => {
  const { t } = useTranslation('manageOrderStaff');
  const [modalItemIndex, setModalItemIndex] = useState<number | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});

  const handleOpenSizeModal = (index: number) => {
    setModalItemIndex(index);
    const current = orderList[index];
    const sizesMap: Record<string, number> = {};
    current.sizes?.forEach((size) => {
      sizesMap[size] = 0;
    });
    setSelectedSizes(sizesMap);
  };

  const handleSizeQuantityChange = (size: string, value: string) => {
    setSelectedSizes((prev) => ({ ...prev, [size]: Number(value) }));
  };

  const handleConfirmSizes = () => {
    if (modalItemIndex === null) return;
    const total = Object.values(selectedSizes).reduce((sum, v) => sum + v, 0);
    updateItem(modalItemIndex, 'quantity', total);
    setModalItemIndex(null);
  };

  return (
    <>
      <h2 className="text-xl font-semibold mt-10">{t('manage_order_staff.title')}</h2>
      <ul className="space-y-2">
        {orderList.map((item, index) => (
          <li
            key={item.id || index}
            className="flex flex-col sm:flex-row justify-between items-center gap-4 border p-3 rounded bg-gray-100"
          >
            <div className="flex-1 flex flex-wrap items-center gap-2 text-sm text-gray-800">
              <input
                type="number"
                value={item.quantity ?? ''}
                onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                className="w-12 p-1 border rounded text-center"
                min={1}
              />
              x <span className="font-semibold">{item.name}</span>
              {item.size && (
                <span className="font-semibold">
                  {t('manage_order_staff.inSize')} {item.size}
                </span>
              )}
              {item.sizes && (
                <button
                  className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded"
                  onClick={() => handleOpenSizeModal(index)}
                >
                  {t('manage_order_staff.selectSizes')}
                </button>
              )}
              {item.customizable &&
                item.numbers?.map((num, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i === 0 && <span>{t('manage_order_staff.withPlayerNumber')}</span>}
                    <input
                      type="text"
                      value={num}
                      onChange={(e) => updatePlayerNumber(index, i, e.target.value)}
                      className="w-12 p-1 border rounded"
                    />
                  </span>
                ))}
            </div>

            <div className="flex gap-2">
              <Trash2
                className="text-red-500 cursor-pointer"
                onClick={() => handleRemoveFromCart(index)}
              />
              <Pencil
                className="text-blue-500 cursor-pointer"
                onClick={() => scrollToItem(index)}
              />
            </div>
          </li>
        ))}
      </ul>

      {/* Size-selection modal */}
      {modalItemIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">{t('manage_order_staff.modalTitle')}</h3>
            {orderList[modalItemIndex]?.sizes?.map((size) => (
              <div key={size} className="flex justify-between items-center mb-2">
                <span>{size}</span>
                <input
                  type="number"
                  min={0}
                  className="w-16 p-1 border rounded"
                  value={selectedSizes[size] ?? 0}
                  onChange={(e) => handleSizeQuantityChange(size, e.target.value)}
                />
              </div>
            ))}
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-3 py-1 border rounded" onClick={() => setModalItemIndex(null)}>
                {t('manage_order_staff.cancel')}
              </button>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded"
                onClick={handleConfirmSizes}
              >
                {t('manage_order_staff.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageOrderListStaff;
