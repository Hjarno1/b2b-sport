'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { mockProducts, type Product } from '@/lib/data/mock-data';

export default function StaffProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setImageIndex(0);
  };

  const closeModal = () => setSelectedProduct(null);

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedProduct || selectedProduct.images.length === 0) return;
    setImageIndex((prev) => (prev + 1) % selectedProduct.images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedProduct || selectedProduct.images.length === 0) return;
    setImageIndex(
      (prev) => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length,
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <select className="border px-2 py-1 rounded">
          <option>2024/2025</option>
          <option>2023/2024</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {mockProducts.map((product) => (
          <div key={product.id} className="border rounded p-4 group relative">
            {product.images.length > 0 && (
              <Image
                src={`/products/${product.images[0]}`}
                alt={product.name}
                width={300}
                height={300}
                className="object-cover w-full h-72 rounded cursor-pointer"
                onClick={() => openModal(product)}
              />
            )}
            <h2
              className="font-semibold text-lg cursor-pointer mt-2"
              onClick={() => openModal(product)}
            >
              {product.name}
            </h2>
            {/* Price is intentionally hidden for Club Staff */}
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative bg-white p-4 rounded max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={`/products/${selectedProduct.images[imageIndex]}`}
              alt={selectedProduct.name}
              width={800}
              height={600}
              className="object-contain mx-auto max-h-[80vh]"
            />
            {selectedProduct.images.length > 1 && (
              <>
                <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                  <button
                    onClick={(e) => prevImage(e)}
                    className="text-black text-3xl bg-white bg-opacity-80 px-2 rounded-full"
                  >
                    &#8249;
                  </button>
                </div>
                <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                  <button
                    onClick={(e) => nextImage(e)}
                    className="text-black text-3xl bg-white bg-opacity-80 px-2 rounded-full"
                  >
                    &#8250;
                  </button>
                </div>
              </>
            )}
            <button
              className="absolute top-2 right-2 text-white bg-black rounded-full px-3 py-1"
              onClick={closeModal}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
