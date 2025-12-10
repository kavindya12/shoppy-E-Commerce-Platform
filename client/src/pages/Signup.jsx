import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import api from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const { dispatch } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [consent, setConsent] = useState({
    marketing: false,
    personalization: false,
    analytics: false,
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // Require at least analytics consent for signup (PDPA)
    if (!consent.analytics) {
      setError('You must consent to analytics data collection to use this service (PDPA requirement).');
      return;
    }
    try {
      const res = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        consent,
      });
      navigate('/signup-success');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
        <div>
          <label className="block mb-2 font-semibold">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Confirm Password</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            className="w-full border rounded px-4 py-2"
          />
        </div>
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
        <button
          type="submit"
          className="w-full bg-primary text-white px-6 py-3 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
      </p>
    </div>
  );
};

export default Signup;

