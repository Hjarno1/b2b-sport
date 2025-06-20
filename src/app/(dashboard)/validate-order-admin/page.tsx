// src/app/validate-order/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { mockProducts, Order, OrderProducts, OrderStatus } from '@/lib/data/mock-data';
import { useCart } from '@/app/providers/CartProvider';

interface OrderItem {
  id: number;
  name: string;
  size: string;
  quantity: number;
  numbers?: string[];
  price: number;
}

export default function ValidateOrderPage() {
  const { clear: clearCart } = useCart();
  const { t } = useTranslation('validate_order');
  const router = useRouter();
  const [orderList, setOrderList] = useState<OrderItem[]>([]);
  const [addressMode, setAddressMode] = useState<'default' | 'custom'>('default');
  const [submitted, setSubmitted] = useState(false);

  const [customAddress, setCustomAddress] = useState({
    recipient: '',
    street: '',
    zip: '',
    city: '',
  });

  useEffect(() => {
    const storedOrder = localStorage.getItem('orderList');
    if (storedOrder) setOrderList(JSON.parse(storedOrder));
  }, []);

  const handleSendOrder = () => {
    clearCart();

    const fmt = (iso: string) =>
      new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    const products: OrderProducts[] = orderList.map((item) => {
      const info = mockProducts.find((p) => p.id === item.id);
      return {
        id: item.id,
        name: item.name,
        images: info?.images || [],
        sizes: [item.size],
        customizable: !!item.numbers?.length,
        size: [item.size],
        quantity: item.quantity,
        playerNumbers: (item.numbers || []).map(Number),
        price: item.price * item.quantity,
      };
    });

    const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
    const newOrder: Order = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      agreementId: 'demo-agreement-id',
      clubId: 'club-001',
      teamId: 'team-003',
      createdAt: fmt(new Date().toISOString()),
      updatedAt: fmt(new Date().toISOString()),
      status: OrderStatus.Pending,
      items: products.reduce((sum, p) => sum + p.quantity, 0),
      playerCount: products.reduce((sum, p) => sum + p.playerNumbers.length, 0),
      progress: 0,
      total: totalPrice,
      products,
    };

    const existing = JSON.parse(localStorage.getItem('submittedOrders') || '[]');
    localStorage.setItem('submittedOrders', JSON.stringify([...existing, newOrder]));

    setSubmitted(true);
    localStorage.removeItem('orderList');
    localStorage.removeItem('cart');
    setOrderList([]);
  };

  const totalPrice = orderList.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">{t('validate_order.thanksTitle')}</h1>
        <p className="text-lg">{t('validate_order.thanksSubtitle')}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t('validate_order.pageTitle')}</h1>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{t('validate_order.delivery.selectTitle')}</h2>
        <select
          className="p-2 border rounded w-full"
          value={addressMode}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setAddressMode(e.target.value as 'default' | 'custom')
          }
        >
          <option value="default">{t('validate_order.delivery.default')}</option>
          <option value="custom">{t('validate_order.delivery.custom')}</option>
        </select>

        {addressMode === 'default' ? (
          <div className="bg-gray-100 p-4 rounded space-y-1">
            <p className="font-medium">{t('validate_order.delivery.defaultName')}</p>
            <p>{t('validate_order.delivery.defaultContact')}</p>
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
              onChange={(e) => setCustomAddress({ ...customAddress, recipient: e.target.value })}
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

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">{t('validate_order.order.yourOrder')}</h2>
        <ul className="space-y-2">
          {orderList.map((item, i) => (
            <li key={i} className="p-3 border rounded bg-gray-100">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm">
                {t('validate_order.order.size')}: {item.size}
              </p>
              <p className="text-sm">
                {t('validate_order.order.quantity')}: {item.quantity}
              </p>
              {item.numbers?.length && (
                <p className="text-sm">
                  {t('validate_order.order.numbers')}: {item.numbers.join(', ')}
                </p>
              )}
              <p className="text-sm">
                {t('validate_order.order.price')}: {item.price} DKK
              </p>
              <p className="text-sm font-semibold">
                {t('validate_order.order.subtotal')}: {item.price * item.quantity} DKK
              </p>
            </li>
          ))}
        </ul>
        <div className="text-right text-lg font-bold">
          {t('validate_order.order.total')}: {totalPrice} DKK
        </div>
      </section>

      <div className="flex justify-between">
        <button onClick={() => router.back()} className="btn-secondary">
          {t('validate_order.buttons.back')}
        </button>
        <button onClick={handleSendOrder} className="btn-primary">
          {t('validate_order.buttons.send')}
        </button>
      </div>
    </div>
  );
}
