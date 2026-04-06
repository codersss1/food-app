import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createOrder,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  trackOrder,
  validatePromoCode,
} from '../controllers/orderController.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.post('/', createOrder);
router.post('/validate-promo', validatePromoCode);
router.get('/:orderId', getOrder);
router.put('/:orderId', updateOrderStatus);
router.delete('/:orderId/cancel', cancelOrder);
router.get('/:orderId/track', trackOrder);

export default router;
