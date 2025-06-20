// src/app/components/OrderDetailsModal.tsx
'use client';

import { Order, OrderStatus } from '@/lib/data/mock-data';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface OrderDetailsModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  const { t } = useTranslation('orderDetails');
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {t('order_details.title', { id: order.id })}
        </h2>

        <div className="space-y-2 text-sm text-gray-700">
          <p>{t('order_details.status', { status: order.status })}</p>
          <p>{t('order_details.created', { date: order.createdAt })}</p>
          <p>{t('order_details.updated', { date: order.updatedAt })}</p>
          <p>{t('order_details.items', { count: order.items })}</p>
          <p>{t('order_details.playerCount', { count: order.playerCount })}</p>
          <p>{t('order_details.progress', { percent: order.progress })}</p>

          {order.estimatedDelivery && (
            <p>{t('order_details.estimatedDelivery', { date: order.estimatedDelivery })}</p>
          )}
          {order.trackingNumber && (
            <p>{t('order_details.trackingNumber', { number: order.trackingNumber })}</p>
          )}
        </div>

        {/* 🛍️ Products List */}
        {order.products && order.products.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t('order_details.orderedProducts')}
            </h3>
            <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
              {order.products.map((product, index) => (
                <li key={index} className="px-4 py-3 bg-gray-50 hover:bg-gray-100 transition">
                  <p className="font-medium text-gray-800">{product.name}</p>
<<<<<<< HEAD
                  <p className="text-sm text-gray-600">
                    {t('order_details.price', { price: product.price })}
                  </p>
=======
                  <p className="text-sm text-gray-600">Price: {product.price} DKK</p>
>>>>>>> main
                  {product.quantity && (
                    <p className="text-sm text-gray-600">
                      {t('order_details.quantity', { count: product.quantity })}
                    </p>
                  )}
                  {product.sizes && product.sizes.length > 0 && (
                    <p className="text-sm text-gray-600">
                      {t('order_details.sizes', { list: product.sizes.join(', ') })}
                    </p>
                  )}
                  {product.playerNumbers && product.playerNumbers.length > 0 && (
                    <p className="text-sm text-gray-600">
                      {t('order_details.playerNumbers', { list: product.playerNumbers.join(', ') })}
                    </p>
                  )}
                  {product.sizes && product.sizes.length > 0 && (
                    <p className="text-sm text-gray-600">Player Numbers: {product.playerNumbers.join(', ')}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Conditional Action Buttons */}
        {order.status === OrderStatus.Delivered && (
          <a
            href={`/pdf/${order.orderInvoice}`}
            download
            className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-800 transition"
<<<<<<< HEAD
          >
            <span className="text-xl">📄</span>
            <span>{t('order_details.downloadInvoice')}</span>
          </a>
        )}
=======
          >
            <span className="text-xl">📄</span>
            <span>Download Invoice</span>
          </a>
        )}

        {/* {order.status === OrderStatus.Delivered && (
          <button
            onClick={() => alert('Downloading Invoice... 🧾')}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-2 rounded-xl shadow-lg hover:from-green-600 hover:to-green-800 transition"
          >
            <span className="text-xl">📄</span>
            <span>Download Invoice</span>
          </button>
        )} */}

>>>>>>> main
        {order.status === OrderStatus.Processing && (
          <a
            href={`/pdf/${order.orderConfirmation}`}
            download
<<<<<<< HEAD
            className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-800 transition"
          >
            <span className="text-xl">📑</span>
            <span>{t('order_details.downloadConfirmation')}</span>
          </a>
        )}
=======
            className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-800 transition"
          >
            <span className="text-xl">📑</span>
            <span>Download Order Confirmation</span>
          </a>
        )}

        {/* {order.status === OrderStatus.Processing && (
          <button
            onClick={() => alert('Downloading Order Confirmation... 📬')}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-800 transition"
          >
            <span className="text-xl">📑</span>
            <span>Download Order Confirmation</span>
          </button>
        )} */}
>>>>>>> main

        <button
          onClick={onClose}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white font-semibold py-2 rounded-xl shadow-lg hover:from-gray-600 hover:to-gray-800 transition"
        >
          <span className="text-xl">❌</span>
          <span>{t('order_details.close')}</span>
        </button>
      </div>
    </div>
  );
}
