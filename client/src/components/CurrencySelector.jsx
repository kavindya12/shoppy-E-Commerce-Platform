import React from 'react';
import { useStore } from '../store/store';

const CurrencySelector = () => {
  const { state, dispatch } = useStore();
  const currency = state.currency || 'USD';

  const handleChange = (e) => {
    dispatch({ type: 'SET_CURRENCY', payload: e.target.value });
    localStorage.setItem('currency', e.target.value);
  };

  return (
    <select
      value={currency}
      onChange={handleChange}
      className="border rounded px-2 py-1 text-sm"
    >
      <option value="USD">USD ($)</option>
      <option value="LKR">LKR (Rs.)</option>
    </select>
  );
};

export default CurrencySelector;

