'use client';

import { useEffect, useState } from 'react';
import { mockProducts, Order, OrderProducts, OrderStatus } from '@/lib/data/mock-data';

interface OrderItem {
  id: number;
  name: string;
  size: string;
  quantity: number;
  numbers?: string[];
  price: number;
}

export default function ValidateOrderPage() {
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
    if (storedOrder) {
      setOrderList(JSON.parse(storedOrder));
    }
  }, []);

  const handleSendOrder = () => {
    const formatDate = (isoDate: string) =>
      new Date(isoDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

    const products: OrderProducts[] = orderList.map((item) => {
      const productInfo = mockProducts.find((p) => p.id === item.id);
      return {
        id: item.id,
        name: item.name,
        images: productInfo?.images || [],
        sizes: [item.size],
        customizable: !!item.numbers?.length,
        size: [item.size],
        quantity: item.quantity,
        numbers: (item.numbers || []).map(Number),
        price: item.price * item.quantity,
      };
    });

    const totalPrice = products.reduce((sum, p) => sum + p.price, 0);

    const newOrder: Order = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      agreementId: 'demo-agreement-id',
      clubId: 'club-001',
      teamId: 'team-003',
      createdAt: formatDate(new Date().toISOString()),
      updatedAt: formatDate(new Date().toISOString()),
      status: OrderStatus.Pending,
      items: products.reduce((sum, p) => sum + p.quantity, 0),
      playerCount: products.reduce((sum, p) => sum + p.numbers.length, 0),
      progress: 0,
      total: totalPrice,
      products,
    };

    const existingOrders = JSON.parse(localStorage.getItem('submittedOrders') || '[]');
    localStorage.setItem('submittedOrders', JSON.stringify([...existingOrders, newOrder]));

    setSubmitted(true);
    localStorage.removeItem('orderList');

    console.log(
      'Order sent:',
      newOrder,
      addressMode === 'custom' ? customAddress : 'Default address',
    );
  };

  const totalPrice = orderList.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Thank you for your order request!</h1>
        <p className="text-lg">You will receive an order confirmation within the next 48 hours.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Confirm order request</h1>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Select delivery address</h2>

        <select
          className="p-2 border rounded w-full"
          value={addressMode}
          onChange={(e) => setAddressMode(e.target.value as 'default' | 'custom')}
        >
          <option value="default">Standard address</option>
          <option value="custom">Alternative address</option>
        </select>

        {addressMode === 'default' ? (
          <div className="bg-gray-100 p-4 rounded space-y-1">
            <p className="font-medium">Ribe Fritidscenter</p>
            <p>Klaus Sundtoft</p>
            <p>Sportsvej 8</p>
            <p>6760 Ribe</p>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              className="w-full p-2 border rounded bg-gray-100 text-gray-700"
              value="Ribe Fritidscenter"
              readOnly
            />
            <input
              type="text"
              placeholder="Name of recipient"
              className="w-full p-2 border rounded"
              value={customAddress.recipient}
              onChange={(e) => setCustomAddress({ ...customAddress, recipient: e.target.value })}
            />
            <input
              type="text"
              placeholder="Road name and number"
              className="w-full p-2 border rounded"
              value={customAddress.street}
              onChange={(e) => setCustomAddress({ ...customAddress, street: e.target.value })}
            />
            <input
              type="text"
              placeholder="Zip code"
              className="w-full p-2 border rounded"
              value={customAddress.zip}
              onChange={(e) => setCustomAddress({ ...customAddress, zip: e.target.value })}
            />
            <input
              type="text"
              placeholder="City"
              className="w-full p-2 border rounded"
              value={customAddress.city}
              onChange={(e) => setCustomAddress({ ...customAddress, city: e.target.value })}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Your order</h2>
        <ul className="space-y-2">
          {orderList.map((item, index) => (
            <li key={index} className="p-3 border rounded bg-gray-100">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm">Size: {item.size}</p>
              <p className="text-sm">Quantity: {item.quantity}</p>
              {item.numbers && item.numbers.length > 0 && (
                <p className="text-sm">Player Numbers: {item.numbers.join(', ')}</p>
              )}
              <p className="text-sm">Price: {item.price} DKK</p>
              <p className="text-sm font-semibold">Subtotal: {item.price * item.quantity} DKK</p>
            </li>
          ))}
        </ul>
        <div className="text-right text-lg font-bold mt-4">Total: {totalPrice} DKK</div>
      </div>

      <div className="text-right">
        <button onClick={handleSendOrder} className="bg-green-600 text-white px-4 py-2 rounded">
          Send Order Request
        </button>
      </div>
    </div>
  );
}
