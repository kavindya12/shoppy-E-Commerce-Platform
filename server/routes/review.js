import express from 'express';
import { auth } from '../middleware/auth.js';
import { addReview, getReviews } from '../controllers/reviewController.js';

const router = express.Router();

router.get('/:productId', getReviews);
router.post('/:productId', auth, addReview);

export default router;
