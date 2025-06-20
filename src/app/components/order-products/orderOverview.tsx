<<<<<<< HEAD
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
=======
import React from 'react';
>>>>>>> main
import { OrderItem } from '@/lib/data/mock-data';
import { Trash2, Pencil } from 'lucide-react';

interface Props {
  orderList: OrderItem[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
  showIcons?: boolean;
}

<<<<<<< HEAD
const OrderOverview: React.FC<Props> = ({ orderList, onEdit, onRemove, showIcons = true }) => {
  const { t } = useTranslation('orderOverview');

  return (
    <aside className="w-full md:w-1/3 lg:w-1/4 bg-gray-50 p-4 border-l border-gray-200">
      <h2 className="text-lg font-semibold mb-4">{t('order_overview.title')}</h2>
      <ul className="space-y-4">
        {orderList.map((item, index) => (
          <li
            key={index}
            className="p-2 bg-white rounded shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">
                {t('order_overview.quantity')} {item.quantity}
              </p>
              {item.size && (
                <p className="text-sm text-gray-600">
                  {t('order_overview.size')} {item.size}
                </p>
              )}
              {(item.numbers?.length ?? 0) > 0 && (
                <p className="text-sm text-gray-600">
                  {t('order_overview.numbers')} {item.numbers!.join(', ')}
                </p>
              )}
            </div>
            {showIcons ? (
              <div className="flex gap-2">
                <Trash2 className="text-red-500 cursor-pointer" onClick={() => onRemove(index)} />
                <Pencil className="text-blue-500 cursor-pointer" onClick={() => onEdit(index)} />
              </div>
            ) : (
              <div className="text-sm font-semibold">
                {item.price * item.quantity} {t('order_overview.totalSuffix')}
              </div>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};
=======
const OrderOverview: React.FC<Props> = ({ orderList, onEdit, onRemove, showIcons = true }) => (
  <aside className="w-full md:w-1/3 lg:w-1/4 bg-gray-50 p-4 border-l border-gray-200">
    <h2 className="text-lg font-semibold mb-4">Order Overview</h2>
    <ul className="space-y-4">
      {orderList.map((item, index) => (
        <li
          key={index}
          className="p-2 bg-white rounded shadow-sm flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
            {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
            {(item.numbers?.length ?? 0) > 0 && (
              <p className="text-sm text-gray-600">Numbers: {item.numbers!.join(', ')}</p>
            )}
          </div>
          {showIcons && (
            <div className="flex gap-2">
              <Trash2 className="text-red-500 cursor-pointer" onClick={() => onRemove(index)} />
              <Pencil className="text-blue-500 cursor-pointer" onClick={() => onEdit(index)} />
            </div>
          )}
          {!showIcons && (
            <div className="text-sm font-semibold">{item.price * item.quantity} DKK</div>
          )}
        </li>
      ))}
    </ul>
  </aside>
);
>>>>>>> main

export default OrderOverview;
