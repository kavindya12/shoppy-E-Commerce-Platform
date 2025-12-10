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
      // alert('Added to cart!'); (will be replaced by toasts in a later step)
    } catch (error) {
      // (likewise, will use toast)
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!product) return <div className="text-center py-12">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        <div>
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/500'}
            alt={product.name}
            className="w-full rounded-lg h-56 sm:h-80 object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 line-clamp-2">{product.name}</h1>
          <div className="mb-3 mt-1">
            {product.salePrice ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-2xl sm:text-3xl font-bold text-primary">{formatPrice(product.salePrice, state.currency || 'USD')}</span>
                <span className="text-lg sm:text-xl text-gray-500 line-through">{formatPrice(product.price, state.currency || 'USD')}</span>
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">{Math.round((1 - product.salePrice / product.price) * 100)}% OFF</span>
              </div>
            ) : (
              <span className="text-2xl sm:text-3xl font-bold text-primary">{formatPrice(product.price, state.currency || 'USD')}</span>
            )}
          </div>

          <p className="text-gray-700 mb-4 text-base sm:text-lg">{product.description}</p>

          <div className="flex gap-4 overflow-x-auto whitespace-nowrap text-sm font-semibold mb-4">
            <span>Stock: <span className="text-gray-700">{product.stock}</span></span>
            <span>Category: <span className="text-gray-700">{product.category}</span></span>
            {product.brand && (<span>Brand: <span className="text-gray-700">{product.brand}</span></span>)}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 mb-5">
            <label>Qty:</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-24 border rounded px-2 py-2 text-center text-lg focus:ring-2"
              style={{ touchAction: 'manipulation' }}
            />
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 w-full sm:w-auto bg-primary text-white px-5 py-3 sm:py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 font-bold text-base tracking-wide active:scale-95 transition ml-0"
              style={{ touchAction: 'manipulation' }}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <ReviewSection productId={id} />
      </div>
    </div>
  );
};

export default ProductDetails;

