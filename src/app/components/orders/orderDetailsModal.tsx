'use client';

import { Order, OrderStatus } from '@/lib/data/mock-data';
import React from 'react';

interface OrderDetailsModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
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
          📦 Order #{order.id}
        </h2>

        <div className="space-y-2 text-sm text-gray-700">
          <p><span className="font-medium">Status:</span> {order.status}</p>
          <p><span className="font-medium">Created:</span> {order.createdAt}</p>
          <p><span className="font-medium">Updated:</span> {order.updatedAt}</p>
          <p><span className="font-medium">Items:</span> {order.items}</p>
          <p><span className="font-medium">Player Count:</span> {order.playerCount}</p>
          <p><span className="font-medium">Progress:</span> {order.progress}%</p>

          {order.estimatedDelivery && (
            <p>
              <span className="font-medium">Estimated Delivery:</span> {order.estimatedDelivery}
            </p>
          )}
          {order.trackingNumber && (
            <p>
              <span className="font-medium">Tracking #:</span> {order.trackingNumber}
            </p>
          )}
        </div>

        {/* 🛍️ Products List */}
        {order.products && order.products.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🛍️ Ordered Products
            </h3>
            <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
              {order.products.map((product, index) => (
                <li key={index} className="px-4 py-3 bg-gray-50 hover:bg-gray-100 transition">
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-600">Price: {product.price} DKK</p>
                  {product.quantity && (
                    <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                  )}
                  {product.sizes && product.sizes.length > 0 && (
                    <p className="text-sm text-gray-600">Sizes: {product.sizes.join(', ')}</p>
                  )}
                  {product.sizes && product.sizes.length > 0 && (
                    <p className="text-sm text-gray-600">Player Numbers: {product.playerNumbers.join(', ')}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 🎯 Conditional Action Buttons */}
        {order.status === OrderStatus.Delivered && (
          <a
            href={`/pdf/${order.orderInvoice}`}
            download
            className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-800 transition"
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

        {order.status === OrderStatus.Processing && (
          <a
            href={`/pdf/${order.orderConfirmation}`}
            download
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


        <button
          onClick={onClose}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white font-semibold py-2 rounded-xl shadow-lg hover:from-gray-600 hover:to-gray-800 transition"
        >
          <span className="text-xl">❌</span>
          <span>Close</span>
        </button>

      </div>
    </div>
  );
}
