'use client';

import { useState } from 'react';
import { mockProducts } from '@/lib/data/mock-data';

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  sizes?: string[];
  customizable: boolean;
}

interface ShoppingItem extends Product {
  quantity: number;
  size: string;
  number?: string;
}

export default function CreateOrderPage() {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, Partial<ShoppingItem>>>({});

  const handleAddToCart = (product: Product) => {
    const selection = selectedOptions[product.id];

    const requiresSize = product.sizes && product.sizes.length > 0;
    const requiresQuantity = !!selection?.quantity;
    const itemTotals = shoppingList.map((item) => item.price * item.quantity);

    if ((requiresSize && !selection?.size) || !requiresQuantity) {
      return;
    }

    setShoppingList((prev) => [
      ...prev,
      {
        ...product,
        size: selection?.size || '', // fallback if not required
        quantity: selection.quantity!,
        number: selection.number || '',
      },
    ]);

    setSelectedOptions((prev) => ({ ...prev, [product.id]: {} }));
  };

  // Calculate total price for shopping list
  const totalPrice = shoppingList.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemoveFromCart = (index: number) => {
    setShoppingList((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSelection = (productId: number, field: keyof ShoppingItem, value: any) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const handleSubmitOrder = () => {
    console.log('Submitting Order:', shoppingList);
    alert('Order submitted to console (mock)!');
  };

  const updateShoppingItem = (index: number, field: keyof ShoppingItem, value: any) => {
    setShoppingList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create Order</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProducts.map((product) => (
          <div key={product.id} className="border p-4 rounded-xl shadow space-y-3">
            <img
              src={`/products/${product.images[0]}`}
              alt={product.name}
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="font-semibold">{product.name}</h2>
            <p>Price: {product.price} DKK</p>

            {product.sizes && product.sizes.length > 0 && (
              <select
                className="w-full p-2 border rounded"
                value={selectedOptions[product.id]?.size || ''}
                onChange={(e) => updateSelection(product.id, 'size', e.target.value)}
              >
                <option value="">Select Size</option>
                {product.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            )}

            <input
              type="number"
              placeholder="Quantity"
              className="w-full p-2 border rounded"
              value={selectedOptions[product.id]?.quantity || ''}
              onChange={(e) => updateSelection(product.id, 'quantity', parseInt(e.target.value))}
            />

            {product.customizable && (
              <input
                type="text"
                placeholder="Player Number"
                className="w-full p-2 border rounded"
                value={selectedOptions[product.id]?.number || ''}
                onChange={(e) => updateSelection(product.id, 'number', e.target.value)}
              />
            )}

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              onClick={() => handleAddToCart(product)}
            >
              Add to Shopping List
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Shopping List</h2>
        {shoppingList.length === 0 ? (
          <p className="text-gray-500">No items added.</p>
        ) : (
          <ul className="space-y-2">
            {shoppingList.map((item, index) => {
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
                    <span className="ml-auto font-semibold">
                      = {item.price * item.quantity} DKK
                    </span>
                  </div>

                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleRemoveFromCart(index)}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-4 text-right text-lg font-semibold">Total: {totalPrice} DKK</div>

        {shoppingList.length > 0 && (
          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleSubmitOrder}
          >
            Submit Order
          </button>
        )}
      </div>
    </div>
  );
}
