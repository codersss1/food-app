import MenuItem from '../models/MenuItem.js';
import MenuCategory from '../models/MenuCategory.js';
import { AppError } from '../middleware/errorHandler.js';

export const getMenuItemsByCategory = async (req, res, next) => {
  const { restaurantId, categoryId } = req.params;

  const category = await MenuCategory.findById(categoryId);
  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  const items = await MenuItem.find({
    restaurantId,
    categoryId,
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    category: {
      id: category._id,
      name: category.name,
      description: category.description,
    },
    items: items.map((item) => ({
      id: item._id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isAvailable: item.isAvailable,
    })),
  });
};

export const searchMenuItems = async (req, res, next) => {
  const { restaurantId, query, limit = 20 } = req.query;

  if (!query || query.length < 2) {
    return next(new AppError('Search query must be at least 2 characters', 400));
  }

  const items = await MenuItem.find(
    {
      restaurantId,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
      isAvailable: true,
    },
    { name: 1, price: 1, image: 1, isVegetarian: 1 }
  )
    .limit(parseInt(limit));

  res.json({
    success: true,
    items: items.map((item) => ({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      isVegetarian: item.isVegetarian,
    })),
  });
};

export const getMenuCategories = async (req, res, next) => {
  const { restaurantId } = req.params;

  const categories = await MenuCategory.find({ restaurantId }).sort({ displayOrder: 1 });

  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const itemCount = await MenuItem.countDocuments({ categoryId: category._id });
      return {
        id: category._id,
        name: category.name,
        description: category.description,
        itemCount,
      };
    })
  );

  res.json({
    success: true,
    categories: categoriesWithCount,
  });
};

export const getVegetarianItems = async (req, res, next) => {
  const { restaurantId, limit = 20, skip = 0 } = req.query;

  const items = await MenuItem.find({
    restaurantId,
    isVegetarian: true,
    isAvailable: true,
  })
    .limit(parseInt(limit))
    .skip(parseInt(skip));

  const total = await MenuItem.countDocuments({
    restaurantId,
    isVegetarian: true,
  });

  res.json({
    success: true,
    items: items.map((item) => ({
      id: item._id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      isVegan: item.isVegan,
    })),
    pagination: {
      total,
      limit: parseInt(limit),
      skip: parseInt(skip),
    },
  });
};

export const getVeganItems = async (req, res, next) => {
  const { restaurantId, limit = 20, skip = 0 } = req.query;

  const items = await MenuItem.find({
    restaurantId,
    isVegan: true,
    isAvailable: true,
  })
    .limit(parseInt(limit))
    .skip(parseInt(skip));

  const total = await MenuItem.countDocuments({
    restaurantId,
    isVegan: true,
  });

  res.json({
    success: true,
    items: items.map((item) => ({
      id: item._id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
    })),
    pagination: {
      total,
      limit: parseInt(limit),
      skip: parseInt(skip),
    },
  });
};
