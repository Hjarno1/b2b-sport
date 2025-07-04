'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Pencil, FilePlus } from 'lucide-react';
import { useCart } from '@/app/providers/CartProvider';
import type { OrderItem } from '@/lib/data/mock-data';
import type { Product } from '@/types/product';
import ManualRequestModal from '@/app/components/manual-request/manualRequestModal';
import ManageOrderListStaff from '@/app/components/order-products/manageOrderListStaff';
import { useTranslation } from 'react-i18next';

let nextLineItemId = 1;

export default function OrderCreateStaffPage() {
  const router = useRouter();
  const {
    state: { items: orderList },
    add,
    remove,
    updateQty,
  } = useCart();

  // products load state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // selection & modal state
  const [selectedOptions, setSelectedOptions] = useState<Record<number, Partial<OrderItem>>>({});
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showNumberModal, setShowNumberModal] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [tempSizeCounts, setTempSizeCounts] = useState<Record<string, number>>({});
  const [tempNumbers, setTempNumbers] = useState<Record<string, string[]>>({});
  const { t } = useTranslation();

  // fetch only SKUs starting with "B2B"
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/products?skuPrefix=B2B&page=1&limit=100');
        if (!res.ok) throw new Error(`Status ${res.status}: ${await res.text()}`);
        const { data } = (await res.json()) as { data: Product[] };
        setProducts(data);
      } catch (e: any) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const updateSelection = (productId: number, field: keyof OrderItem, value: any) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const handleAddClick = (product: Product) => {
    const sel = selectedOptions[product.id] || {};
    const qty = sel.quantity ?? 1;
    updateSelection(product.id, 'quantity', qty);

    if (product.sizes && product.sizes.length > 0) {
      setActiveProduct(product);
      setTempSizeCounts(Object.fromEntries(product.sizes.map((s: string) => [s, 0])));
      setShowSizeModal(true);
    } else if (product.customizable) {
      setActiveProduct(product);
      setTempSizeCounts({ '': qty });
      setShowNumberModal(true);
    } else {
      add({ id: nextLineItemId++, name: product.name, price: product.price, quantity: qty });
      setSelectedOptions((prev) => ({ ...prev, [product.id]: {} }));
    }
  };

  const handleConfirmSize = () => {
    if (!activeProduct) return;
    const qty = selectedOptions[activeProduct.id!]?.quantity ?? 1;
    const total = Object.values(tempSizeCounts).reduce((a, b) => a + b, 0);
    if (total !== qty) return;

    const initial: Record<string, string[]> = {};
    for (const [size, count] of Object.entries(tempSizeCounts)) {
      if (count > 0) initial[size] = Array(count).fill('');
    }
    setTempNumbers(initial);
    setShowSizeModal(false);
    setShowNumberModal(true);
  };

  const handleNumberChange = (size: string, idx: number, val: string) => {
    setTempNumbers((prev) => {
      const copy = { ...prev };
      copy[size][idx] = val;
      return copy;
    });
  };

  const handleConfirmNumbers = () => {
    if (!activeProduct) return;
    for (const [size, nums] of Object.entries(tempNumbers)) {
      if (nums.length) {
        add({
          id: nextLineItemId++,
          name: activeProduct.name,
          price: activeProduct.price,
          quantity: nums.length,
          size,
          numbers: nums,
        });
      }
    }
    setActiveProduct(null);
    setTempSizeCounts({});
    setTempNumbers({});
    setShowNumberModal(false);
    setSelectedOptions((prev) => ({ ...prev, [activeProduct!.id]: {} }));
  };

  const handleRemoveFromCart = (idx: number) => remove(orderList[idx].id);

  const updateItem = (idx: number, field: keyof OrderItem, val: string | number) => {
    if (field === 'quantity') updateQty(orderList[idx].id, val as number);
  };

  const updatePlayerNumber = (itemIdx: number, numIdx: number, val: string) => {
    const item = orderList[itemIdx];
    const nums = [...(item.numbers || [])];
    nums[numIdx] = val;
    remove(item.id);
    add({ ...item, numbers: nums, quantity: nums.length });
  };

  const handleValidateOrder = () => {
    localStorage.setItem('orderList', JSON.stringify(orderList));
    router.push('/validate-order-staff');
  };

  const scrollToItem = (idx: number) => {
    itemRefs.current[idx]?.scrollIntoView({ behavior: 'smooth' });
  };

  const totalAssigned = activeProduct
    ? Object.values(tempSizeCounts).reduce((a, b) => a + b, 0)
    : 0;
  const requestedQty = activeProduct ? selectedOptions[activeProduct.id!]?.quantity ?? 1 : 0;

  return (
    <div className="flex">
      {/* Left pane */}
      <div className="p-6 flex-1">
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          <FilePlus size={16} /> {t('order_create_admin.createManualOrder')}
        </button>
        <ManualRequestModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

        {loading ? (
          <p>Loading products…</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {products.map((p) => (
              <div key={p.id} className="border p-4 rounded-lg space-y-2">
                <img
                  src={p.images?.[0] ?? '/placeholder.png'}
                  alt={p.name}
                  className="w-full h-48 object-cover rounded cursor-pointer"
                  onClick={() => router.push(`/product-details/${p.id}`)}
                />
                <h2 className="font-semibold text-lg">{p.name}</h2>
                <input
                  type="number"
                  min={1}
                  placeholder={t('product_card.quantity_placeholder')}
                  className="w-full p-2 border rounded"
                  value={selectedOptions[p.id]?.quantity ?? ''}
                  onChange={(e) => updateSelection(p.id, 'quantity', parseInt(e.target.value) || 1)}
                />
                <button
                  onClick={() => handleAddClick(p)}
                  className="w-full bg-blue-600 text-white py-2 rounded"
                >
                  {p.sizes?.length ? t('product_card.selectSizesNumbers') : t('cart.add_to_cart')}
                </button>
              </div>
            ))}
          </div>
        )}

        {orderList.length > 0 && (
          <div className="mt-10">
            <ManageOrderListStaff
              orderList={orderList.map((ci) => {
                const prod = products.find((x) => x.id === ci.id);
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
                onClick={handleValidateOrder}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                {t('order_create_admin.validateOrder')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right aside */}
      <aside className="w-full md:w-1/3 lg:w-1/4 bg-gray-50 p-4 border-l">
        <h2 className="text-lg font-semibold mb-4">{t('order_overview.title')}</h2>
        <ul className="space-y-4">
          {orderList.map((item, idx) => (
            <li
              key={item.id}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              className="p-2 bg-white rounded shadow-sm flex justify-between items-center"
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
                  onClick={() => handleRemoveFromCart(idx)}
                  className="text-red-500 cursor-pointer"
                />
                <Pencil onClick={() => scrollToItem(idx)} className="cursor-pointer" />
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Size distribution modal */}
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

      {/* Player numbers modal */}
      {showNumberModal && activeProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">{t('player_number_modal.title')}</h3>
            <div
              className={`grid grid-cols-${Object.keys(tempNumbers).length} gap-4 overflow-x-auto`}
            >
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
