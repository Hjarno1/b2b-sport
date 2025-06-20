'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { mockProducts, Product } from '@/lib/data/mock-data';
import { useTranslation } from 'react-i18next';

export default function ProductPage() {
  const { t } = useTranslation('product');
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const found = mockProducts.find((p) => p.id === Number(id));
    setProduct(found ?? null);
  }, [id]);

  if (!product) {
    return <div className="p-8 text-center">{t('product.not_found')}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg border border-gray-200 mb-4">
            <Image
              src={`/products/${product.images[0]}`}
              alt={product.name}
              width={500}
              height={500}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex gap-2">
            {product.images.map((img, index) => (
              <Image
                key={index}
                src={`/products/${img}`}
                alt={`${product.name} ${index}`}
                width={80}
                height={80}
                className="rounded border hover:ring-2 hover:ring-primary cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-lg text-primary font-semibold mb-4">
            {t('product.price', { price: product.price.toFixed(2) })}
          </p>

          {/* Description */}
          {product.description && <p className="mb-4 text-gray-700">{product.description}</p>}

          {product.customizable && (
            <p className="text-sm text-blue-600 mb-4">{t('product.customizable')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
