// src/app/validate-order-staff/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Order, OrderProducts, OrderStatus, mockProducts } from '@/lib/data/mock-data';
import { useCart } from '@/app/providers/CartProvider';
import { useSubmitOrder } from '@/lib/hooks/useSubmitOrder';

/**
 * Cart snapshot kept in localStorage while staff reviews the order.
 */
interface OrderItemLS {
  id: number;
  name: string;
  size: string;
  quantity: number;
  numbers?: string[];
}

export default function ValidateOrderStaffPage() {
  /* ------------------------------------------------------------------
   * Hooks & i18n helpers
   * ----------------------------------------------------------------*/
  const { clear: clearCart } = useCart();
  const { t } = useTranslation('validate_order');
  const router = useRouter();

  /* ------------------------------------------------------------------
   * Component state
   * ----------------------------------------------------------------*/
  const [orderList, setOrderList] = useState<OrderItemLS[]>([]);
  const [addressMode, setAddressMode] = useState<'default' | 'custom'>('default');
  const [submitted, setSubmitted] = useState(false);

  const [customAddress, setCustomAddress] = useState({
    recipient: '',
    street: '',
    zip: '',
    city: '',
  });

  /* ------------------------------------------------------------------
   * Restore cart snapshot on first render
   * ----------------------------------------------------------------*/
  useEffect(() => {
    const stored = localStorage.getItem('orderList');
    if (stored) setOrderList(JSON.parse(stored));
  }, []);

  /* ------------------------------------------------------------------
   * Re‑use the shared submission hook → /api/requests
   * ----------------------------------------------------------------*/
  const submitOrder = useSubmitOrder(
    clearCart,
    setOrderList as unknown as (o: Order[]) => void,
    setSubmitted,
  );

  /* ------------------------------------------------------------------
   * Convert UI cart → rich Order payload, POST, then clear cart
   * ----------------------------------------------------------------*/
  const handleSendOrder = () => {
    const now = new Date();

    const products: OrderProducts[] = orderList.map((item) => {
      const cat = mockProducts.find((p) => p.id === item.id);
      return {
        id: item.id,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: cat?.price ?? 0,
        images: cat?.images ?? [],
        customizable: cat?.customizable ?? false,
        playerNumbers: (item.numbers || []).map(Number),
      };
    });

    const newOrder: Order = {
      id: Date.now().toString(),
      agreementId: '',
      clubId: '',
      teamId: '',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      status: OrderStatus.Pending,
      items: products.length,
      playerCount: products.reduce((s, p) => s + p.quantity, 0),
      progress: 0,
      total: products.reduce((s, p) => s + p.price * p.quantity, 0),
      products,
    };

    submitOrder(newOrder);
  };

  /* ------------------------------------------------------------------
   * 1️⃣  SUCCESS STATE — order accepted
   * ----------------------------------------------------------------*/
  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">{t('validate_order.thanksTitle')}</h1>
        <p className="text-lg">{t('validate_order.thanksSubtitle')}</p>
      </div>
    );
  }

  /* ------------------------------------------------------------------
   * 2️⃣  NORMAL STATE — review & send order
   * ----------------------------------------------------------------*/
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t('validate_order.pageTitle')}</h1>

      {/* ░░░ Shipping address ░░░ */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{t('validate_order.delivery.selectTitle')}</h2>

        <select
          className="p-2 border rounded w-full"
          value={addressMode}
          onChange={(e) => setAddressMode(e.target.value as 'default' | 'custom')}
        >
          <option value="default">{t('validate_order.delivery.default')}</option>
          <option value="custom">{t('validate_order.delivery.custom')}</option>
        </select>

        {addressMode === 'default' ? (
          <div className="bg-gray-100 p-4 rounded space-y-1">
            <p className="font-medium">{t('validate_order.delivery.defaultName')}</p>
            <p>{t('validate_order.delivery.staffContact')}</p>
            <p>{t('validate_order.delivery.defaultStreet')}</p>
            <p>{t('validate_order.delivery.defaultCity')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              className="w-full p-2 border rounded bg-gray-100 text-gray-700"
              value={t('validate_order.delivery.defaultName')}
              readOnly
            />
            <input
              type="text"
              placeholder={t('validate_order.delivery.placeholders.recipient')}
              className="w-full p-2 border rounded"
              value={customAddress.recipient}
              onChange={(e) =>
                setCustomAddress({
                  ...customAddress,
                  recipient: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder={t('validate_order.delivery.placeholders.street')}
              className="w-full p-2 border rounded"
              value={customAddress.street}
              onChange={(e) => setCustomAddress({ ...customAddress, street: e.target.value })}
            />
            <input
              type="text"
              placeholder={t('validate_order.delivery.placeholders.zip')}
              className="w-full p-2 border rounded"
              value={customAddress.zip}
              onChange={(e) => setCustomAddress({ ...customAddress, zip: e.target.value })}
            />
            <input
              type="text"
              placeholder={t('validate_order.delivery.placeholders.city')}
              className="w-full p-2 border rounded"
              value={customAddress.city}
              onChange={(e) => setCustomAddress({ ...customAddress, city: e.target.value })}
            />
          </div>
        )}
      </section>

      {/* ░░░ Order review ░░░ */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">{t('validate_order.order.yourOrder')}</h2>
        <ul className="space-y-2">
          {orderList.map((item, idx) => (
            <li key={idx} className="p-3 border rounded bg-gray-100 space-y-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm">
                {t('validate_order.order.size')}: {item.size}
              </p>
              <p className="text-sm">
                {t('validate_order.order.quantity')}: {item.quantity}
              </p>
              {item.numbers?.length ? (
                <p className="text-sm">
                  {t('validate_order.order.numbers')}: {item.numbers.join(', ')}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      {/* ░░░ Actions ░░░ */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          {t('validate_order.buttons.back')}
        </button>
        <button
          type="button"
          onClick={handleSendOrder}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {t('validate_order.buttons.send')}
        </button>
      </div>
    </div>
  );
}
