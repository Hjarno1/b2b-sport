'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Pencil, FilePlus } from 'lucide-react';
import { mockProducts } from '@/lib/data/mock-data';
import ManualRequestModal from '@/app/components/manual-request/manualRequestModal';

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
  size?: string;
  numbers?: string[];
}

export default function CreateOrderPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [orderList, setOrderList] = useState<OrderItem[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, Partial<OrderItem>>>({});
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [tempNumbers, setTempNumbers] = useState<string[]>([]);
  const itemRefs = useRef<Record<number, HTMLLIElement | null>>({});
  const router = useRouter();

  useEffect(() => {
    const storedOrder = localStorage.getItem('orderList');
    if (storedOrder) {
      try {
        const parsed: OrderItem[] = JSON.parse(storedOrder);
        setOrderList(parsed);
        localStorage.removeItem('orderList');
      } catch {
        console.warn('Invalid orderList data in localStorage');
        localStorage.removeItem('orderList');
      }
    }
  }, []);

  const handleAddToCart = (product: Product) => {
    const selection = selectedOptions[product.id];
    const requiresSize = Array.isArray(product.sizes) && product.sizes.length > 0;
    const quantity = selection?.quantity || 1;
    const numbers = product.customizable ? tempNumbers : undefined;

    if ((requiresSize && !selection?.size) || !quantity) return;

    const newItem: OrderItem = {
      ...product,
      quantity,
      size: selection?.size || '',
      numbers,
    };

    setOrderList((prev) => [...prev, newItem]);
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
    localStorage.setItem('orderList', JSON.stringify(orderList));
    router.push('/validate-order-admin');
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    setOrderList((prev) => {
      const updated = [...prev];

      if (field === 'quantity') {
        const quantity = Number(value);
        if (!Number.isNaN(quantity) && quantity > 0) {
          updated[index].quantity = quantity;

          if (updated[index].customizable) {
            const prevNumbers = updated[index].numbers || [];
            if (quantity > prevNumbers.length) {
              updated[index].numbers = [
                ...prevNumbers,
                ...new Array(quantity - prevNumbers.length).fill(''),
              ];
            } else {
              updated[index].numbers = prevNumbers.slice(0, quantity);
            }
          }
        }

        return updated;
      }

      (updated[index] as any)[field] = value;
      return updated;
    });
  };

  const updatePlayerNumber = (itemIndex: number, numIndex: number, value: string) => {
    setOrderList((prev) => {
      const updated = [...prev];
      if (updated[itemIndex].numbers) {
        updated[itemIndex].numbers![numIndex] = value;
      }
      return updated;
    });
  };

  const scrollToItem = (index: number) => {
    const ref = itemRefs.current[index];
    if (ref) ref.scrollIntoView({ behavior: 'smooth' });
  };

  const totalPrice = orderList.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <main className="flex-1 space-y-6">
        <h1 className="text-2xl font-bold">Create Order Request</h1>

        <div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
          >
            <FilePlus size={16} />
            Create Manual Order
          </button>

          <ManualRequestModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProducts.map((product) => (
            <div key={product.id} className="border p-4 rounded-xl shadow space-y-3">
               <img
                  src={`/products/${product.images[0]}`}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded cursor-pointer"
                  onClick={() => router.push(`/product-details/${product.id}`)}
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

              <button
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                onClick={() => {
                  const quantity = selectedOptions[product.id]?.quantity || 1;

                  if (
                    product.customizable &&
                    Array.isArray(product.sizes) &&
                    product.sizes.length > 0
                  ) {
                    const currentSize = selectedOptions[product.id]?.size || '';
                    setSelectedOptions((prev) => ({
                      ...prev,
                      [product.id]: { ...prev[product.id], size: currentSize, quantity },
                    }));

                    setTempNumbers(new Array(quantity).fill(''));
                    setActiveModalProduct(product);
                  } else {
                    handleAddToCart(product);
                  }
                }}
              >
                {product.customizable ? 'Select player numbers' : 'Add to Order'}
              </button>
            </div>
          ))}
        </div>

        {orderList.length > 0 && (
          <div className="mt-10 space-y-6">
            <h2 className="text-xl font-semibold">Manage Order</h2>
            <ul className="space-y-2">
              {orderList.map((item, index) => (
                <li
                  key={index}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border p-3 rounded bg-gray-100"
                >
                  <div className="flex-1 text-sm text-gray-800 flex flex-wrap items-center gap-2">
                    <input
                      type="number"
                      className="w-8 p-1 border rounded text-center"
                      value={item.quantity ?? ''}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      min={1}
                    />
                    x <span className="font-semibold">{item.name}</span>
                    {item.size && (
                      <>
                        in size
                        <select
                          className="p-1 border rounded"
                          value={item.size}
                          onChange={(e) => updateItem(index, 'size', e.target.value)}
                        >
                          {item.sizes?.map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                    {item.customizable &&
                      item.numbers?.map((num, i) => (
                        <span key={i} className="flex items-center gap-1">
                          {i === 0 && <span>with player number</span>}
                          <input
                            type="text"
                            className="w-12 p-1 border rounded"
                            placeholder={`#${i + 1}`}
                            value={num}
                            onChange={(e) => updatePlayerNumber(index, i, e.target.value)}
                          />
                        </span>
                      ))}
                    <span className="ml-auto font-semibold">
                      = {item.price * item.quantity} DKK
                    </span>
                  </div>
                  <Trash2
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleRemoveFromCart(index)}
                  />
                  <Pencil className="cursor-pointer" onClick={() => scrollToItem(index)} />
                </li>
              ))}
            </ul>

            <div className="mt-4 text-right text-lg font-semibold">Total: {totalPrice} DKK</div>

            <div className="text-right">
              <button
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleValidateOrder}
              >
                Validate Order
              </button>
            </div>
          </div>
        )}
      </main>

      <aside className="w-full md:w-1/3 lg:w-1/4 bg-gray-50 p-4 border-l border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Order Overview</h2>
        <ul className="space-y-4">
          {orderList.map((item, index) => (
            <li
              key={index}
              className="p-2 bg-white rounded shadow-sm flex justify-between items-start gap-2"
            >
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                {item.numbers && item.numbers.length > 0 && (
                  <p className="text-sm text-gray-600">Numbers: {item.numbers.join(', ')}</p>
                )}
                <p className="text-sm font-semibold">{item.price * item.quantity} DKK</p>
              </div>
              <div className="flex flex-col gap-2">
                <Trash2
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleRemoveFromCart(index)}
                />
                <Pencil
                  className="text-blue-500 cursor-pointer"
                  onClick={() => scrollToItem(index)}
                />
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {activeModalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold">Enter player numbers</h3>
            <div className="grid grid-cols-2 gap-2">
              {tempNumbers.map((num, i) => (
                <input
                  key={i}
                  type="text"
                  className="border p-2 rounded"
                  placeholder={`#${i + 1}`}
                  value={num}
                  onChange={(e) => {
                    const newNums = [...tempNumbers];
                    newNums[i] = e.target.value;
                    setTempNumbers(newNums);
                  }}
                />
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => {
                  setActiveModalProduct(null);
                  setTempNumbers([]);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  if (activeModalProduct) {
                    setSelectedOptions((prev) => ({
                      ...prev,
                      [activeModalProduct.id]: {
                        ...prev[activeModalProduct.id],
                        numbers: tempNumbers,
                      },
                    }));
                    handleAddToCart(activeModalProduct);
                    setActiveModalProduct(null);
                    setTempNumbers([]);
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
