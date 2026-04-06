import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';
import MenuCategory from '../models/MenuCategory.js';
import Review from '../models/Review.js';
import { AppError } from '../middleware/errorHandler.js';

export const getAllRestaurants = async (req, res, next) => {
  const { cuisine, minRating, maxDeliveryTime, searchQuery, limit = 20, skip = 0 } = req.query;

  let query = { isOpen: true, isAvailableForLpu: true };

  if (cuisine) {
    query.cuisineType = { $in: cuisine.split(',') };
  }

  if (minRating) {
    query.rating = { $gte: parseFloat(minRating) };
  }

  if (maxDeliveryTime) {
    query.deliveryTime = { $lte: parseInt(maxDeliveryTime) };
  }

  if (searchQuery) {
    query.$or = [
      { name: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } },
      { cuisineType: { $in: [new RegExp(searchQuery, 'i')] } },
    ];
  }

  const restaurants = await Restaurant.find(query)
    .sort({ rating: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip));

  const total = await Restaurant.countDocuments(query);

  res.json({
    success: true,
    restaurants: restaurants.map((r) => ({
      id: r._id,
      name: r.name,
      description: r.description,
      cuisineType: r.cuisineType,
      rating: r.rating,
      reviewCount: r.reviewCount,
      deliveryTime: r.deliveryTime,
      deliveryFee: r.deliveryFee,
      minimumOrder: r.minimumOrder,
      image: r.image,
      isOpen: r.isOpen,
    })),
    pagination: {
      total,
      limit: parseInt(limit),
      skip: parseInt(skip),
    },
  });
};

export const getRestaurantById = async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    return next(new AppError('Restaurant not found', 404));
  }

  // Get categories and their items
  const categories = await MenuCategory.find({ restaurantId: id }).sort({ displayOrder: 1 });

  const categoriesWithItems = await Promise.all(
    categories.map(async (category) => {
      const items = await MenuItem.find({
        restaurantId: id,
        categoryId: category._id,
        isAvailable: true,
      });

      return {
        id: category._id,
        name: category.name,
        description: category.description,
        items: items.map((item) => ({
          id: item._id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          isVegetarian: item.isVegetarian,
          isVegan: item.isVegan,
        })),
      };
    })
  );

  // Get reviews
  const reviews = await Review.find({ restaurantId: id })
    .populate('userId', 'fullName avatar')
    .sort({ createdAt: -1 })
    .limit(10);

  res.json({
    success: true,
    restaurant: {
      id: restaurant._id,
      name: restaurant.name,
      description: restaurant.description,
      cuisineType: restaurant.cuisineType,
      rating: restaurant.rating,
      reviewCount: restaurant.reviewCount,
      deliveryTime: restaurant.deliveryTime,
      deliveryFee: restaurant.deliveryFee,
      minimumOrder: restaurant.minimumOrder,
      image: restaurant.image,
      isOpen: restaurant.isOpen,
      openingTime: restaurant.openingTime,
      closingTime: restaurant.closingTime,
    },
    categories: categoriesWithItems,
    reviews: reviews.map((r) => ({
      id: r._id,
      userName: r.userId?.fullName,
      userAvatar: r.userId?.avatar,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    })),
  });
};

export const searchRestaurants = async (req, res, next) => {
  const { query, limit = 10 } = req.query;

  if (!query || query.length < 2) {
    return next(new AppError('Search query must be at least 2 characters', 400));
  }

  const restaurants = await Restaurant.find(
    {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { cuisineType: { $in: [new RegExp(query, 'i')] } },
      ],
      isOpen: true,
      isAvailableForLpu: true,
    },
    { name: 1, image: 1, cuisineType: 1, rating: 1 }
  )
    .limit(parseInt(limit));

  res.json({
    success: true,
    results: restaurants.map((r) => ({
      id: r._id,
      name: r.name,
      image: r.image,
      cuisineType: r.cuisineType,
      rating: r.rating,
    })),
  });
};

export const getRestaurantMenu = async (req, res, next) => {
  const { restaurantId } = req.params;

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return next(new AppError('Restaurant not found', 404));
  }

  const categories = await MenuCategory.find({ restaurantId }).sort({ displayOrder: 1 });

  const menu = await Promise.all(
    categories.map(async (category) => {
      const items = await MenuItem.find({
        restaurantId,
        categoryId: category._id,
      });

      return {
        id: category._id,
        name: category.name,
        description: category.description,
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
      };
    })
  );

  res.json({
    success: true,
    restaurant: {
      id: restaurant._id,
      name: restaurant.name,
      minimumOrder: restaurant.minimumOrder,
      deliveryFee: restaurant.deliveryFee,
      deliveryTime: restaurant.deliveryTime,
    },
    categories: menu,
  });
};

export const getMenuItemDetails = async (req, res, next) => {
  const { itemId } = req.params;

  const item = await MenuItem.findById(itemId).populate('restaurantId', 'name deliveryFee minimumOrder');

  if (!item) {
    return next(new AppError('Menu item not found', 404));
  }

  res.json({
    success: true,
    item: {
      id: item._id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isAvailable: item.isAvailable,
      restaurant: {
        id: item.restaurantId._id,
        name: item.restaurantId.name,
      },
    },
  });
};

export const getTopRatedRestaurants = async (req, res, next) => {
  const { limit = 10 } = req.query;

  const restaurants = await Restaurant.find({ isOpen: true, isAvailableForLpu: true })
    .sort({ rating: -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    restaurants: restaurants.map((r) => ({
      id: r._id,
      name: r.name,
      description: r.description,
      rating: r.rating,
      reviewCount: r.reviewCount,
      image: r.image,
      deliveryFee: r.deliveryFee,
      deliveryTime: r.deliveryTime,
    })),
  });
};

export const getFastestDelivery = async (req, res, next) => {
  const { limit = 10 } = req.query;

  const restaurants = await Restaurant.find({ isOpen: true, isAvailableForLpu: true })
    .sort({ deliveryTime: 1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    restaurants: restaurants.map((r) => ({
      id: r._id,
      name: r.name,
      description: r.description,
      deliveryTime: r.deliveryTime,
      image: r.image,
      rating: r.rating,
      deliveryFee: r.deliveryFee,
    })),
  });
};
