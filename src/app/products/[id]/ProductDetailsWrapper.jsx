'use client';

import { useState, useContext, useEffect } from 'react';
import ProductDetails from '@/components/ProductDetails';
import { CartContext } from '@/context/CartContext';

const STORAGE_KEY = 'recentlyViewedProducts';

export default function ProductDetailsWrapper({ product }) {
  const { addToCart } = useContext(CartContext);

  const [selectedColor, setSelectedColor] = useState(
    product.variants[0]?.color || ''
  );
  const [selectedSize, setSelectedSize] = useState('');

  const availableSizesForColor =
    product.variants.find((v) => v.color === selectedColor)?.sizes || [];

  useEffect(() => {
    setSelectedSize('');
  }, [selectedColor]);

  useEffect(() => {
    if (!product) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    let products = stored ? JSON.parse(stored) : [];

    products = products.filter((p) => p.id !== product.id);
    products.unshift({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    products = products.slice(0, 3);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert('Please select both a color and size.');
      return;
    }
    addToCart(product, selectedColor, selectedSize);
  };

  return (
    <ProductDetails
      product={product}
      selectedColor={selectedColor}
      selectedSize={selectedSize}
      onColorSelect={setSelectedColor}
      onSizeSelect={setSelectedSize}
      onAddToCart={handleAddToCart}
      availableSizesForColor={availableSizesForColor}
    />
  );
}
