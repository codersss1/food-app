import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  signup,
  login,
  logout,
  refreshToken,
  verifyEmail,
  verifyStudent,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.post('/verify-email', verifyEmail);
router.post('/verify-student', protect, verifyStudent);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
