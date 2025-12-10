import React, { useEffect } from 'react';
import { useStore } from '../store/store';
import { Link } from 'react-router-dom';
import api from '../services/api';

const WishlistPage = () => {
  const { state, dispatch } = useStore();

  useEffect(() => {
    if (state.user) {
      api.get('/wishlist').then(res => {
        dispatch({ type: 'SET_WISHLIST', payload: res.data });
      });
    }
  }, [state.user, dispatch]);

  if (!state.user) return <div className="p-8">Login to view your wishlist.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>
      {state.wishlist.length === 0 ? (
        <div>No items in wishlist.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {state.wishlist.map(product => (
            <Link key={product._id} to={`/products/${product._id}`} className="block bg-white rounded shadow p-4 hover:shadow-lg">
              <img src={product.images?.[0] || 'https://via.placeholder.com/300'} alt={product.name} className="w-full h-40 object-cover mb-2 rounded" />
              <div className="font-semibold">{product.name}</div>
              <div className="text-primary font-bold">${product.salePrice || product.price}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
