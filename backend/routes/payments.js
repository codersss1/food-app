import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createRazorpayOrder,
  verifyPayment,
  getPaymentStatus,
  refundPayment,
  webhookHandler,
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);
router.get('/:orderId/status', protect, getPaymentStatus);
router.post('/:orderId/refund', protect, refundPayment);
router.post('/webhook', webhookHandler);

export default router;
