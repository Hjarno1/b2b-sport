'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Pencil, FilePlus } from 'lucide-react';
import { mockProducts, Product, OrderItem } from '@/lib/data/mock-data';
import { useCart } from '@/app/providers/CartProvider';
import ManualRequestModal from '@/app/components/manual-request/manualRequestModal';
import ManageOrderList from '@/app/components/order-products/manageOrderList';
import { useTranslation } from 'react-i18next';

// Simple incremental counter for unique cart item IDs
let nextLineItemId = 1;

export default function OrderCreateAdminPage() {
  const router = useRouter();
  const {
    state: { items: orderList },
    add,
    remove,
    updateQty,
  } = useCart();

  const [selectedOptions, setSelectedOptions] = useState<Record<number, Partial<OrderItem>>>({});
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showNumberModal, setShowNumberModal] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [tempSizeCounts, setTempSizeCounts] = useState<Record<string, number>>({});
  const [tempNumbers, setTempNumbers] = useState<Record<string, string[]>>({});

  const updateSelection = (
    productId: number,
    field: keyof OrderItem,
    value: string | number | string[] | undefined,
  ) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const handleAddClick = (product: Product) => {
    const selection = selectedOptions[product.id] || {};
    const qty = selection.quantity ?? 1;
    updateSelection(product.id, 'quantity', qty);

    if (product.sizes && product.sizes.length > 0) {
      setActiveProduct(product);
      setTempSizeCounts(Object.fromEntries(product.sizes.map((s) => [s, 0])));
      setShowSizeModal(true);
    } else if (product.customizable) {
      setActiveProduct(product);
      setTempSizeCounts({ '': qty });
      setShowNumberModal(true);
    } else {
      add({
        id: nextLineItemId++,
        name: product.name,
        price: product.price,
        quantity: qty,
      });
      setSelectedOptions((prev) => ({ ...prev, [product.id]: {} }));
    }
  };

  const handleConfirmSize = () => {
    if (!activeProduct) return;
    const quantity = selectedOptions[activeProduct.id]?.quantity ?? 1;
    const totalAssigned = Object.values(tempSizeCounts).reduce((a, b) => a + b, 0);
    if (totalAssigned !== quantity) return;

    const initialNumbers: Record<string, string[]> = {};
    Object.entries(tempSizeCounts).forEach(([size, count]) => {
      if (count > 0) initialNumbers[size] = Array(count).fill('');
    });
    setTempNumbers(initialNumbers);

    setShowSizeModal(false);
    setShowNumberModal(true);
  };

  const handleNumberChange = (size: string, index: number, value: string) => {
    setTempNumbers((prev) => {
      const updated = { ...prev };
      updated[size][index] = value;
      return updated;
    });
  };

  const handleConfirmNumbers = () => {
    if (!activeProduct) return;
    Object.entries(tempNumbers).forEach(([size, nums]) => {
      if (nums.length > 0) {
        add({
          id: nextLineItemId++,
          name: activeProduct.name,
          price: activeProduct.price,
          quantity: nums.length,
          size,
          numbers: nums,
        });
      }
    });

    setActiveProduct(null);
    setTempSizeCounts({});
    setTempNumbers({});
    setShowNumberModal(false);
    setSelectedOptions((prev) => ({ ...prev, [activeProduct!.id]: {} }));
  };

  const handleRemoveFromCart = (index: number) => {
    remove(orderList[index].id);
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    if (field === 'quantity') {
      updateQty(orderList[index].id, value as number);
    }
  };

  const updatePlayerNumber = (itemIndex: number, numIndex: number, value: string) => {
    const item = orderList[itemIndex];
    const updatedNums = [...(item.numbers || [])];
    updatedNums[numIndex] = value;
    remove(item.id);
    add({ ...item, numbers: updatedNums, quantity: updatedNums.length });
  };

  const handleValidateOrder = () => {
    localStorage.setItem('orderList', JSON.stringify(orderList));
    router.push('/validate-order-admin');
  };

  const scrollToItem = (index: number) => {
    const ref = itemRefs.current[index];
    if (ref) ref.scrollIntoView({ behavior: 'smooth' });
  };

  const totalAssigned = activeProduct
    ? Object.values(tempSizeCounts).reduce((a, b) => a + b, 0)
    : 0;
  const requestedQty = activeProduct ? selectedOptions[activeProduct.id!]?.quantity ?? 1 : 0;

  return (
    <div className="flex">
      <div className="p-6 flex-1">
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          <FilePlus size={16} /> {t('order_create_admin.createManualOrder')}
        </button>
        <ManualRequestModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {mockProducts.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg space-y-2">
              <img
                src={`/products/${product.images[0]}`}
                alt={product.name}
                className="w-full h-48 object-cover rounded cursor-pointer"
                onClick={() => router.push(`/product-details/${product.id}`)}
              />
              <h2 className="font-semibold text-lg">{product.name}</h2>
              <p>{t('product_card.price', { amount: product.price })}</p>
              <input
                type="number"
                min={1}
                placeholder={t('product_card.quantity_placeholder')}
                className="w-full p-2 border rounded"
                value={selectedOptions[product.id]?.quantity ?? ''}
                onChange={(e) =>
                  updateSelection(product.id, 'quantity', parseInt(e.target.value) || 1)
                }
              />
              <button
                onClick={() => handleAddClick(product)}
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                {product.sizes?.length
                  ? t('product_card.selectSizesNumbers')
                  : t('cart.add_to_cart')}
              </button>
            </div>
          ))}
        </div>

        {orderList.length > 0 && (
          <div className="mt-10">
            <ManageOrderList
              orderList={orderList.map((ci) => {
                const prod = mockProducts.find((p) => p.id === ci.id);
                return {
                  ...ci,
                  images: prod?.images ?? [],
                  customizable: prod?.customizable ?? false,
                };
              })}
              updateItem={updateItem}
              updatePlayerNumber={updatePlayerNumber}
              scrollToItem={scrollToItem}
              handleRemoveFromCart={handleRemoveFromCart}
            />
            <div className="text-right mt-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleValidateOrder}
              >
                {t('order_create_admin.validateOrder')}
              </button>
            </div>
          </div>
        )}
      </div>

      <aside className="w-full md:w-1/3 lg:w-1/4 bg-gray-50 p-4 border-l">
        <h2 className="text-lg font-semibold mb-4">{t('order_overview.title')}</h2>
        <ul className="space-y-4">
          {orderList.map((item, idx) => (
            <li
              key={item.id}
              className="p-2 bg-white rounded shadow-sm flex justify-between items-center"
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">
                  {item.size} × {item.quantity}
                </p>
                <p className="text-sm text-gray-600">
                  {t('order_overview.numbers')} {item.numbers?.join(', ')}
                </p>
              </div>
              <div className="flex gap-2">
                <Trash2
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleRemoveFromCart(idx)}
                />
                <Pencil className="cursor-pointer" onClick={() => scrollToItem(idx)} />
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {showSizeModal && activeProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">
              {t('order_create_admin.distributeAcrossSizes', { count: requestedQty })}
            </h3>
            {activeProduct.sizes!.map((size) => (
              <div key={size} className="flex justify-between mb-2">
                <span>{size}</span>
                <input
                  type="number"
                  min={0}
                  max={requestedQty}
                  className="w-20 border rounded"
                  value={tempSizeCounts[size] || ''}
                  onChange={(e) =>
                    setTempSizeCounts((prev) => ({
                      ...prev,
                      [size]: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            ))}
            <p>
              {t('order_create_admin.totalAssigned', {
                assigned: totalAssigned,
                requested: requestedQty,
              })}
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={() => setShowSizeModal(false)} className="px-4 py-2 border rounded">
                {t('manage_order.cancel')}
              </button>
              <button
                onClick={handleConfirmSize}
                disabled={totalAssigned !== requestedQty}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {t('order_create_admin.next')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showNumberModal && activeProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">{t('player_number_modal.title')}</h3>
            <div className="grid grid-cols-{{Object.keys(tempNumbers).length}} gap-4 overflow-x-auto">
              {Object.entries(tempNumbers)
                .filter(([, nums]) => nums.length > 0)
                .map(([size, nums]) => (
                  <div key={size} className="flex flex-col">
                    <h4 className="font-medium mb-2">{size || t('manage_order_staff.inSize')}</h4>
                    {nums.map((n, i) => (
                      <input
                        key={i}
                        type="text"
                        placeholder={t('player_number_modal.placeholder', { index: i + 1 })}
                        className="mb-2 p-2 border rounded"
                        value={n}
                        onChange={(e) => handleNumberChange(size, i, e.target.value)}
                      />
                    ))}
                  </div>
                ))}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 rounded border"
                onClick={() => {
                  setShowNumberModal(false);
                  setActiveProduct(null);
                  setTempNumbers({});
                }}
              >
                {t('player_number_modal.cancel')}
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
                onClick={handleConfirmNumbers}
                disabled={Object.values(tempNumbers)
                  .flat()
                  .some((num) => !num)}
              >
                {t('manage_order.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
