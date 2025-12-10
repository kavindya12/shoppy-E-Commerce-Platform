import React, { useState } from 'react';
import CouponInput from '../components/CouponInput';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import api from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useStore();
  const [formData, setFormData] = useState({
    shippingAddress: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [coupon, setCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [consent, setConsent] = useState({
    marketing: false,
    personalization: false,
    analytics: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.user) {
      navigate('/login');
      return;
    }
    // Require at least analytics consent for checkout (PDPA)
    if (!consent.analytics) {
      alert('You must consent to analytics data collection to place an order (PDPA requirement).');
      return;
    }
    try {
      const orderData = {
        shippingAddress: formData.shippingAddress,
        paymentDetails: {
          method: formData.paymentMethod,
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
        },
        coupon: coupon ? coupon.code : undefined,
        discount: discount,
        consent,
      };
      await api.post('/orders', orderData);
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order');
    }
  };

  if (!state.user) {
    return (
      <div className="text-center py-12">
        <p>Please login to checkout</p>
        <button onClick={() => navigate('/login')} className="text-primary hover:underline">
          Login
        </button>
      </div>
    );
  }

  // Calculate order total
  const orderTotal = state.cart.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
  const finalTotal = Math.max(0, orderTotal - discount);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <CouponInput orderTotal={orderTotal} onApply={data => {
        setCoupon(data);
        setDiscount(data ? data.discount : 0);
      }} />
      <div className="mb-4">
        <div>Order Total: <span className="font-bold">${orderTotal.toFixed(2)}</span></div>
        {discount > 0 && <div>Discount: <span className="text-green-600">-${discount.toFixed(2)}</span></div>}
        <div className="text-lg">Final Total: <span className="font-bold">${finalTotal.toFixed(2)}</span></div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="my-4">
          <label className="block font-semibold mb-2">Consent & Privacy</label>
          <div className="mb-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={consent.analytics} onChange={e => setConsent({ ...consent, analytics: e.target.checked })} />
              I consent to analytics data collection (required)
            </label>
          </div>
          <div className="mb-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={consent.marketing} onChange={e => setConsent({ ...consent, marketing: e.target.checked })} />
              I consent to receive marketing communications
            </label>
          </div>
          <div className="mb-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={consent.personalization} onChange={e => setConsent({ ...consent, personalization: e.target.checked })} />
              I consent to personalized recommendations
            </label>
          </div>
        </div>
        <div>
          <label className="block mb-2 font-semibold">Shipping Address</label>
          <textarea
            value={formData.shippingAddress}
            onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
            required
            className="w-full border rounded px-4 py-2"
            rows="3"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Payment Method</label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            className="w-full border rounded px-4 py-2"
          >
            <option value="card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>

        {formData.paymentMethod === 'card' && (
          <>
            <div>
              <label className="block mb-2 font-semibold">Card Number</label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                required
                className="w-full border rounded px-4 py-2"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-semibold">Expiry Date</label>
                <input
                  type="text"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  required
                  className="w-full border rounded px-4 py-2"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">CVV</label>
                <input
                  type="text"
                  value={formData.cvv}
                  onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                  required
                  className="w-full border rounded px-4 py-2"
                  placeholder="123"
                />
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-primary text-white px-6 py-3 rounded hover:bg-blue-600"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;

