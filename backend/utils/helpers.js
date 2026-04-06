import crypto from 'crypto';

export const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

export const calculateTax = (subtotal, taxRate = 0.05) => {
  return Math.round(subtotal * taxRate * 100) / 100;
};

export const calculateDiscount = (subtotal, promoCode) => {
  if (!promoCode) return 0;

  let discount = 0;
  if (promoCode.discountType === 'percentage') {
    discount = Math.round((subtotal * promoCode.discountValue) / 100);
    if (promoCode.maxDiscountAmount) {
      discount = Math.min(discount, promoCode.maxDiscountAmount);
    }
  } else if (promoCode.discountType === 'fixed') {
    discount = promoCode.discountValue;
  }

  return Math.min(discount, subtotal);
};

export const calculateOrderTotal = (items, deliveryFee, promoCode) => {
  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const tax = calculateTax(subtotal);
  const discount = calculateDiscount(subtotal, promoCode);
  const finalAmount = subtotal + tax + deliveryFee - discount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    deliveryFee: Math.round(deliveryFee * 100) / 100,
    total: Math.round(finalAmount * 100) / 100,
  };
};

export const formatOrderResponse = (order) => {
  return {
    id: order._id,
    userId: order.userId,
    restaurantId: order.restaurantId,
    items: order.items,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    tax: order.taxAmount,
    discount: order.discountAmount,
    total: order.totalAmount,
    finalAmount: order.finalAmount,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    deliveryAddress: order.deliveryAddress,
    specialInstructions: order.specialInstructions,
    estimatedDeliveryTime: order.estimatedDeliveryTime,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};
