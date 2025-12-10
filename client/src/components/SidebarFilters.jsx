import React, { useState } from 'react';

const SidebarFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    category: '',
    sort: 'newest',
  });

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-bold text-lg mb-4">Filters</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Price Range</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2">Sort By</label>
          <select
            value={filters.sort}
            onChange={(e) => handleChange('sort', e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        <button
          onClick={() => {
            const reset = { minPrice: '', maxPrice: '', category: '', sort: 'newest' };
            setFilters(reset);
            onFilterChange(reset);
          }}
          className="w-full bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default SidebarFilters;

