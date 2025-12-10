import React, { useState } from 'react';
import api from '../services/api';

const ProductComparison = () => {
  const [products, setProducts] = useState([]);
  const [productIds, setProductIds] = useState(['', '']);

  const handleCompare = async () => {
    if (productIds.filter(id => id).length < 2) {
      alert('Please select at least 2 products to compare');
      return;
    }
    try {
      const res = await api.post('/compare', { productIds: productIds.filter(id => id) });
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to compare products:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Compare Products</h2>
      
      <div className="mb-4 space-y-2">
        {productIds.map((id, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Product ${idx + 1} ID`}
            value={id}
            onChange={(e) => {
              const newIds = [...productIds];
              newIds[idx] = e.target.value;
              setProductIds(newIds);
            }}
            className="w-full border rounded px-4 py-2"
          />
        ))}
        <button
          onClick={() => setProductIds([...productIds, ''])}
          className="text-primary hover:underline"
        >
          + Add another product
        </button>
      </div>

      <button
        onClick={handleCompare}
        className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-600 mb-6"
      >
        Compare
      </button>

      {products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border p-2">Feature</th>
                {products.map((product) => (
                  <th key={product._id} className="border p-2">{product.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 font-semibold">Price</td>
                {products.map((product) => (
                  <td key={product._id} className="border p-2">
                    ${product.salePrice || product.price}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border p-2 font-semibold">Category</td>
                {products.map((product) => (
                  <td key={product._id} className="border p-2">{product.category}</td>
                ))}
              </tr>
              <tr>
                <td className="border p-2 font-semibold">Stock</td>
                {products.map((product) => (
                  <td key={product._id} className="border p-2">{product.stock}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductComparison;

