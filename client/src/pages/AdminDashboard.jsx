import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import api from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { state } = useStore();
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    salePrice: '',
    stock: '',
    description: '',
    brand: '',
    images: '',
  });

  useEffect(() => {
    if (!state.user || state.user.role !== 'admin') {
      navigate('/');
      return;
    }
    Promise.all([
      api.get('/admin/dashboard'),
      api.get('/products'),
    ])
      .then(([dashboardRes, productsRes]) => {
        setDashboard(dashboardRes.data);
        setProducts(productsRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [state.user, navigate]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        salePrice: productForm.salePrice ? parseFloat(productForm.salePrice) : undefined,
        stock: parseInt(productForm.stock),
        images: productForm.images.split(',').map(url => url.trim()).filter(Boolean),
      };
      // Step 1: Upload product (get productId)
      const createRes = await api.post('/products', productData);
      const productId = createRes.data._id;
      // Step 2: AI image processing (LightX/Pebblely)
      const originalUrl = productData.images[0];
      let cleanUrl = originalUrl;
      try {
        // Example: Pebblely API call (replace with real API and key)
        const pebblelyRes = await fetch('https://api.pebblely.com/remove-bg', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer YOUR_API_KEY' },
          body: JSON.stringify({ image_url: originalUrl })
        });
        const pebblelyData = await pebblelyRes.json();
        if (pebblelyData?.clean_url) cleanUrl = pebblelyData.clean_url;
      } catch (err) {
        // fallback: use original if AI fails
        cleanUrl = originalUrl;
      }
      // Step 3: Update product images (PUT)
      await api.put(`/admin/products/${productId}/images`, {
        images: [cleanUrl, originalUrl],
        primary: cleanUrl
      });
      alert('Product created and image processed!');
      setShowProductForm(false);
      setProductForm({
        name: '', category: '', price: '', salePrice: '', stock: '', description: '', brand: '', images: '',
      });
      // Refresh products
      api.get('/products').then(res => setProducts(res.data));
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Failed to create product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold">{dashboard.users}</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Total Products</h3>
            <p className="text-3xl font-bold">{dashboard.products}</p>
          </div>
          <div className="bg-yellow-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
            <p className="text-3xl font-bold">{dashboard.orders}</p>
          </div>
        </div>
      )}

      <div className="mb-4">
        <button
          onClick={() => setShowProductForm(!showProductForm)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showProductForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {showProductForm && (
        <form onSubmit={handleCreateProduct} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Create Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              required
              className="border rounded px-4 py-2"
            />
            <input
              type="text"
              placeholder="Category"
              value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
              required
              className="border rounded px-4 py-2"
            />
            <input
              type="number"
              placeholder="Price"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              required
              className="border rounded px-4 py-2"
            />
            <input
              type="number"
              placeholder="Sale Price (optional)"
              value={productForm.salePrice}
              onChange={(e) => setProductForm({ ...productForm, salePrice: e.target.value })}
              className="border rounded px-4 py-2"
            />
            <input
              type="number"
              placeholder="Stock"
              value={productForm.stock}
              onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
              required
              className="border rounded px-4 py-2"
            />
            <input
              type="text"
              placeholder="Brand"
              value={productForm.brand}
              onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
              className="border rounded px-4 py-2"
            />
            <textarea
              placeholder="Description"
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              required
              className="border rounded px-4 py-2 md:col-span-2"
              rows="3"
            />
            <input
              type="text"
              placeholder="Image URLs (comma separated)"
              value={productForm.images}
              onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
              className="border rounded px-4 py-2 md:col-span-2"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-primary text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Create Product
          </button>
        </form>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">All Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Category</th>
                <th className="border p-2 text-left">Price</th>
                <th className="border p-2 text-left">Stock</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2">{product.category}</td>
                  <td className="border p-2">${product.salePrice || product.price}</td>
                  <td className="border p-2">{product.stock}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

