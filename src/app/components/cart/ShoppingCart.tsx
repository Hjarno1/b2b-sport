'use client';
import { UserRole } from '@/lib/data/mock-data';
import { useCart, CartItem } from '../../providers/CartProvider';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/context/auth-context';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { t } = useTranslation('cart');
  const router = useRouter();
  const { state, remove, updateQty, clear } = useCart();
  const { user } = useAuth();
  const total = state.items.reduce((sum: number, i: CartItem) => sum + i.price * i.quantity, 0);

  const handleCheckout = async () => {
    // await createOrder(state.items);
    clear();
    onClose();

    if (user?.role === UserRole.ClubAdmin) {
      router.push('/validate-order-admin');
    } else if (user?.role === UserRole.ClubStaff) {
      router.push('/validate-order-staff');
    }
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-4 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t('shopping_cart.title')}</h2>
        <button onClick={onClose} aria-label={t('shopping_cart.buttons.close')}>
          ×
        </button>
      </header>
      {state.items.length === 0 ? (
        <p>{t('shopping_cart.empty')}</p>
      ) : (
        <ul>
          {state.items.map((item) => (
            <li key={item.id} className="flex justify-between mb-2">
              <div>
                <p className="font-semibold">{item.name}</p>
                {item.size && (
                  <p className="text-sm text-gray-500">
                    {t('shopping_cart.size', { size: item.size })}
                  </p>
                )}
                {Array.isArray(item.numbers) && item.numbers.length > 0 && (
                  <p className="text-sm text-gray-500">
                    {t('shopping_cart.numbers', { numbers: item.numbers.join(', ') })}
                  </p>
                )}
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) => updateQty(item.id, +e.target.value)}
                  className="w-16 border rounded mt-1"
                  aria-label={t('shopping_cart.buttons.quantity')}
                />
              </div>
              <button
                onClick={() => remove(item.id)}
                aria-label={t('shopping_cart.buttons.remove')}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <footer className="mt-6">
        <p className="font-bold">
          {t('shopping_cart.total')}: DKK {total.toFixed(2)}
        </p>
        <div className="space-y-2 mt-4">
          <button
            onClick={() => {
              onClose();
              router.push('/order-create-admin');
            }}
            className="w-full py-2 bg-blue-600 text-white rounded"
          >
            {t('shopping_cart.buttons.edit')}
          </button>
          <button
            disabled={state.items.length === 0}
            onClick={handleCheckout}
            className="w-full py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {t('shopping_cart.buttons.confirm')}
          </button>
        </div>
      </footer>
    </div>
  );
}
