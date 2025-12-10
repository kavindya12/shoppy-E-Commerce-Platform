import express from 'express';
import { register, login, resetPassword } from '../controllers/authController.js';
import { checkMongoConnection } from '../middleware/mongoCheck.js';

const router = express.Router();

router.post('/register', checkMongoConnection, register);
router.post('/login', checkMongoConnection, login);
router.post('/reset-password', checkMongoConnection, resetPassword);

export default router;

