import express from 'express';
import { auth, adminCheck } from '../middleware/auth.js';
import { getDashboard } from '../controllers/adminController.js';

const router = express.Router();

router.get('/dashboard', auth, adminCheck, getDashboard);

export default router;

