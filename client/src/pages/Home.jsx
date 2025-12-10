import React, { useEffect, useState } from 'react';
import HeroCarousel from '../components/HeroCarousel';
// import CategoryChips from '../components/CategoryChips';
import CategoryFlyout from '../components/CategoryFlyout';
import FlashSaleTimer from '../components/FlashSaleTimer';
import ProductCard from '../components/ProductCard';
import RecentViewedItems from '../components/RecentViewedItems';
import api from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/products?limit=8')
      .then(res => {
        // Handle both array response and object with products array
        const productsData = Array.isArray(res.data) ? res.data : (res.data.products || []);
        setProducts(productsData);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setProducts([]);
      });

    api.get('/products/categories')
      .then(res => {
        const categoriesData = Array.isArray(res.data) ? res.data : [];
        setCategories(categoriesData);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setCategories([]);
      });
  }, []);

  return (
    <div>
      <HeroCarousel />
      <div className="flex gap-8 max-w-7xl mx-auto px-4">
        <CategoryFlyout />
        <div className="flex-1">
          <FlashSaleTimer />
          <section className="py-8">
            <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
          <RecentViewedItems />
        </div>
      </div>
    </div>
  );
};

export default Home;

