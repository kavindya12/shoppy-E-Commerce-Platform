import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shoopy';

const categories = [
  { name: 'Electronics', description: 'Electronic devices and gadgets' },
  { name: 'Fashion', description: 'Clothing and accessories' },
  { name: 'Home & Garden', description: 'Home improvement and garden supplies' },
  { name: 'Sports', description: 'Sports equipment and gear' },
  { name: 'Books', description: 'Books and literature' },
  { name: 'Toys', description: 'Toys and games' },
];

const products = [
  // Electronics
  {
    name: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    images: ['https://via.placeholder.com/300'],
    price: 199.99,
    salePrice: 149.99,
    stock: 50,
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life',
    brand: 'TechBrand',
    specs: { color: 'Black', connectivity: 'Bluetooth 5.0', battery: '30 hours' },
  },
  {
    name: 'Smartphone Pro Max',
    category: 'Electronics',
    images: ['https://via.placeholder.com/300'],
    price: 999.99,
    salePrice: 899.99,
    stock: 30,
    description: 'Latest smartphone with advanced features, 256GB storage, and 6.7 inch display',
    brand: 'TechBrand',
    specs: { storage: '256GB', ram: '8GB', screen: '6.7 inch' },
  },
  {
    name: 'Laptop Stand',
    category: 'Electronics',
    images: ['https://via.placeholder.com/300'],
    price: 39.99,
    stock: 80,
    description: 'Ergonomic aluminum laptop stand for better posture and cooling',
    brand: 'TechBrand',
    specs: { material: 'Aluminum', adjustable: true },
  },
  {
    name: 'Wireless Mouse',
    category: 'Electronics',
    images: ['https://via.placeholder.com/300'],
    price: 29.99,
    salePrice: 19.99,
    stock: 120,
    description: 'Ergonomic wireless mouse with precision tracking',
    brand: 'TechBrand',
    specs: { connectivity: 'Bluetooth/USB', dpi: '1600' },
  },
  {
    name: 'Mechanical Keyboard',
    category: 'Electronics',
    images: ['https://via.placeholder.com/300'],
    price: 129.99,
    salePrice: 99.99,
    stock: 45,
    description: 'RGB mechanical keyboard with cherry MX switches',
    brand: 'TechBrand',
    specs: { switches: 'Cherry MX', backlight: 'RGB' },
  },
  {
    name: 'Smart Watch',
    category: 'Electronics',
    images: ['https://via.placeholder.com/300'],
    price: 299.99,
    salePrice: 249.99,
    stock: 35,
    description: 'Fitness tracking smartwatch with heart rate monitor',
    brand: 'TechBrand',
    specs: { battery: '7 days', waterResistant: '50m' },
  },
  {
    name: 'Tablet 10 inch',
    category: 'Electronics',
    images: ['https://via.placeholder.com/300'],
    price: 399.99,
    stock: 25,
    description: '10-inch tablet with high-resolution display and long battery life',
    brand: 'TechBrand',
    specs: { screen: '10 inch', storage: '128GB' },
  },
  {
    name: 'USB-C Hub',
    category: 'Electronics',
    images: ['https://via.placeholder.com/300'],
    price: 49.99,
    salePrice: 39.99,
    stock: 90,
    description: 'Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader',
    brand: 'TechBrand',
    specs: { ports: '7-in-1', powerDelivery: '100W' },
  },
  // Fashion
  {
    name: 'Cotton T-Shirt',
    category: 'Fashion',
    images: ['https://via.placeholder.com/300'],
    price: 29.99,
    salePrice: 19.99,
    stock: 100,
    description: 'Comfortable 100% cotton t-shirt in various colors and sizes',
    brand: 'FashionCo',
    specs: { material: '100% Cotton', sizes: 'S, M, L, XL' },
  },
  {
    name: 'Denim Jeans',
    category: 'Fashion',
    images: ['https://via.placeholder.com/300'],
    price: 79.99,
    salePrice: 59.99,
    stock: 60,
    description: 'Classic fit denim jeans with stretch comfort',
    brand: 'FashionCo',
    specs: { material: '98% Cotton, 2% Elastane', sizes: '28-38' },
  },
  {
    name: 'Leather Jacket',
    category: 'Fashion',
    images: ['https://via.placeholder.com/300'],
    price: 199.99,
    salePrice: 149.99,
    stock: 30,
    description: 'Genuine leather jacket with quilted lining',
    brand: 'FashionCo',
    specs: { material: 'Genuine Leather', sizes: 'S, M, L, XL' },
  },
  {
    name: 'Running Sneakers',
    category: 'Fashion',
    images: ['https://via.placeholder.com/300'],
    price: 89.99,
    salePrice: 69.99,
    stock: 55,
    description: 'Lightweight running sneakers with cushioned sole',
    brand: 'FashionCo',
    specs: { sizes: '6-12', colors: 'Black, White, Blue' },
  },
  {
    name: 'Wool Sweater',
    category: 'Fashion',
    images: ['https://via.placeholder.com/300'],
    price: 59.99,
    stock: 40,
    description: 'Warm wool sweater perfect for winter',
    brand: 'FashionCo',
    specs: { material: '80% Wool, 20% Acrylic', sizes: 'S, M, L, XL' },
  },
  {
    name: 'Designer Handbag',
    category: 'Fashion',
    images: ['https://via.placeholder.com/300'],
    price: 149.99,
    salePrice: 119.99,
    stock: 20,
    description: 'Elegant designer handbag with multiple compartments',
    brand: 'FashionCo',
    specs: { material: 'Genuine Leather', compartments: '3' },
  },
  // Sports
  {
    name: 'Running Shoes',
    category: 'Sports',
    images: ['https://via.placeholder.com/300'],
    price: 129.99,
    stock: 75,
    description: 'Professional running shoes with advanced cushioning technology',
    brand: 'SportBrand',
    specs: { sizes: '7-12', colors: 'Black, White, Blue' },
  },
  {
    name: 'Yoga Mat',
    category: 'Sports',
    images: ['https://via.placeholder.com/300'],
    price: 39.99,
    salePrice: 29.99,
    stock: 85,
    description: 'Non-slip yoga mat with carrying strap',
    brand: 'SportBrand',
    specs: { thickness: '6mm', material: 'TPE' },
  },
  {
    name: 'Dumbbell Set',
    category: 'Sports',
    images: ['https://via.placeholder.com/300'],
    price: 149.99,
    stock: 25,
    description: 'Adjustable dumbbell set 5-25kg per dumbbell',
    brand: 'SportBrand',
    specs: { weight: '5-25kg', pieces: '2' },
  },
  {
    name: 'Basketball',
    category: 'Sports',
    images: ['https://via.placeholder.com/300'],
    price: 24.99,
    stock: 100,
    description: 'Official size basketball with premium grip',
    brand: 'SportBrand',
    specs: { size: 'Size 7', material: 'Composite Leather' },
  },
  {
    name: 'Tennis Racket',
    category: 'Sports',
    images: ['https://via.placeholder.com/300'],
    price: 89.99,
    salePrice: 69.99,
    stock: 40,
    description: 'Professional tennis racket with carbon fiber frame',
    brand: 'SportBrand',
    specs: { weight: '300g', grip: '4 1/4' },
  },
  // Home & Garden
  {
    name: 'Garden Tool Set',
    category: 'Home & Garden',
    images: ['https://via.placeholder.com/300'],
    price: 79.99,
    salePrice: 59.99,
    stock: 40,
    description: 'Complete 10-piece garden tool set with storage case',
    brand: 'GardenPro',
    specs: { pieces: 10, material: 'Stainless Steel' },
  },
  {
    name: 'Indoor Plant Pot Set',
    category: 'Home & Garden',
    images: ['https://via.placeholder.com/300'],
    price: 34.99,
    stock: 70,
    description: 'Set of 3 ceramic plant pots with drainage holes',
    brand: 'GardenPro',
    specs: { pieces: 3, material: 'Ceramic' },
  },
  {
    name: 'LED String Lights',
    category: 'Home & Garden',
    images: ['https://via.placeholder.com/300'],
    price: 19.99,
    salePrice: 14.99,
    stock: 150,
    description: 'Waterproof LED string lights, 50 feet, warm white',
    brand: 'GardenPro',
    specs: { length: '50ft', bulbs: '150', waterproof: 'Yes' },
  },
  {
    name: 'Garden Hose',
    category: 'Home & Garden',
    images: ['https://via.placeholder.com/300'],
    price: 44.99,
    stock: 50,
    description: '50-foot expandable garden hose with spray nozzle',
    brand: 'GardenPro',
    specs: { length: '50ft', material: 'Rubber' },
  },
  // Books
  {
    name: 'Mystery Novel Collection',
    category: 'Books',
    images: ['https://via.placeholder.com/300'],
    price: 49.99,
    stock: 60,
    description: 'Set of 5 bestselling mystery novels by acclaimed authors',
    brand: 'BookHouse',
    specs: { pages: '1500+', format: 'Paperback' },
  },
  {
    name: 'Programming Guide',
    category: 'Books',
    images: ['https://via.placeholder.com/300'],
    price: 39.99,
    salePrice: 29.99,
    stock: 45,
    description: 'Complete guide to modern web development',
    brand: 'BookHouse',
    specs: { pages: '800', format: 'Paperback' },
  },
  {
    name: 'Cookbook Collection',
    category: 'Books',
    images: ['https://via.placeholder.com/300'],
    price: 59.99,
    stock: 35,
    description: '3-book collection of international recipes',
    brand: 'BookHouse',
    specs: { books: 3, pages: '900+', format: 'Hardcover' },
  },
  // Toys
  {
    name: 'LEGO Building Set',
    category: 'Toys',
    images: ['https://via.placeholder.com/300'],
    price: 89.99,
    salePrice: 69.99,
    stock: 45,
    description: 'Creative building set with 500+ pieces for ages 8+',
    brand: 'ToyBrand',
    specs: { pieces: 500, age: '8+' },
  },
  {
    name: 'Remote Control Car',
    category: 'Toys',
    images: ['https://via.placeholder.com/300'],
    price: 49.99,
    salePrice: 39.99,
    stock: 60,
    description: 'High-speed RC car with 2.4GHz remote control',
    brand: 'ToyBrand',
    specs: { scale: '1:18', battery: 'Rechargeable' },
  },
  {
    name: 'Board Game Collection',
    category: 'Toys',
    images: ['https://via.placeholder.com/300'],
    price: 34.99,
    stock: 80,
    description: 'Set of 5 classic board games for family fun',
    brand: 'ToyBrand',
    specs: { games: 5, players: '2-6' },
  },
  {
    name: 'Puzzle Set 1000 Pieces',
    category: 'Toys',
    images: ['https://via.placeholder.com/300'],
    price: 24.99,
    stock: 90,
    description: '1000-piece jigsaw puzzle with beautiful landscape',
    brand: 'ToyBrand',
    specs: { pieces: 1000, size: '27x19 inches' },
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ email: 'admin@shoopy.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await User.create({
        name: 'Admin User',
        email: 'admin@shoopy.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('✅ Created admin user (email: admin@shoopy.com, password: admin123)');
    }

    // Create test buyer user
    const buyerExists = await User.findOne({ email: 'buyer@shoopy.com' });
    if (!buyerExists) {
      const hashedPassword = await bcrypt.hash('buyer123', 12);
      await User.create({
        name: 'Test Buyer',
        email: 'buyer@shoopy.com',
        password: hashedPassword,
        role: 'buyer',
      });
      console.log('✅ Created test buyer user (email: buyer@shoopy.com, password: buyer123)');
    }

    console.log('✅ Seeding completed successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

seed();

