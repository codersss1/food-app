import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Restaurant from '../models/Restaurant.js';
import { AppError } from '../middleware/errorHandler.js';

export const createReview = async (req, res, next) => {
  const userId = req.userId;
  const { orderId, restaurantId, rating, comment } = req.body;

  // Validation
  if (!orderId || !restaurantId || !rating || !comment) {
    return next(new AppError('All fields are required', 400));
  }

  if (rating < 1 || rating > 5) {
    return next(new AppError('Rating must be between 1 and 5', 400));
  }

  if (comment.length < 10 || comment.length > 500) {
    return next(new AppError('Comment must be between 10 and 500 characters', 400));
  }

  // Verify order exists and belongs to user
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.userId.toString() !== userId) {
    return next(new AppError('Unauthorized', 403));
  }

  if (order.status !== 'delivered') {
    return next(new AppError('Can only review delivered orders', 400));
  }

  // Check if review already exists
  const existingReview = await Review.findOne({ orderId });
  if (existingReview) {
    return next(new AppError('Review already submitted for this order', 400));
  }

  // Create review
  const review = new Review({
    userId,
    restaurantId,
    orderId,
    rating,
    comment,
    isModerated: true,
  });

  await review.save();

  // Update restaurant rating
  const allReviews = await Review.find({ restaurantId });
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  await Restaurant.findByIdAndUpdate(restaurantId, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: allReviews.length,
  });

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    review: {
      id: review._id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    },
  });
};

export const getRestaurantReviews = async (req, res, next) => {
  const { restaurantId } = req.params;
  const { limit = 10, skip = 0 } = req.query;

  const reviews = await Review.find({ restaurantId })
    .populate('userId', 'fullName avatar')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip));

  const total = await Review.countDocuments({ restaurantId });

  res.json({
    success: true,
    reviews: reviews.map((r) => ({
      id: r._id,
      userName: r.userId?.fullName,
      userAvatar: r.userId?.avatar,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    })),
    pagination: {
      total,
      limit: parseInt(limit),
      skip: parseInt(skip),
    },
  });
};

export const getUserReviews = async (req, res, next) => {
  const userId = req.userId;
  const { limit = 20, skip = 0 } = req.query;

  const reviews = await Review.find({ userId })
    .populate('restaurantId', 'name image')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip));

  const total = await Review.countDocuments({ userId });

  res.json({
    success: true,
    reviews: reviews.map((r) => ({
      id: r._id,
      restaurantId: r.restaurantId._id,
      restaurantName: r.restaurantId.name,
      restaurantImage: r.restaurantImage.image,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    })),
    pagination: {
      total,
      limit: parseInt(limit),
      skip: parseInt(skip),
    },
  });
};

export const updateReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const userId = req.userId;
  const { rating, comment } = req.body;

  // Validation
  if (rating && (rating < 1 || rating > 5)) {
    return next(new AppError('Rating must be between 1 and 5', 400));
  }

  if (comment && (comment.length < 10 || comment.length > 500)) {
    return next(new AppError('Comment must be between 10 and 500 characters', 400));
  }

  const review = await Review.findById(reviewId);
  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  if (review.userId.toString() !== userId) {
    return next(new AppError('Unauthorized', 403));
  }

  if (rating) review.rating = rating;
  if (comment) review.comment = comment;

  await review.save();

  // Recalculate restaurant rating
  const allReviews = await Review.find({ restaurantId: review.restaurantId });
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  await Restaurant.findByIdAndUpdate(review.restaurantId, {
    rating: Math.round(avgRating * 10) / 10,
  });

  res.json({
    success: true,
    message: 'Review updated successfully',
    review: {
      id: review._id,
      rating: review.rating,
      comment: review.comment,
    },
  });
};

export const deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const userId = req.userId;

  const review = await Review.findById(reviewId);
  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  if (review.userId.toString() !== userId) {
    return next(new AppError('Unauthorized', 403));
  }

  await Review.findByIdAndDelete(reviewId);

  // Recalculate restaurant rating
  const allReviews = await Review.find({ restaurantId: review.restaurantId });
  const avgRating = allReviews.length > 0 
    ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length 
    : 0;

  await Restaurant.findByIdAndUpdate(review.restaurantId, {
    rating: allReviews.length > 0 ? Math.round(avgRating * 10) / 10 : 0,
    reviewCount: allReviews.length,
  });

  res.json({
    success: true,
    message: 'Review deleted successfully',
  });
};
