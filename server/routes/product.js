import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from '../controllers/productController.js';
import { auth, adminCheck } from '../middleware/auth.js';
import { checkMongoConnection } from '../middleware/mongoCheck.js';

const router = express.Router();

router.get('/', checkMongoConnection, getProducts);
router.get('/categories', checkMongoConnection, getCategories);
router.get('/:id', checkMongoConnection, getProduct);

// Admin CRUD
router.post('/', auth, adminCheck, createProduct);
router.put('/:id', auth, adminCheck, updateProduct);
router.delete('/:id', auth, adminCheck, deleteProduct);

export default router;

