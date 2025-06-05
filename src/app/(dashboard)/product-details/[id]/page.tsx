'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { mockProducts, Product } from '@/lib/data/mock-data'; // <-- 👈 using your mock data

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const found = mockProducts.find((p) => p.id === Number(id));
    setProduct(found ?? null);
  }, [id]);

  if (!product) {
    return <div className="p-8 text-center">🚫 Product not found</div>;
  }
  console.log(product.images[0]);
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
          <p className="text-lg text-primary font-semibold mb-4">{product.price.toFixed(2)} DKK</p>

          {/* Beskrivelse */}
          {product.description && <p className="mb-4 text-gray-700">{product.description}</p>}

          {/* {Array.isArray(product.sizes) && product.sizes.length > 0 && (
              <div className="mb-4">
                <label className="block mb-1 font-medium">Vælg størrelse</label>
                <select
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <option value="">Vælg størrelse</option>
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )} */}

          {product.customizable && (
            <p className="text-sm text-blue-600 mb-4">🎨 Dette produkt kan tilpasses!</p>
          )}

          {/* <button
              className="w-full mt-4 bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary/80 transition"
              onClick={() => alert('🛒 Tilføjet til kurv!')}
            >
              Tilføj til kurv
            </button> */}
        </div>
      </div>
    </div>
  );
}
