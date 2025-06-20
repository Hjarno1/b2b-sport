import React from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { OrderItem } from '@/lib/data/mock-data';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  orderList: OrderItem[];
  handleRemoveFromCart: (index: number) => void;
  scrollToItem: (index: number) => void;
}

export default function Sidebar({ orderList, handleRemoveFromCart, scrollToItem }: SidebarProps) {
  const { t } = useTranslation();

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
              {/* Always show quantity */}
              <p className="text-sm text-gray-600">
                {t('order_overview.quantity', { count: item.quantity })}
              </p>
              {/* Only show size if it exists */}
              {item.size != null && (
                <p className="text-sm text-gray-600">
                  {t('order_overview.size', { size: item.size })}
                </p>
              )}
              {/* Only show numbers if present */}
              {item.numbers && item.numbers.length > 0 && (
                <p className="text-sm text-gray-600">
                  {t('order_overview.numbers', { numbers: item.numbers.join(', ') })}
                </p>
              )}
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
    </aside>
  );
}
