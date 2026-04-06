import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import User from '../models/User.js';
import PromoCode from '../models/PromoCode.js';
import { AppError } from '../middleware/errorHandler.js';
import { config } from '../config/env.js';
import { sendOrderConfirmation, sendOrderDelivered } from '../utils/emailService.js';

const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

export const createRazorpayOrder = async (req, res, next) => {
  const { orderId } = req.body;
  const userId = req.userId;

  if (!orderId) {
    return next(new AppError('Order ID is required', 400));
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.userId.toString() !== userId) {
    return next(new AppError('Unauthorized', 403));
  }

  if (order.paymentStatus !== 'pending') {
    return next(new AppError('Order has already been paid', 400));
  }

  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.finalAmount * 100), // Amount in paise
      currency: 'INR',
      receipt: `order_${order._id}`,
      notes: {
        orderId: order._id.toString(),
        userId: order.userId.toString(),
      },
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      success: true,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      keyId: config.razorpay.keyId,
    });
  } catch (error) {
    return next(new AppError('Failed to create payment order', 500));
  }
};

export const verifyPayment = async (req, res, next) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;
  const userId = req.userId;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
    return next(new AppError('All payment details are required', 400));
  }

  try {
    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return next(new AppError('Payment verification failed', 400));
    }

    // Update order
    const order = await Order.findById(orderId)
      .populate('restaurantId', 'name')
      .populate('items.menuItemId', 'name');

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    if (order.userId.toString() !== userId) {
      return next(new AppError('Unauthorized', 403));
    }

    order.razorpayPaymentId = razorpayPaymentId;
    order.paymentStatus = 'completed';
    order.status = 'confirmed';
    await order.save();

    // Update promo code usage
    if (order.promoCodeId) {
      await PromoCode.findByIdAndUpdate(
        order.promoCodeId,
        { $inc: { usageCount: 1 } }
      );
    }

    // Get user for email
    const user = await User.findById(userId);

    // Send confirmation email
    await sendOrderConfirmation(user.email, {
      orderId: order._id,
      restaurantName: order.restaurantId.name,
      items: order.items.map((item) => ({
        name: item.menuItemId.name,
        quantity: item.quantity,
        itemTotal: item.itemTotal,
      })),
      totalAmount: order.finalAmount,
      estimatedTime: order.restaurantId.deliveryTime || 30,
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      order: {
        id: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return next(new AppError('Payment verification failed', 500));
  }
};

export const getPaymentStatus = async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.userId;

  const order = await Order.findById(orderId);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.userId.toString() !== userId) {
    return next(new AppError('Unauthorized', 403));
  }

  res.json({
    success: true,
    payment: {
      orderId: order._id,
      amount: order.finalAmount,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      razorpayPaymentId: order.razorpayPaymentId || null,
      createdAt: order.createdAt,
    },
  });
};

export const refundPayment = async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.userId;

  const order = await Order.findById(orderId);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.userId.toString() !== userId) {
    return next(new AppError('Unauthorized', 403));
  }

  if (order.status !== 'pending' && order.status !== 'cancelled') {
    return next(new AppError('Cannot refund this order', 400));
  }

  if (!order.razorpayPaymentId) {
    return next(new AppError('No payment found for this order', 404));
  }

  try {
    const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
      amount: Math.round(order.finalAmount * 100),
    });

    order.paymentStatus = 'refunded';
    await order.save();

    res.json({
      success: true,
      message: 'Refund initiated successfully',
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
      },
    });
  } catch (error) {
    return next(new AppError('Refund failed', 500));
  }
};

export const webhookHandler = async (req, res, next) => {
  const { type, payload } = req.body;

  if (type === 'payment.authorized') {
    const paymentId = payload.payment.entity.id;
    // Handle payment authorized
    console.log('Payment authorized:', paymentId);
  } else if (type === 'payment.failed') {
    const paymentId = payload.payment.entity.id;
    const orderId = payload.payment.entity.notes?.orderId;

    if (orderId) {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'failed';
        await order.save();
      }
    }
    console.log('Payment failed:', paymentId);
  } else if (type === 'refund.created') {
    const refundId = payload.refund.entity.id;
    console.log('Refund created:', refundId);
  }

  res.json({ received: true });
};
