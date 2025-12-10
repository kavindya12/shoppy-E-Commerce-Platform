import User from '../models/User.js';
import Product from '../models/Product.js';

// In-memory store for price drop subscriptions (in production, use a database)
const priceDropSubscriptions = new Map();

/**
 * Subscribe a user to price drop alerts for a product
 * @param {string} userId - User ID
 * @param {string} productId - Product ID
 * @param {number} targetPrice - Target price to alert at
 */
export const subscribeToPriceDrop = async (userId, productId, targetPrice) => {
  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      throw new Error('User or product not found');
    }

    const key = `${userId}-${productId}`;
    priceDropSubscriptions.set(key, {
      userId,
      productId,
      targetPrice,
      currentPrice: product.salePrice || product.price,
      createdAt: new Date(),
    });

    return { success: true, message: 'Subscribed to price drop alerts' };
  } catch (error) {
    console.error('Error subscribing to price drop:', error);
    throw error;
  }
};

/**
 * Unsubscribe a user from price drop alerts for a product
 * @param {string} userId - User ID
 * @param {string} productId - Product ID
 */
export const unsubscribeFromPriceDrop = async (userId, productId) => {
  const key = `${userId}-${productId}`;
  priceDropSubscriptions.delete(key);
  return { success: true, message: 'Unsubscribed from price drop alerts' };
};

/**
 * Check for price drops and notify subscribed users
 * This should be run periodically (e.g., via cron job)
 */
export const checkPriceDrops = async () => {
  try {
    const subscriptions = Array.from(priceDropSubscriptions.values());

    for (const subscription of subscriptions) {
      const product = await Product.findById(subscription.productId);
      if (!product) continue;

      const currentPrice = product.salePrice || product.price;
      const previousPrice = subscription.currentPrice;

      if (currentPrice < previousPrice && currentPrice <= subscription.targetPrice) {
        // Price dropped - notify user
        // TODO: Implement email/notification service
        console.log(
          `Price drop alert: Product ${product.name} dropped from $${previousPrice} to $${currentPrice}`
        );

        // Update subscription with new price
        subscription.currentPrice = currentPrice;
      }
    }
  } catch (error) {
    console.error('Error checking price drops:', error);
  }
};

