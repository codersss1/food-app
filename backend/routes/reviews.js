import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createReview,
  getRestaurantReviews,
  getUserReviews,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/user/my-reviews', protect, getUserReviews);
router.get('/restaurant/:restaurantId', getRestaurantReviews);
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);

export default router;
