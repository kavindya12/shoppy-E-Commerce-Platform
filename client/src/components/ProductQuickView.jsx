import React, { useState } from 'react';
import Modal from './Modal';
import { formatPrice } from '../utils/currency';
import WishlistButton from './WishlistButton';

const ProductQuickView = ({ product, open, onClose }) => {
  if (!product) return null;
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-48 h-48 object-cover rounded"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <div className="mb-2">
            {product.salePrice ? (
              <>
                <span className="text-xl font-bold text-primary">{formatPrice(product.salePrice)}</span>
                <span className="text-sm text-gray-500 line-through ml-2">{formatPrice(product.price)}</span>
                {discount > 0 && (
                  <span className="ml-2 text-red-500 font-semibold">-{discount}%</span>
                )}
              </>
            ) : (
              <span className="text-xl font-bold text-primary">{formatPrice(product.price)}</span>
            )}
          </div>
          <div className="mb-2 text-gray-700 dark:text-gray-300">{product.description}</div>
          <WishlistButton product={product} />
        </div>
      </div>
    </Modal>
  );
};

export default ProductQuickView;
