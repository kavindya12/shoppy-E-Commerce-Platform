import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const addReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;
    // Prevent multiple reviews by same user for same product
    const existing = await Review.findOne({ product: productId, user: userId });
    if (existing) return res.status(400).json({ error: 'You already reviewed this product' });
    const review = new Review({ product: productId, user: userId, rating, comment });
    await review.save();
    await Product.findByIdAndUpdate(productId, { $push: { reviews: review._id } });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};
