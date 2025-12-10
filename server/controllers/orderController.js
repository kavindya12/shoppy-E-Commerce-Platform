import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentDetails } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    let total = 0;
    for (const item of cart.items) {
      const price = item.product.salePrice || item.product.price;
      total += price * item.quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentDetails: paymentDetails || {},
      total,
      status: 'pending',
    });

    // Clear cart after order creation
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if order belongs to user or user is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

