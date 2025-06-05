'use client';

import React from 'react';
import { Trash2, Pencil } from 'lucide-react';
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
  const totalPrice = orderList.reduce((sum, item) => sum + item.price * (item.quantity || 0), 0);

  return (
    <>
      <h2 className="text-xl font-semibold mt-10">Manage Order</h2>
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
                    <input
                      type="text"
                      value={num}
                      onChange={(e) => updatePlayerNumber(index, i, e.target.value)}
                      className="w-12 p-1 border rounded"
                    />
                  </span>
                ))}
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
      <div className="text-right text-lg font-semibold mt-4">Total: {totalPrice} DKK</div>
    </>
  );
};

export default ManageOrderList;
