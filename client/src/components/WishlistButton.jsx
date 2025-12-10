import React from 'react';
import { useStore } from '../store/store';
import api from '../services/api';

const WishlistButton = ({ product }) => {
  const { state, dispatch } = useStore();
  const isInWishlist = state.wishlist.some(item => item._id === product._id);

  const handleWishlist = async e => {
    e.preventDefault();
    if (!state.user) return alert('Login to use wishlist');
    if (isInWishlist) {
      await api.delete(`/wishlist/${product._id}`);
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product._id });
    } else {
      const res = await api.post(`/wishlist/${product._id}`);
      dispatch({ type: 'SET_WISHLIST', payload: res.data });
    }
  };

  return (
    <button
      onClick={handleWishlist}
      className={`absolute top-2 right-2 p-2 rounded-full bg-white shadow hover:bg-pink-100 transition z-10`}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isInWishlist ? 'red' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-6 h-6 text-pink-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
        />
      </svg>
    </button>
  );
};

export default WishlistButton;
