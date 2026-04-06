import express from 'express';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import {
  getProfile,
  updateProfile,
  deleteAccount,
  getOrderHistory,
  getOrderDetails,
  canReview,
} from '../controllers/userController.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/profile', getProfile);
router.put('/profile', upload.single('avatar'), updateProfile);
router.delete('/account', deleteAccount);

router.get('/orders', getOrderHistory);
router.get('/orders/:orderId', getOrderDetails);
router.get('/orders/:orderId/can-review', canReview);

export default router;
