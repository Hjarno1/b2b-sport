// src/app/components/shared/notificationInformation.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Order } from '@/lib/data/mock-data';
import { formatDistanceToNow } from 'date-fns';

interface NotificationInformationProps {
  isOpen: boolean;
}

export default function NotificationInformation({ isOpen }: NotificationInformationProps) {
  const [submittedOrders, setSubmittedOrders] = useState<Order[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('submittedOrders');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSubmittedOrders(parsed);
        }
      } catch {
        setSubmittedOrders([]);
      }
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="p-4 border-b font-semibold text-gray-700">Latest Submitted Orders</div>
      <ul className="max-h-64 overflow-y-auto">
        {submittedOrders.length === 0 ? (
          <li className="p-4 text-gray-500 text-sm">No notifications</li>
        ) : (
          submittedOrders.map((order) => (
            <li key={order.id} className="px-4 py-3 hover:bg-gray-50 text-sm border-b last:border-none">
              <div className="font-medium text-gray-800">#{order.id}</div>
              <div className="text-gray-500">
                {order.items} items • {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
              </div>
              <div className="text-xs text-gray-400 italic">Status: {order.status}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
