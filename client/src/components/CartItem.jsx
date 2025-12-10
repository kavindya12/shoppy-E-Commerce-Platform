import React from 'react';
import { useStore } from '../store/store';
import api from '../services/api';
import { formatPrice } from '../utils/currency';
import { useToast } from './Toast';

const CartItem = ({ item }) => {
  const { dispatch, state } = useStore();
  const { showToast } = useToast();

  const handleRemove = async () => {
    try {
      await api.delete(`/cart/${item._id}`);
      dispatch({ type: 'REMOVE_FROM_CART', payload: item._id });
      showToast('Removed item from cart', 'success');
    } catch (error) {
      showToast('Failed to remove item from cart', 'error');
    }
  };

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    try {
      // Update quantity logic here
      dispatch({
        type: 'UPDATE_CART_ITEM',
        payload: { id: item._id, quantity: newQuantity }
      });
      showToast('Updated item quantity', 'success');
    } catch (error) {
      showToast('Failed to update quantity', 'error');
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 border-b">
      <img
        src={item.product?.images?.[0] || 'https://via.placeholder.com/100'}
        alt={item.product?.name}
        className="w-20 h-20 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-semibold">{item.product?.name}</h3>
        <p className="text-gray-500">{formatPrice(item.product?.salePrice || item.product?.price, state.currency || 'USD')}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-8 h-8 rounded border hover:bg-gray-100"
        >
          -
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 rounded border hover:bg-gray-100"
        >
          +
        </button>
      </div>
      <div className="font-bold">
        {formatPrice((item.product?.salePrice || item.product?.price) * item.quantity, state.currency || 'USD')}
      </div>
      <button
        onClick={handleRemove}
        className="text-red-500 hover:text-red-700"
      >
        ✕
      </button>
    </div>
  );
};

export default CartItem;

