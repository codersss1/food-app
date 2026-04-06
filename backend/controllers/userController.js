import User from '../models/User.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import { AppError } from '../middleware/errorHandler.js';
import { validatePhone, validateEmail } from '../utils/validators.js';

export const getProfile = async (req, res, next) => {
  const userId = req.userId;

  const user = await User.findById(userId).populate('hostelId');
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      studentId: user.studentId,
      isVerified: user.isVerified,
      isLpuStudent: user.isLpuStudent,
      hostel: user.hostelId,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  });
};

export const updateProfile = async (req, res, next) => {
  const userId = req.userId;
  const { fullName, phone, hostelId } = req.body;

  if (phone && !validatePhone(phone)) {
    return next(new AppError('Invalid phone number', 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (fullName) user.fullName = fullName;
  if (phone) user.phone = phone;
  if (hostelId) user.hostelId = hostelId;

  // Handle file upload if image provided
  if (req.file) {
    user.avatar = `/uploads/${req.file.filename}`;
  }

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      avatar: user.avatar,
    },
  });
};

export const deleteAccount = async (req, res, next) => {
  const userId = req.userId;
  const { password } = req.body;

  if (!password) {
    return next(new AppError('Password is required to delete account', 400));
  }

  const user = await User.findById(userId).select('+passwordHash');
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    return next(new AppError('Invalid password', 401));
  }

  await User.findByIdAndDelete(userId);

  res.json({
    success: true,
    message: 'Account deleted successfully',
  });
};

export const getOrderHistory = async (req, res, next) => {
  const userId = req.userId;
  const { status, limit = 10, skip = 0 } = req.query;

  let query = { userId };
  if (status) {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate('restaurantId', 'name image deliveryTime')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip));

  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    orders: orders.map((order) => ({
      id: order._id,
      restaurantName: order.restaurantId?.name,
      restaurantImage: order.restaurantId?.image,
      totalAmount: order.finalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      estimatedDeliveryTime: order.estimatedDeliveryTime,
    })),
    pagination: {
      total,
      limit: parseInt(limit),
      skip: parseInt(skip),
    },
  });
};

export const getOrderDetails = async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.userId;

  const order = await Order.findById(orderId)
    .populate('userId', 'fullName phone email')
    .populate('restaurantId', 'name image phone address')
    .populate('items.menuItemId', 'name price image');

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.userId._id.toString() !== userId) {
    return next(new AppError('Unauthorized', 403));
  }

  res.json({
    success: true,
    order: {
      id: order._id,
      restaurant: {
        id: order.restaurantId._id,
        name: order.restaurantId.name,
        image: order.restaurantId.image,
        phone: order.restaurantId.phone,
        address: order.restaurantId.address,
      },
      items: order.items.map((item) => ({
        id: item.menuItemId._id,
        name: item.menuItemId.name,
        price: item.price,
        image: item.menuItemId.image,
        quantity: item.quantity,
        total: item.itemTotal,
      })),
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      tax: order.taxAmount,
      discount: order.discountAmount,
      totalAmount: order.totalAmount,
      finalAmount: order.finalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      deliveryAddress: order.deliveryAddress,
      specialInstructions: order.specialInstructions,
      estimatedDeliveryTime: order.estimatedDeliveryTime,
      deliveredAt: order.deliveredAt,
      createdAt: order.createdAt,
    },
  });
};

export const canReview = async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.userId;

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.userId.toString() !== userId) {
    return next(new AppError('Unauthorized', 403));
  }

  const review = await Review.findOne({ orderId });
  const canReview = order.status === 'delivered' && !review;

  res.json({
    success: true,
    canReview,
    message: canReview ? 'You can review this order' : 'You cannot review this order',
  });
};
