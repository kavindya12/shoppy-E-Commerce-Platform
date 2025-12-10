import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import CartItem from '../components/CartItem';
import api from '../services/api';
import { formatPrice } from '../utils/currency';

const Cart = () => {
  const navigate = useNavigate();
  const { state } = useStore();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state.user) {
      navigate('/login');
      return;
    }
    api.get('/cart')
      .then(res => {
        setCart(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [state.user, navigate]);

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => {
      const price = item.product?.salePrice || item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link to="/products" className="text-primary hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {cart.items.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>
        
        <div className="bg-gray-100 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(calculateTotal(), state.currency || 'USD')}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{formatPrice(10, state.currency || 'USD')}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total:</span>
              <span>{formatPrice(calculateTotal() + 10, state.currency || 'USD')}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="block w-full bg-primary text-white text-center px-6 py-3 rounded hover:bg-blue-600"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;

