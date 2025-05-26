'use client';

import { useState } from 'react';
import { mockProducts } from '@/lib/data/mock-data';
import { useRouter } from 'next/navigation';

function OrderSidebar({ orderList }: { orderList: OrderItem[] }) {
  return (
    <aside className="w-full md:w-1/3 lg:w-1/4 bg-gray-50 p-4 border-l border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Bestillingsliste</h2>
      <ul className="space-y-4">
        {orderList.map((item, index) => (
          <li key={index} className="p-2 bg-white rounded shadow-sm">
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
            <p className="text-sm text-gray-600">Size: {item.size}</p>
            {item.number && <p className="text-sm text-gray-600">Number: {item.number}</p>}
          </li>
        ))}
      </ul>
    </aside>
  );
}

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  sizes?: string[];
  customizable: boolean;
}

interface OrderItem extends Product {
  quantity: number;
  size: string;
  number?: string;
}

export default function CreateOrderPage() {
  const [orderList, setOrderList] = useState<OrderItem[]>([]);
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<Record<number, Partial<OrderItem>>>({});

  const handleAddToCart = (product: Product) => {
    const selection = selectedOptions[product.id];

    const requiresSize = product.sizes && product.sizes.length > 0;
    const requiresQuantity = !!selection?.quantity;

    if ((requiresSize && !selection?.size) || !requiresQuantity) {
      return;
    }

    setOrderList((prev) => [
      ...prev,
      {
        ...product,
        size: selection?.size || '',
        quantity: selection.quantity!,
        number: selection.number || '',
      },
    ]);

    setSelectedOptions((prev) => ({ ...prev, [product.id]: {} }));
  };

  const handleRemoveFromCart = (index: number) => {
    setOrderList((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSelection = (productId: number, field: keyof OrderItem, value: string | number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const handleValidateOrder = () => {
    // Save order to localStorage or pass via router state (simpler for now: localStorage)
    localStorage.setItem('orderList', JSON.stringify(orderList));
    router.push('/validate-order-staff');
  };

  const updateShoppingItem = (index: number, field: keyof OrderItem, value: string | number) => {
    setOrderList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <main className="flex-1 space-y-6">
        <h1 className="text-2xl font-bold">Opret ny bestilling</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProducts.map((product) => (
            <div key={product.id} className="border p-4 rounded-xl shadow space-y-3">
              <img
                src={`/products/${product.images[0]}`}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="font-semibold">{product.name}</h2>

              {product.sizes && product.sizes.length > 0 && (
                <select
                  className="w-full p-2 border rounded"
                  value={selectedOptions[product.id]?.size || ''}
                  onChange={(e) => updateSelection(product.id, 'size', e.target.value)}
                >
                  <option value="">Vælg størrelse</option>
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              )}

              <input
                type="number"
                placeholder="Antal"
                className="w-full p-2 border rounded"
                value={selectedOptions[product.id]?.quantity || ''}
                onChange={(e) => updateSelection(product.id, 'quantity', parseInt(e.target.value))}
              />

              {product.customizable && (
                <input
                  type="text"
                  placeholder="Trøje nummer"
                  className="w-full p-2 border rounded"
                  value={selectedOptions[product.id]?.number || ''}
                  onChange={(e) => updateSelection(product.id, 'number', e.target.value)}
                />
              )}

              <button
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                onClick={() => handleAddToCart(product)}
              >
                Tilføj til bestilling
              </button>
            </div>
          ))}
        </div>

        {orderList.length > 0 && (
          <div className="mt-10 space-y-6">
            <h2 className="text-xl font-semibold">Bestillings oversigt</h2>
            <ul className="space-y-2">
              {orderList.map((item, index) => {
                const product = mockProducts.find((p) => p.id === item.id);
                const hasSizes = !!product?.sizes?.length;

                return (
                  <li
                    key={index}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border p-3 rounded bg-gray-100"
                  >
                    <div className="flex-1 text-sm text-gray-800 flex flex-wrap items-center gap-2">
                      <input
                        type="number"
                        className="w-8 p-1 border rounded text-center"
                        value={item.quantity}
                        onChange={(e) =>
                          updateShoppingItem(index, 'quantity', parseInt(e.target.value))
                        }
                        min={1}
                      />
                      x <span className="font-semibold">{item.name}</span>
                      {hasSizes && product && (
                        <>
                          in size
                          <select
                            className="p-1 border rounded"
                            value={item.size}
                            onChange={(e) => updateShoppingItem(index, 'size', e.target.value)}
                          >
                            {product.sizes!.map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                      {item.customizable && (
                        <>
                          with number
                          <input
                            type="text"
                            className="w-12 p-1 border rounded"
                            placeholder="Number"
                            value={item.number || ''}
                            onChange={(e) => updateShoppingItem(index, 'number', e.target.value)}
                          />
                        </>
                      )}
                    </div>

                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleRemoveFromCart(index)}
                    >
                      Fjern
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="text-right">
              <button
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleValidateOrder}
              >
                Valider bestilling
              </button>
            </div>
          </div>
        )}
      </main>

      <OrderSidebar orderList={orderList} />
    </div>
  );
}
