import React, { useEffect, useState } from 'react';
import HeroCarousel from '../components/HeroCarousel';
import CategoryChips from '../components/CategoryChips';
import CategoryFlyout from '../components/CategoryFlyout';
import FlashSaleTimer from '../components/FlashSaleTimer';
import ProductCard from '../components/ProductCard';
import RecentViewedItems from '../components/RecentViewedItems';
import api from '../services/api';

const mockBestSellers = [];
const mockRecommended = [];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState(mockBestSellers);
  const [recommended, setRecommended] = useState(mockRecommended);

  useEffect(() => {
    api.get('/products?limit=12').then(res => {
      const productsData = Array.isArray(res.data) ? res.data : (res.data.products || []);
      setProducts(productsData);
      setBestSellers(productsData.slice(0, 6));
      setRecommended(productsData.slice(6, 12));
    }).catch(err => {
      setProducts([]);
      setBestSellers([]);
      setRecommended([]);
    });
    api.get('/products/categories').then(res => {
      setCategories(Array.isArray(res.data) ? res.data : []);
    }).catch(() => setCategories([]));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero section */}
      <div className="w-full">
        <HeroCarousel />
      </div>

      {/* Category row */}
      <div className="my-2">
        <CategoryChips categories={categories} />
      </div>

      <div className="container max-w-7xl mx-auto flex lg:flex-row flex-col gap-4 px-2">
        {/* Sticky side flyout (desktop only) */}
        <div className="hidden lg:block lg:w-1/5 pt-2">
          <CategoryFlyout />
        </div>
        <div className="flex-1 w-full">

          {/* Flash Sale/Hot Deals */}
          <FlashSaleTimer />
          <section className="pt-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-2">
              <span role="img" aria-label="flame">🔥</span> Hot Deals
              <span className="ml-2 text-base bg-yellow-400 text-white font-semibold px-2 py-1 rounded">Limited Time</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.slice(0, 8).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>

          <div className="my-8 border-t border-gray-200"></div>

          {/* Best Sellers - Horizontal Scroll */}
          <section className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">Best Sellers</h2>
              <a href="/products?sort=best-seller" className="text-primary hover:underline text-sm">See All &rarr;</a>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {bestSellers.map((p) => (
                <div className="w-64 flex-shrink-0" key={p._id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>

          <div className="my-8 border-t border-gray-200"></div>

          {/* Recommended For You - Horizontal Scroll */}
          <section className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">Recommended For You</h2>
              <a href="/products?sort=recommended" className="text-primary hover:underline text-sm">See All &rarr;</a>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {recommended.map((p) => (
                <div className="w-64 flex-shrink-0" key={p._id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>

          {/* Recently Viewed */}
          <div className="my-8 border-t border-gray-200"></div>
          <RecentViewedItems />
        </div>
      </div>
    </div>
  );
};

export default Home;

