import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { orderAPI, paymentAPI } from '../services/api';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getTotal, clearCart, restaurantId } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const subtotal = getTotal();
  const deliveryFee = 40;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + deliveryFee + tax - discount;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-textMuted mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    
    try {
      setError('');
      const response = await orderAPI.validatePromo({
        code: promoCode,
        subtotal,
      });
      setDiscount(response.data.promoCode.discount);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid promo code');
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      // Create order
      const orderResponse = await orderAPI.create({
        restaurantId,
        items: cart.map((item) => ({
          menuItemId: item._id,
          quantity: item.quantity,
        })),
        specialInstructions,
        promoCode: promoCode || null,
      });

      const orderId = orderResponse.data.order.id;

      // Create Razorpay order
      setPaymentProcessing(true);
      const paymentResponse = await paymentAPI.createRazorpayOrder({
        orderId,
      });

      const { razorpayOrder, keyId } = paymentResponse.data;

      // Initialize Razorpay
      const options = {
        key: keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            // Verify payment
            await paymentAPI.verify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId,
            });

            clearCart();
            navigate(`/orders/${orderId}?success=true`);
          } catch (err) {
            setError('Payment verification failed');
            console.error(err);
          } finally {
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: user.fullName,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: '#FF6B35',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-text mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-text mb-4">Delivery Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Name</label>
                  <input
                    type="text"
                    value={user.fullName}
                    disabled
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Phone</label>
                  <input
                    type="tel"
                    value={user.phone}
                    disabled
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Special Instructions</label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special requests? (optional)"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-text mb-4">Apply Promo Code</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  onClick={handleApplyPromo}
                  className="bg-accent text-text px-6 py-2 rounded-lg font-medium hover:bg-opacity-90"
                >
                  Apply
                </button>
              </div>
              {discount > 0 && (
                <p className="text-success mt-2 text-sm font-medium">
                  ✓ Discount of ₹{discount.toFixed(2)} applied!
                </p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-text mb-4">Order Summary</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-error rounded-lg text-error text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2 mb-4 pb-4 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-textMuted">Subtotal</span>
                  <span className="text-text">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-textMuted">Delivery Fee</span>
                  <span className="text-text">₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-textMuted">Tax (5%)</span>
                  <span className="text-text">₹{tax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || paymentProcessing}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-opacity-90 disabled:opacity-50"
              >
                {loading || paymentProcessing ? 'Processing...' : 'Pay with Razorpay'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </div>
  );
}
