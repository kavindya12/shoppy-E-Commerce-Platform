import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/', auth, getCart);
router.post('/', auth, addToCart);
router.put('/:itemId', auth, updateCartItem);
router.delete('/:itemId', auth, removeFromCart);
router.delete('/', auth, clearCart);

export default router;

