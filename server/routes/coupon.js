import express from 'express';
import { auth, adminCheck } from '../middleware/auth.js';
import { validateCoupon, createCoupon, getCoupons } from '../controllers/couponController.js';

const router = express.Router();

router.post('/validate', auth, validateCoupon);
router.post('/', auth, adminCheck, createCoupon);
router.get('/', auth, adminCheck, getCoupons);

export default router;
