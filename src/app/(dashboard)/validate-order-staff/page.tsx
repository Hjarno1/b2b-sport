'use client';

import { useEffect, useState } from 'react';

interface OrderItem {
  id: number;
  name: string;
  size: string;
  quantity: number;
  number?: string;
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
    setSubmitted(true);
    localStorage.removeItem('orderList');
    console.log(
      'Order sent:',
      orderList,
      addressMode === 'custom' ? customAddress : 'Default address',
    );
  };

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Thank you for your order request!</h1>
        <p className="text-lg">You will recieve a order confirmation within the next 48 hours.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Confirm order request</h1>

      {/* Shipping Address */}
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
            <p>Chris Sawaguchi</p>
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

      {/* Order Review */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Your order</h2>
        <ul className="space-y-2">
          {orderList.map((item, index) => (
            <li key={index} className="p-3 border rounded bg-gray-100">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm">Size: {item.size}</p>
              <p className="text-sm">Quantity: {item.quantity}</p>
              {item.number && <p className="text-sm">Player Number: {item.number}</p>}
            </li>
          ))}
        </ul>
      </div>

      {/* Submit Button */}
      <div className="text-right">
        <button onClick={handleSendOrder} className="bg-green-600 text-white px-4 py-2 rounded">
          Send Order Request
        </button>
      </div>
    </div>
  );
}
