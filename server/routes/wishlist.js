import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
} from '../controllers/wishlistController.js';

const router = express.Router();

router.get('/', auth, getWishlist);
router.post('/:productId', auth, addToWishlist);
router.delete('/:productId', auth, removeFromWishlist);
router.delete('/', auth, clearWishlist);

export default router;
