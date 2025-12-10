import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/store';

import { formatPrice } from '../utils/currency';
import WishlistButton from './WishlistButton';

const ProductCard = ({ product }) => {
  const { state } = useStore();
  const currency = state.currency || 'USD';
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <Link
      to={`/products/${product._id}`}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group"
    >
      <div className="relative">
        <img
          src={product.images?.[0] || `https://source.unsplash.com/featured/300x300?product,${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
            -{discount}%
          </span>
        )}
        <WishlistButton product={product} />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <div>
            {product.salePrice ? (
              <div>
                <span className="text-xl font-bold text-primary">{formatPrice(product.salePrice, currency)}</span>
                <span className="text-sm text-gray-500 line-through ml-2">{formatPrice(product.price, currency)}</span>
              </div>
            ) : (
              <span className="text-xl font-bold text-primary">{formatPrice(product.price, currency)}</span>
            )}
          </div>
          {product.stock < 10 && product.stock > 0 && (
            <span className="text-xs text-orange-500">Only {product.stock} left</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

