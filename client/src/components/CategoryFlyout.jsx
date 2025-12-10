import React, { useEffect, useState } from 'react';
import api from '../services/api';

// Example icons for main categories (use your own SVGs or URLs)

const categoryIcons = {
  'Electronics': '🔌',
  'Mobile Phones': '📱',
  'Computers & Accessories': '💻',
  'TV & Home Theater': '📺',
  'Cameras': '📷',
  'Audio': '🔊',
  'Fashion': '👗',
  'Women Clothing': '👚',
  'Men Clothing': '👔',
  'Shoes': '👟',
  'Watches': '⌚',
  'Bags & Wallets': '👜',
  'Beauty & Personal Care': '💄',
  'Health & Household': '🏥',
  'Home & Living': '🏡',
  'Kitchen & Dining': '🍽️',
  'Furniture': '🛋️',
  'Garden': '🌻',
  'Toys & Baby': '🧸',
  'Sports & Outdoors': '🏀',
  'Automotive': '🚗',
  'Books': '📚',
  'Music': '🎵',
  'Movies & TV': '🎬',
  'Office Supplies': '📎',
  'Pet Supplies': '🐶',
  'Groceries': '🛒',
  'Gaming': '🎮',
  'Software': '💾',
  'Jewelry': '💍',
};

const CategoryFlyout = () => {
  const [tree, setTree] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [subHovered, setSubHovered] = useState(null);


  // Use static categories as provided
  const staticCategories = [
    'Electronics', 'Mobile Phones', 'Computers & Accessories', 'TV & Home Theater', 'Cameras', 'Audio', 'Fashion', 'Women Clothing', 'Men Clothing', 'Shoes', 'Watches', 'Bags & Wallets', 'Beauty & Personal Care', 'Health & Household', 'Home & Living', 'Kitchen & Dining', 'Furniture', 'Garden', 'Toys & Baby', 'Sports & Outdoors', 'Automotive', 'Books', 'Music', 'Movies & TV', 'Office Supplies', 'Pet Supplies', 'Groceries', 'Gaming', 'Software', 'Jewelry'
  ];

  useEffect(() => {
    setTree(staticCategories.map((name, idx) => ({ _id: idx, name, children: [] })));
  }, []);

  return (
    <aside className="w-72 bg-white shadow-lg rounded-lg p-4">
      <h3 className="text-xl font-bold mb-4">All Categories</h3>
      <ul className="space-y-1">
        {tree.map(cat => (
          <li key={cat._id} className="relative group">
            <div
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
            >
              <span className="text-2xl">{categoryIcons[cat.name] || '📦'}</span>
              <span className="font-semibold">{cat.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default CategoryFlyout;
