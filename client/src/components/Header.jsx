import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/store';
import SearchBar from './SearchBar';
import CurrencySelector from './CurrencySelector';
import DarkModeToggle from './DarkModeToggle';

const Header = () => {
  const { state } = useStore();
  const { user, cart } = state;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-bold text-2xl text-primary">
            🛍️ Shoopy
          </Link>
          
          <div className="flex-1 max-w-xl mx-4">
            <SearchBar />
          </div>

          <nav className="flex items-center space-x-4">
            <CurrencySelector />
            <DarkModeToggle />
            <Link to="/products" className="text-gray-700 hover:text-primary transition">
              Products
            </Link>
            <Link to="/cart" className="relative text-gray-700 hover:text-primary transition">
              Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            <Link to="/wishlist" className="text-gray-700 hover:text-pink-500 transition">
              Wishlist
            </Link>
            {user ? (
              <>
                <Link to="/orders" className="text-gray-700 hover:text-primary transition">
                  Orders
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary transition">
                    Admin
                  </Link>
                )}
                <span className="text-gray-700">{user.name}</span>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary transition">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

