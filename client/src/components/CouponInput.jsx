import React, { useState } from 'react';
import api from '../services/api';

const CouponInput = ({ orderTotal, onApply }) => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleApply = async e => {
    e.preventDefault();
    setStatus('');
    setDiscount(0);
    try {
      const res = await api.post('/coupons/validate', { code, orderTotal });
      setDiscount(res.data.discount);
      setStatus('success');
      onApply(res.data);
    } catch (err) {
      setStatus('error');
      setDiscount(0);
      onApply(null);
    }
  };

  return (
    <form onSubmit={handleApply} className="mb-4 flex items-center gap-2">
      <input
        type="text"
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Coupon code"
        className="border rounded px-3 py-2 flex-1"
      />
      <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
        Apply
      </button>
      {status === 'success' && <span className="text-green-600 ml-2">Discount applied!</span>}
      {status === 'error' && <span className="text-red-600 ml-2">Invalid or expired</span>}
    </form>
  );
};

export default CouponInput;
