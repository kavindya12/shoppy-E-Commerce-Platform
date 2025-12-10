import Product from '../models/Product.js';

export const compareProducts = async (req, res, next) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
      return res.status(400).json({ error: 'Please provide at least 2 product IDs' });
    }

    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return res.status(404).json({ error: 'One or more products not found' });
    }

    res.json(products);
  } catch (error) {
    next(error);
  }
};

