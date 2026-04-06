import express from 'express';
import {
  getAllRestaurants,
  getRestaurantById,
  searchRestaurants,
  getRestaurantMenu,
  getMenuItemDetails,
  getTopRatedRestaurants,
  getFastestDelivery,
} from '../controllers/restaurantController.js';

const router = express.Router();

router.get('/', getAllRestaurants);
router.get('/search', searchRestaurants);
router.get('/featured/top-rated', getTopRatedRestaurants);
router.get('/featured/fastest-delivery', getFastestDelivery);
router.get('/:id', getRestaurantById);
router.get('/:restaurantId/menu', getRestaurantMenu);

export default router;
