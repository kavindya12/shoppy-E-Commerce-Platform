import React from 'react';
import { Link } from 'react-router-dom';

const CategoryChips = ({ categories = [] }) => {

  // AliExpress-style categories
  const defaultCategories = [
    'Women Clothing',
    'Men Clothing',
    'Phones & Telecommunications',
    'Consumer Electronics',
    'Computer & Office',
    'Jewelry & Watches',
    'Home & Garden',
    'Bags & Shoes',
    'Toys, Kids & Babies',
    'Sports & Outdoors',
    'Beauty & Hair',
    'Automobiles & Motorcycles',
    'Home Appliances',
    'Tools & Home Improvement',
    'Furniture',
    'Lights & Lighting',
    'Mother & Kids',
    'Security & Protection',
    'Office & School Supplies',
    'Pet Products',
    'Food',
    'Health & Personal Care',
    'Shoes',
    'Watches',
    'Accessories',
    'Luggage & Bags',
    'Underwear & Sleepwear',
    'Wedding & Events',
    'Novelty & Special Use',
    'Electronic Components',
    'Camera & Photo',
    'Musical Instruments',
    'Books',
    'Stationery',
    'Crafts',
    'Groceries',
    'Gaming',
    'Software',
    'Office Electronics',
    'Garden Supplies',
    'Pet Supplies',
    'Smart Devices',
    'Drones',
    'Car Electronics',
    'Motorcycle Accessories',
    'Industrial Equipment',
    'Measurement & Analysis',
    'Apparel Accessories',
    'Eyewear',
    'Shoes & Accessories',
    'Swimwear',
    'Socks & Hosiery',
    'Costumes',
    'Baby Care',
    'Diapering',
    'Feeding',
    'Strollers',
    'Safety',
    'Bathing',
    'Maternity',
    'Kids Shoes',
    'Kids Clothing',
    'School Bags',
    'Art Supplies',
    'Party Supplies',
    'Seasonal Decor',
    'Travel Accessories',
    'Outdoor Fun',
    'Camping & Hiking',
    'Cycling',
    'Fishing',
    'Fitness & Bodybuilding',
    'Team Sports',
    'Water Sports',
    'Winter Sports',
    'Golf',
    'Running',
    'Yoga',
    'Hunting',
    'Climbing',
    'Skateboarding',
    'Scooters',
    'RC Toys',
    'Puzzle & Games',
    'Building Toys',
    'Dolls & Plush',
    'Action Figures',
    'Learning & Education',
    'Baby Toys',
    'Remote Control',
    'Board Games',
    'Musical Toys',
    'Pretend Play',
    'Model Building',
    'Collectibles',
    'Science & Discovery',
    'Novelty Toys',
    'Gift Cards',
    'Other',
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {displayCategories.map((category, idx) => (
          <Link
            key={idx}
            to={`/products?category=${encodeURIComponent(category)}`}
            className="px-4 py-2 bg-gray-100 hover:bg-primary hover:text-white rounded-full transition cursor-pointer"
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryChips;

