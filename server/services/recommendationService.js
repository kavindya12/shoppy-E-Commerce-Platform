import Product from '../models/Product.js';

/**
 * Get recommended products based on user's recent searches and category preferences
 * @param {string} userId - User ID
 * @param {Array<string>} recentSearches - Array of recent search terms
 * @param {Array<string>} categories - Array of preferred categories
 * @returns {Promise<Array>} Recommended products
 */
export const getRecommendedProducts = async (userId, recentSearches = [], categories = []) => {
  try {
    let filter = {};

    // If we have recent searches, prioritize products matching those terms
    if (recentSearches.length > 0) {
      filter.$or = [
        { name: { $regex: recentSearches.join('|'), $options: 'i' } },
        { category: { $in: recentSearches } },
        { description: { $regex: recentSearches.join('|'), $options: 'i' } },
      ];
    }

    // If we have categories, add them to the filter
    if (categories.length > 0) {
      filter.category = { $in: categories };
    }

    // If no filters, return popular products (by stock or reviews)
    if (Object.keys(filter).length === 0) {
      filter = { stock: { $gt: 0 } };
    }

    const products = await Product.find(filter)
      .limit(6)
      .populate('reviews')
      .sort({ createdAt: -1 });

    return products;
  } catch (error) {
    console.error('Error in recommendation service:', error);
    return [];
  }
};

