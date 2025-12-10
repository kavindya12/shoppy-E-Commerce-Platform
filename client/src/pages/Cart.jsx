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
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center sm:text-left">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        <div className="lg:col-span-2 space-y-4 sm:space-y-0">
          {/* Cart Items - vertical list so swipe works nicely on mobile */}
          {cart.items.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>
        <div className="bg-gray-100 p-4 sm:p-6 rounded-lg h-fit sticky top-28">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center sm:text-left">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between "><span>Subtotal:</span>
              <span>{formatPrice(calculateTotal(), state.currency || 'USD')}</span>
            </div>
            <div className="flex justify-between"><span>Shipping:</span>
              <span>{formatPrice(10, state.currency || 'USD')}</span>
            </div>
            <div className="flex justify-between font-bold text-base sm:text-lg pt-2 border-t"><span>Total:</span>
              <span>{formatPrice(calculateTotal() + 10, state.currency || 'USD')}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="block w-full bg-primary text-white text-center px-5 py-4 rounded text-base sm:text-lg font-semibold tracking-wide active:scale-95 transition mt-2"
            style={{ touchAction: 'manipulation' }}
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;

