import React from 'react';
import type { Product, OrderItem } from '@/lib/data/mock-data';

interface ProductCardProps {
  product: Product;
  selected: Partial<OrderItem>;
  onSelect: (field: keyof OrderItem, value: string | number) => void;
  onAdd: () => void;
  label?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, selected, onSelect, onAdd, label }) => {
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;

  return (
    <div className="border p-4 rounded-xl shadow space-y-3">
      <img
        src={`/products/${product.images[0]}`}
        alt={product.name}
        className="w-full h-40 object-cover rounded"
      />
      <h2 className="font-semibold">{product.name}</h2>
      <p>Price: {product.price} DKK</p>

      {hasSizes && (
        <select
          className="w-full p-2 border rounded"
          value={selected.size || ''}
          onChange={(e) => onSelect('size', e.target.value)}
        >
          <option value="">Select Size</option>
          {product.sizes!.map((size) => (
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
        value={selected.quantity || ''}
        onChange={(e) => onSelect('quantity', parseInt(e.target.value))}
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" onClick={onAdd}>
        {label || (product.customizable ? 'Select player numbers' : 'Add to Order')}
      </button>
    </div>
  );
};

export default ProductCard;
