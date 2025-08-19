'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';

const STORAGE_KEY = 'recentlyViewedProducts';
const fetchRecentlyViewed = () => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  let items = stored ? JSON.parse(stored) : [];
  return items.slice(0, 3);
};

const RecentlyViewed = ({ excludeId }) => {
  const { data: recentlyViewedProducts = [], mutate } = useSWR(
    STORAGE_KEY,
    fetchRecentlyViewed,
    {
      revalidateOnFocus: false,
      dedupingInterval: 0, 
    }
  );

  useEffect(() => {
    const handler = () => mutate();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [mutate]);

  const filteredProducts = excludeId
    ? recentlyViewedProducts.filter((p) => p.id !== excludeId)
    : recentlyViewedProducts;

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="block"
          >
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="relative w-full h-32 bg-gray-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw,
                         (max-width: 1200px) 50vw,
                         33vw"
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {product.name}
                </h3>
                <p className="text-blue-600 font-bold mt-1">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
