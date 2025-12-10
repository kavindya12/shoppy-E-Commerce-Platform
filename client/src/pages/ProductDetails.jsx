import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import ReviewSection from '../components/ReviewSection';
import api from '../services/api';
import { formatPrice } from '../utils/currency';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
        
        // Add to recent viewed
        const recent = JSON.parse(localStorage.getItem('recentViewed') || '[]');
        const updated = [res.data, ...recent.filter(p => p._id !== res.data._id)].slice(0, 10);
        dispatch({ type: 'SET_RECENT_VIEWED', payload: updated });
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id, dispatch]);

  const handleAddToCart = async () => {
    if (!state.user) {
      navigate('/login');
      return;
    }
    try {
      await api.post('/cart', { product: id, quantity });
      alert('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!product) return <div className="text-center py-12">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/500'}
            alt={product.name}
            className="w-full rounded-lg"
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="mb-4">
            {product.salePrice ? (
              <div>
                <span className="text-3xl font-bold text-primary">{formatPrice(product.salePrice, state.currency || 'USD')}</span>
                <span className="text-xl text-gray-500 line-through ml-2">{formatPrice(product.price, state.currency || 'USD')}</span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-primary">{formatPrice(product.price, state.currency || 'USD')}</span>
            )}
          </div>
          
          <p className="text-gray-700 mb-4">{product.description}</p>
          
          <div className="mb-4">
            <p className="font-semibold">Stock: {product.stock}</p>
            <p className="font-semibold">Category: {product.category}</p>
            {product.brand && <p className="font-semibold">Brand: {product.brand}</p>}
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <label>Quantity:</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-20 border rounded px-2 py-1"
            />
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-primary text-white px-6 py-3 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      <ReviewSection productId={id} />
    </div>
  );
};

export default ProductDetails;

