import React from 'react';
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
      <div className="flex flex-col md:flex-row gap-5 sm:gap-6 p-2 sm:p-5 rounded-lg bg-white shadow-xl max-w-2xl mx-auto">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full md:w-48 h-48 object-cover rounded-lg mx-auto md:mx-0 mb-2 md:mb-0"
          style={{ maxWidth: '14rem' }}
        />
        <div className="flex-1 flex flex-col justify-between overflow-x-auto">
          <div>
            <h2 className="text-xl font-bold mb-2 line-clamp-2">{product.name}</h2>
            <div className="mb-2 flex gap-2 items-center flex-wrap">
              {product.salePrice ? (
                <>
                  <span className="text-lg font-bold text-primary">{formatPrice(product.salePrice)}</span>
                  <span className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</span>
                  {discount > 0 && (
                    <span className="text-xs font-bold bg-red-500 text-white px-2 py-1 rounded">-{discount}%</span>
                  )}
                </>
              ) : (
                <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
              )}
            </div>
            <div className="mb-2 text-gray-700 dark:text-gray-300 text-sm max-h-20 overflow-y-auto pr-1">{product.description}</div>
          </div>
          <div className="mt-3 self-end">
            <WishlistButton product={product} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductQuickView;
