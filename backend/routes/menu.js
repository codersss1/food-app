import express from 'express';
import {
  getMenuItemsByCategory,
  searchMenuItems,
  getMenuCategories,
  getVegetarianItems,
  getVeganItems,
} from '../controllers/menuController.js';

const router = express.Router();

router.get('/categories/:restaurantId', getMenuCategories);
router.get('/category/:restaurantId/:categoryId', getMenuItemsByCategory);
router.get('/search', searchMenuItems);
router.get('/vegetarian', getVegetarianItems);
router.get('/vegan', getVeganItems);

export default router;
