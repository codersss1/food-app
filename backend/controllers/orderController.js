import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';
import PromoCode from '../models/PromoCode.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { calculateOrderTotal, generateToken } from '../utils/helpers.js';
import { sendOrderConfirmation } from '../utils/emailService.js';

export const createOrder = async (req, res, next) => {
  const userId = req.userId;
  const { restaurantId, items, hostelId, specialInstructions, promoCode } = req.body;

  // Validation
  if (!restaurantId || !items || items.length === 0) {
    return next(new AppError('Invalid order data', 400));
  }

  // Verify user
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 401));
  }

  // Verify restaurant exists
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return next(new AppError('Restaurant not found', 404));
  }

  if (!restaurant.isOpen) {
    return next(new AppError('Restaurant is currently closed', 400));
  }

  // Verify menu items and calculate subtotal
  let subtotal = 0;
  const orderItems = await Promise.all(
    items.map(async (item) => {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        throw new AppError(`Menu item ${item.menuItemId} not found`, 404);
      }

      if (!menuItem.isAvailable) {
        throw new AppError(`${menuItem.name} is not available`, 400);
      }

      const itemTotal = menuItem.price * item.quantity;
      subtotal += itemTotal;

      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
        itemTotal,
      };
    })
  );

  // Check minimum order amount
  if (subtotal < restaurant.minimumOrder) {
    return next(new AppError(`Minimum order amount is ₹${restaurant.minimumOrder}`, 400));
  }

  // Apply promo code if provided
  let promo = null;
  if (promoCode) {
    promo = await PromoCode.findOne({
      code: promoCode.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validTill: { $gte: new Date() },
    });

    if (!promo) {
      return next(new AppError('Invalid or expired promo code', 400));
    }

    if (user.isLpuStudent && promo.isForLpuStudents === false) {
      return next(new AppError('This promo code is not applicable to you', 400));
    }

    if (subtotal < promo.minimumOrderAmount) {
      return next(new AppError(`Promo code requires minimum order of ₹${promo.minimumOrderAmount}`, 400));
    }
  }

  // Calculate totals
  const deliveryFee = restaurant.deliveryFee || 0;
  const orderTotals = calculateOrderTotal(orderItems, deliveryFee, promo);

  // Create order
  const order = new Order({
    userId,
    restaurantId,
    hostelId: hostelId || user.hostelId,
    items: orderItems,
    subtotal: orderTotals.subtotal,
    deliveryFee: orderTotals.deliveryFee,
    taxAmount: orderTotals.tax,
    discountAmount: orderTotals.discount,
    promoCodeId: promo?._id,
    totalAmount: orderTotals.total,
    finalAmount: orderTotals.total,
    deliveryAddress: user.hostelId ? `Hostel ${hostelId}` : 'Default Address',
    specialInstructions: specialInstructions || '',
    paymentMethod: 'razorpay',
    status: 'pending',
    paymentStatus: 'pending',
    estimatedDeliveryTime: new Date(Date.now() + restaurant.deliveryTime * 60000),
  });

  await order.save();

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    order: {
      id: order._id,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      tax: order.taxAmount,
      discount: order.discountAmount,
      total: order.finalAmount,
      status: order.status,
      estimatedDeliveryTime: order.estimatedDeliveryTime,
    },
  });
};

export const getOrder = async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.userId;

  const order = await Order.findById(orderId)
    .populate('restaurantId', 'name phone address image')
    .populate('items.menuItemId', 'name price image');

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.userId.toString() !== userId) {
    return next(new AppError('Unauthorized', 403));
  }

  res.json({
    success: true,
    order: {
      id: order._id,
      restaurant: {
        id: order.restaurantId._id,
        name: order.restaurantId.name,
        phone: order.restaurantId.phone,
        address: order.restaurantId.address,
        image: order.restaurantId.image,
      },
      items: order.items.map((item) => ({
        name: item.menuItemId.name,
        price: item.price,
        quantity: item.quantity,
        image: item.menuItemId.image,
        total: item.itemTotal,
      })),
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      tax: order.taxAmount,
      discount: order.discountAmount,
      total: order.finalAmount,
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

export const updateOrderStatus = async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const userId = req.userId;

  const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.userId.toString() !== userId) {
    return next(new AppError('Unauthorized', 403));
  }

  // Only allow cancellation if order is still pending
  if (status === 'cancelled' && order.status !== 'pending') {
    return next(new AppError('Cannot cancel order at this stage', 400));
  }

  order.status = status;

  if (status === 'delivered') {
    order.deliveredAt = new Date();
  }

  await order.save();

  res.json({
    success: true,
    message: 'Order status updated',
    order: {
      id: order._id,
      status: order.status,
      deliveredAt: order.deliveredAt,
    },
  });
};

export const cancelOrder = async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.userId;

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.userId.toString() !== userId) {
    return next(new AppError('Unauthorized', 403));
  }

  if (order.status !== 'pending') {
    return next(new AppError('Can only cancel pending orders', 400));
  }

  order.status = 'cancelled';
  order.paymentStatus = 'refunded';
  await order.save();

  res.json({
    success: true,
    message: 'Order cancelled successfully',
    order: {
      id: order._id,
      status: order.status,
    },
  });
};

export const trackOrder = async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.userId;

  const order = await Order.findById(orderId).populate('restaurantId', 'name address deliveryTime');

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.userId.toString() !== userId) {
    return next(new AppError('Unauthorized', 403));
  }

  const statusSteps = ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered'];
  const currentStep = statusSteps.indexOf(order.status);

  res.json({
    success: true,
    tracking: {
      orderId: order._id,
      restaurantName: order.restaurantId.name,
      restaurantAddress: order.restaurantId.address,
      status: order.status,
      estimatedDeliveryTime: order.estimatedDeliveryTime,
      currentStep,
      totalSteps: statusSteps.length,
      steps: statusSteps.map((step, index) => ({
        name: step.charAt(0).toUpperCase() + step.slice(1).replace('-', ' '),
        completed: index <= currentStep,
        current: step === order.status,
      })),
      deliveryAddress: order.deliveryAddress,
    },
  });
};

export const validatePromoCode = async (req, res, next) => {
  const { code, subtotal } = req.body;
  const userId = req.userId;

  if (!code) {
    return next(new AppError('Promo code is required', 400));
  }

  const promo = await PromoCode.findOne({
    code: code.toUpperCase(),
    isActive: true,
    validFrom: { $lte: new Date() },
    validTill: { $gte: new Date() },
  });

  if (!promo) {
    return next(new AppError('Invalid or expired promo code', 400));
  }

  const user = await User.findById(userId);
  if (user.isLpuStudent && !promo.isForLpuStudents) {
    return next(new AppError('This promo code is not applicable to you', 400));
  }

  if (subtotal < promo.minimumOrderAmount) {
    return next(
      new AppError(`Promo code requires minimum order of ₹${promo.minimumOrderAmount}`, 400)
    );
  }

  // Check usage limits
  if (promo.maxUsage) {
    if (promo.usageCount >= promo.maxUsage) {
      return next(new AppError('Promo code has reached maximum usage limit', 400));
    }
  }

  let discount = 0;
  if (promo.discountType === 'percentage') {
    discount = Math.round((subtotal * promo.discountValue) / 100);
    if (promo.maxDiscountAmount) {
      discount = Math.min(discount, promo.maxDiscountAmount);
    }
  } else if (promo.discountType === 'fixed') {
    discount = promo.discountValue;
  }

  res.json({
    success: true,
    promoCode: {
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      discount,
      message: `${promo.code} applied successfully!`,
    },
  });
};
