import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductQuickView from '../components/ProductQuickView';
import SidebarFilters from '../components/SidebarFilters';
import api from '../services/api';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    category: '',
    sort: 'newest',
  });
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (filters.sort) params.append('sort', filters.sort);

    setLoading(true);
    api.get(`/products?${params.toString()}`)
      .then(res => {
        let filtered = res.data.products || res.data;
        
        if (filters.minPrice) {
          filtered = filtered.filter(p => (p.salePrice || p.price) >= parseFloat(filters.minPrice));
        }
        if (filters.maxPrice) {
          filtered = filtered.filter(p => (p.salePrice || p.price) <= parseFloat(filters.maxPrice));
        }

        setProducts(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [searchParams, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64">
          <SidebarFilters onFilterChange={setFilters} />
        </aside>
        
        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-6">Products</h1>
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No products found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product._id} onClick={e => { e.preventDefault(); setQuickViewProduct(product); setQuickViewOpen(true); }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
          <ProductQuickView
            product={quickViewProduct}
            open={quickViewOpen}
            onClose={() => setQuickViewOpen(false)}
          />
        </main>
      </div>
    </div>
  );
};

export default Products;

