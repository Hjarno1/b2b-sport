import React from 'react';
import type { Product, OrderItem } from '@/lib/data/mock-data';
<<<<<<< HEAD
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
=======
>>>>>>> main

interface ProductCardProps {
  product: Product;
  selected: Partial<OrderItem>;
  onSelect: (field: keyof OrderItem, value: string | number) => void;
  onAdd: () => void;
  label?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, selected, onSelect, onAdd, label }) => {
<<<<<<< HEAD
  const { t } = useTranslation('productCard');
=======
>>>>>>> main
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;

  return (
    <div className="border p-4 rounded-xl shadow space-y-3">
<<<<<<< HEAD
      <Image
        src={`/products/${product.images[0]}`}
        alt={product.name}
        width={400}
        height={160}
        className="object-cover rounded"
      />
      <h2 className="font-semibold">{product.name}</h2>
      <p>{t('product_card.price', { amount: product.price.toFixed(2) })}</p>
=======
      <img
        src={`/products/${product.images[0]}`}
        alt={product.name}
        className="w-full h-40 object-cover rounded"
      />
      <h2 className="font-semibold">{product.name}</h2>
      <p>Price: {product.price} DKK</p>
>>>>>>> main

      {hasSizes && (
        <select
          className="w-full p-2 border rounded"
          value={selected.size || ''}
          onChange={(e) => onSelect('size', e.target.value)}
        >
<<<<<<< HEAD
          <option value="">{t('product_card.select_size')}</option>
=======
          <option value="">Select Size</option>
>>>>>>> main
          {product.sizes!.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      )}

      <input
        type="number"
<<<<<<< HEAD
        placeholder={t('product_card.quantity_placeholder')}
=======
        placeholder="Quantity"
>>>>>>> main
        className="w-full p-2 border rounded"
        value={selected.quantity || ''}
        onChange={(e) => onSelect('quantity', parseInt(e.target.value))}
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" onClick={onAdd}>
<<<<<<< HEAD
        {label
          ? label
          : t(product.customizable ? 'product_card.select_numbers' : 'product_card.add_to_order')}
=======
        {label || (product.customizable ? 'Select player numbers' : 'Add to Order')}
>>>>>>> main
      </button>
    </div>
  );
};

export default ProductCard;
