'use client';
import { useCart } from '../../providers/CartProvider';
import { useTranslation } from 'react-i18next';

export function AddToCartButton({
  product,
}: {
  product: { id: number; name: string; price: number };
}) {
  const { add } = useCart();
  const { t } = useTranslation('validate_order');
  return (
    <button
      onClick={() =>
        add({
          ...product,
          quantity: 1,
        })
      }
      className="px-3 py-1 bg-blue-600 text-white rounded"
    >
      {t('add_to_cart')}
    </button>
  );
}
