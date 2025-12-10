import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const getDashboard = async (req, res, next) => {
  try {
    const users = await User.countDocuments();
    const products = await Product.countDocuments();
    const orders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $in: ['paid', 'shipped', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    res.json({
      users,
      products,
      orders,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    next(error);
  }
};

