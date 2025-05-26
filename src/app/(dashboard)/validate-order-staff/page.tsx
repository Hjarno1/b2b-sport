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
    // Optionally, log or send address & order data here
  };

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Tak for din bestillingsanmodning</h1>
        <p className="text-lg">Den er modtaget, og vi vender tilbage inden for 2-3 hverdage.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Bekræft din ordre</h1>

      {/* Shipping Address */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Vælg leveringsadresse</h2>

        <select
          className="p-2 border rounded w-full"
          value={addressMode}
          onChange={(e) => setAddressMode(e.target.value as 'default' | 'custom')}
        >
          <option value="default">Standardadresse</option>
          <option value="custom">Anden adresse</option>
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
              placeholder="Navn på modtager"
              className="w-full p-2 border rounded"
              value={customAddress.recipient}
              onChange={(e) => setCustomAddress({ ...customAddress, recipient: e.target.value })}
            />
            <input
              type="text"
              placeholder="Vejnavn og nummer"
              className="w-full p-2 border rounded"
              value={customAddress.street}
              onChange={(e) => setCustomAddress({ ...customAddress, street: e.target.value })}
            />
            <input
              type="text"
              placeholder="Postnummer"
              className="w-full p-2 border rounded"
              value={customAddress.zip}
              onChange={(e) => setCustomAddress({ ...customAddress, zip: e.target.value })}
            />
            <input
              type="text"
              placeholder="By"
              className="w-full p-2 border rounded"
              value={customAddress.city}
              onChange={(e) => setCustomAddress({ ...customAddress, city: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Order Review */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Din ordre</h2>
        <ul className="space-y-2">
          {orderList.map((item, index) => (
            <li key={index} className="p-3 border rounded bg-gray-100">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm">Størrelse: {item.size}</p>
              <p className="text-sm">Antal: {item.quantity}</p>
              {item.number && <p className="text-sm">Nummer: {item.number}</p>}
            </li>
          ))}
        </ul>
      </div>

      {/* Submit Button */}
      <div className="text-right">
        <button onClick={handleSendOrder} className="bg-green-600 text-white px-4 py-2 rounded">
          Send bestillingsanmodning
        </button>
      </div>
    </div>
  );
}
