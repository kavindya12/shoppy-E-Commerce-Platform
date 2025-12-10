import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';

const SignupSuccess = () => {
  const navigate = useNavigate();
  const { dispatch } = useStore();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'SET_USER', payload: null });
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-6">Account Created!</h1>
      <p className="mb-6">Your account has been created successfully. You can now login or continue shopping.</p>
      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 mb-4"
      >
        Logout
      </button>
      <button
        onClick={() => navigate('/login')}
        className="w-full bg-primary text-white px-6 py-3 rounded hover:bg-blue-600"
      >
        Login
      </button>
      <button
        onClick={() => navigate('/')}
        className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded hover:bg-gray-300 mt-2"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default SignupSuccess;
