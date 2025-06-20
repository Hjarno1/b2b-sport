'use client';

<<<<<<< HEAD
import React, { useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
=======
import React from 'react';
import { Trash2, Pencil } from 'lucide-react';
>>>>>>> main
import type { OrderItem } from '@/lib/data/mock-data';

interface Props {
  orderList: OrderItem[];
  updateItem: (index: number, field: keyof OrderItem, value: string | number) => void;
  updatePlayerNumber: (itemIndex: number, numIndex: number, value: string) => void;
  scrollToItem: (index: number) => void;
  handleRemoveFromCart: (index: number) => void;
}

const ManageOrderList: React.FC<Props> = ({
  orderList,
  updateItem,
  updatePlayerNumber,
  scrollToItem,
  handleRemoveFromCart,
}) => {
<<<<<<< HEAD
  const { t } = useTranslation('manageOrder');
  const [modalItemIndex, setModalItemIndex] = useState<number | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});

  const handleOpenSizeModal = (index: number) => {
    setModalItemIndex(index);
    const currentItem = orderList[index];
    const initialSizes: Record<string, number> = {};
    currentItem.sizes?.forEach((size) => {
      initialSizes[size] = 0;
    });
    setSelectedSizes(initialSizes);
  };

  const handleSizeQuantityChange = (size: string, value: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [size]: Number(value),
    }));
  };

  const handleConfirmSizes = () => {
    if (modalItemIndex === null) return;
    const totalQuantity = Object.values(selectedSizes).reduce((sum, val) => sum + val, 0);
    updateItem(modalItemIndex, 'quantity', totalQuantity);
    setModalItemIndex(null);
  };

=======
>>>>>>> main
  const totalPrice = orderList.reduce((sum, item) => sum + item.price * (item.quantity || 0), 0);

  return (
    <>
<<<<<<< HEAD
      <h2 className="text-xl font-semibold mt-10">{t('manage_order.title')}</h2>
=======
      <h2 className="text-xl font-semibold mt-10">Manage Order</h2>
>>>>>>> main
      <ul className="space-y-2">
        {orderList.map((item, index) => (
          <li
            key={index}
            className="flex flex-col sm:flex-row justify-between items-center gap-4 border p-3 rounded bg-gray-100"
          >
            <div className="flex-1 flex flex-wrap items-center gap-2 text-sm text-gray-800">
              <input
                type="number"
                value={item.quantity ?? ''}
                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
<<<<<<< HEAD
                className="w-12 p-1 border rounded text-center"
                min={1}
              />
              x <span className="font-semibold">{item.name}</span>
              {item.size && <span className="font-semibold">in size {item.size}</span>}
              {item.customizable &&
                item.numbers?.map((num, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i === 0 && <span>{t('manage_order.withPlayerNumber')}</span>}
=======
                className="w-8 p-1 border rounded text-center"
                min={1}
              />
              x <span className="font-semibold">{item.name}</span>
              {item.size && (
                <>
                  in size
                  <select
                    className="p-1 border rounded"
                    value={item.size}
                    onChange={(e) => updateItem(index, 'size', e.target.value)}
                  >
                    {item.sizes?.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </>
              )}
              {item.customizable &&
                item.numbers?.map((num, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i === 0 && <span>with player number</span>}
>>>>>>> main
                    <input
                      type="text"
                      value={num}
                      onChange={(e) => updatePlayerNumber(index, i, e.target.value)}
                      className="w-12 p-1 border rounded"
                    />
                  </span>
                ))}
<<<<<<< HEAD
              {item.sizes && (
                <button
                  className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded"
                  onClick={() => handleOpenSizeModal(index)}
                >
                  {t('manage_order.selectSizes')}
                </button>
              )}
=======
>>>>>>> main
              <span className="ml-auto font-semibold">
                = {item.price * (item.quantity || 0)} DKK
              </span>
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
<<<<<<< HEAD

      <div className="text-right text-lg font-semibold mt-4">
        {t('manage_order.total')}: {totalPrice} DKK
      </div>

      {/* Modal */}
      {modalItemIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">{t('manage_order.modalTitle')}</h3>
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
                {t('manage_order.cancel')}
              </button>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded"
                onClick={handleConfirmSizes}
              >
                {t('manage_order.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
=======
      <div className="text-right text-lg font-semibold mt-4">Total: {totalPrice} DKK</div>
>>>>>>> main
    </>
  );
};

export default ManageOrderList;
