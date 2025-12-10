import React, { useState } from 'react';
import CouponInput from '../components/CouponInput';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import api from '../services/api';
import { useToast } from '../components/Toast';

// Helpers for validation
function luhnCheck(num) {
  let arr = (num + '').split('').reverse().map(x => parseInt(x));
  let sum = arr.reduce((acc, val, idx) => acc + (idx % 2 ? ((val *= 2) > 9 ? val - 9 : val) : val), 0);
  return sum % 10 === 0;
}
function isFutureExpiry(str) {
  if (!/^\d{2}\/\d{2}$/.test(str)) return false;
  const [mm, yy] = str.split('/').map(Number);
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  const year = now.getFullYear() % 100;
  const month = now.getMonth() + 1;
  return yy > year || (yy === year && mm >= month);
}

const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useStore();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    shippingAddress: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [formError, setFormError] = useState({});
  const [coupon, setCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [consent, setConsent] = useState({
    marketing: false,
    personalization: false,
    analytics: false,
  });
  const [apiError, setApiError] = useState(null);

  // Validate fields on change/submit
  function validate(fields = formData) {
    const error = {};
    if (!fields.shippingAddress || fields.shippingAddress.length < 6) {
      error.shippingAddress = 'Address too short';
    }
    if (fields.paymentMethod === 'card') {
      if (!/^[0-9]{13,19}$/.test(fields.cardNumber)) {
        error.cardNumber = 'Invalid card number length';
      } else if (!luhnCheck(fields.cardNumber)) {
        error.cardNumber = 'Invalid card number';
      }
      if (!isFutureExpiry(fields.expiryDate)) {
        error.expiryDate = 'Format: MM/YY, not expired';
      }
      if (!/^[0-9]{3,4}$/.test(fields.cvv)) {
        error.cvv = 'CVV must be 3-4 digits';
      }
    }
    return error;
  }

  // Attach validation to every change
  function handleChange(field, value) {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    setFormError(validate(updated));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    const errorFound = validate();
    setFormError(errorFound);
    if (Object.keys(errorFound).length > 0) return;
    if (!state.user) {
      navigate('/login');
      return;
    }
    if (!consent.analytics) {
      showToast('You must consent to analytics data collection to place an order (PDPA requirement).', 'error');
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
      showToast('Order placed successfully!', 'success');
      navigate('/orders');
    } catch (error) {
      setApiError('Failed to place order');
      showToast('Failed to place order', 'error');
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
  const orderTotal = state.cart.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
  const finalTotal = Math.max(0, orderTotal - discount);

  return (
    <div className="max-w-lg w-full mx-auto px-2 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-6 text-center">Checkout</h1>
      {apiError && (
        <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded mb-4 text-sm">{apiError}</div>
      )}
      <CouponInput orderTotal={orderTotal} onApply={data => {
        setCoupon(data);
        setDiscount(data ? data.discount : 0);
        if (data) showToast('Discount applied!', 'success');
        else showToast('Coupon invalid or expired', 'error');
      }} />
      <div className="mb-4 text-sm sm:text-base">
        <div>Order Total: <span className="font-bold">${orderTotal.toFixed(2)}</span></div>
        {discount > 0 && <div>Discount: <span className="text-green-600">-${discount.toFixed(2)}</span></div>}
        <div className="text-lg">Final Total: <span className="font-bold">${finalTotal.toFixed(2)}</span></div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <div className="my-2">
          <label className="block font-semibold mb-1.5">Consent & Privacy</label>
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={consent.analytics} onChange={e => setConsent({ ...consent, analytics: e.target.checked })} />
              I consent to analytics data collection (required)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={consent.marketing} onChange={e => setConsent({ ...consent, marketing: e.target.checked })} />
              I consent to receive marketing communications
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={consent.personalization} onChange={e => setConsent({ ...consent, personalization: e.target.checked })} />
              I consent to personalized recommendations
            </label>
          </div>
        </div>
        {/* Address */}
        <div>
          <label className="block mb-1 font-semibold">Shipping Address</label>
          <textarea
            value={formData.shippingAddress}
            onChange={e => handleChange('shippingAddress', e.target.value)}
            required
            minLength={6}
            className={`w-full border rounded px-4 py-2 focus:ring-2 ${formError.shippingAddress ? 'border-red-400' : 'border-gray-300'}`}
            rows="2"
          />
          {formError.shippingAddress && <div className="text-red-500 text-sm mt-1">{formError.shippingAddress}</div>}
        </div>
        {/* Payment Method */}
        <div>
          <label className="block mb-1 font-semibold">Payment Method</label>
          <select
            value={formData.paymentMethod}
            onChange={e => handleChange('paymentMethod', e.target.value)}
            className="w-full border rounded px-4 py-2"
          >
            <option value="card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>
        {/* Card fields */}
        {formData.paymentMethod === 'card' && (
          <>
            <div>
              <label className="block mb-1 font-semibold">Card Number</label>
              <input
                type="tel"
                autoComplete="cc-number"
                inputMode="numeric"
                value={formData.cardNumber}
                onChange={e => handleChange('cardNumber', e.target.value.replace(/[^0-9]/g, ''))}
                required
                maxLength={19}
                minLength={13}
                className={`w-full border rounded px-4 py-2 focus:ring-2 ${formError.cardNumber ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="1234 5678 9012 3456"
              />
              {formError.cardNumber && <div className="text-red-500 text-sm mt-1">{formError.cardNumber}</div>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold">Expiry Date</label>
                <input
                  type="text"
                  autoComplete="cc-exp"
                  inputMode="numeric"
                  value={formData.expiryDate}
                  onChange={e => handleChange('expiryDate', e.target.value.replace(/[^0-9\/]/g, ''))}
                  required
                  maxLength={5}
                  placeholder="MM/YY"
                  className={`w-full border rounded px-4 py-2 focus:ring-2 ${formError.expiryDate ? 'border-red-400' : 'border-gray-300'}`}
                />
                {formError.expiryDate && <div className="text-red-500 text-sm mt-1">{formError.expiryDate}</div>}
              </div>
              <div>
                <label className="block mb-1 font-semibold">CVV</label>
                <input
                  type="tel"
                  autoComplete="cc-csc"
                  inputMode="numeric"
                  value={formData.cvv}
                  onChange={e => handleChange('cvv', e.target.value.replace(/[^0-9]/g, ''))}
                  required
                  maxLength={4}
                  placeholder="123"
                  className={`w-full border rounded px-4 py-2 focus:ring-2 ${formError.cvv ? 'border-red-400' : 'border-gray-300'}`}
                />
                {formError.cvv && <div className="text-red-500 text-sm mt-1">{formError.cvv}</div>}
              </div>
            </div>
          </>
        )}
        <button
          type="submit"
          disabled={Object.keys(formError).length > 0}
          className="w-full bg-primary text-white px-6 py-3 rounded hover:bg-blue-600 disabled:bg-gray-400 font-semibold tracking-wide text-base sm:text-lg"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;

