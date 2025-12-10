import React, { useEffect } from 'react';
import { useStore } from '../store/store';
import ProductCard from './ProductCard';

const RecentViewedItems = () => {
  const { state, dispatch } = useStore();
  const { recentViewed } = state;

  useEffect(() => {
    const stored = localStorage.getItem('recentViewed');
    if (stored) {
      dispatch({ type: 'SET_RECENT_VIEWED', payload: JSON.parse(stored) });
    }
  }, [dispatch]);

  if (recentViewed.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Recently Viewed</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {recentViewed.slice(0, 4).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RecentViewedItems;

