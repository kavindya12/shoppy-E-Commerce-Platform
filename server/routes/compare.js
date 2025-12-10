import express from 'express';
import { compareProducts } from '../controllers/compareController.js';

const router = express.Router();

router.post('/', compareProducts);

export default router;

