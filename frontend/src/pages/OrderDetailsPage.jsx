import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userAPI, orderAPI, reviewAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReview, setShowReview] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getOrderDetails(id);
        setOrder(response.data.order);

        // Check if user can review
        if (response.data.order.status === 'delivered') {
          const reviewCheck = await userAPI.canReview(id);
          setShowReview(reviewCheck.data.canReview);
        }
      } catch (err) {
        setError('Failed to load order details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);

    try {
      await reviewAPI.create({
        orderId: id,
        restaurantId: order.restaurant.id,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      setShowReview(false);
      alert('Thank you for your review!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-error mb-4">{error || 'Order not found'}</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/orders')}
          className="text-primary mb-6 hover:underline font-medium"
        >
          ← Back to Orders
        </button>

        <h1 className="text-3xl font-bold text-text mb-8">Order #{order.id}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Restaurant Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-text mb-4">Restaurant</h2>
              <div className="flex gap-4">
                <img
                  src={order.restaurant.image}
                  alt={order.restaurant.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div>
                  <h3 className="text-lg font-bold text-text">{order.restaurant.name}</h3>
                  <p className="text-textMuted text-sm mb-2">{order.restaurant.address}</p>
                  <p className="text-textMuted text-sm">📞 {order.restaurant.phone}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-text mb-4">Order Items</h2>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between pb-3 border-b border-border last:border-b-0">
                    <div>
                      <p className="font-medium text-text">{item.name}</p>
                      <p className="text-sm text-textMuted">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-text">₹{item.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-text mb-4">Order Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-textMuted">Status</span>
                  <span className="font-bold text-primary">{order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textMuted">Payment Status</span>
                  <span className="font-bold text-primary">{order.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textMuted">Ordered On</span>
                  <span className="font-bold text-text">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                {order.estimatedDeliveryTime && (
                  <div className="flex justify-between">
                    <span className="text-textMuted">Estimated Delivery</span>
                    <span className="font-bold text-text">
                      {new Date(order.estimatedDeliveryTime).toLocaleTimeString()}
                    </span>
                  </div>
                )}
                {order.deliveredAt && (
                  <div className="flex justify-between">
                    <span className="text-textMuted">Delivered On</span>
                    <span className="font-bold text-success">{new Date(order.deliveredAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Review Section */}
            {showReview && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-text mb-4">Rate Your Experience</h2>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Rating</label>
                    <select
                      value={reviewData.rating}
                      onChange={(e) =>
                        setReviewData((prev) => ({ ...prev, rating: parseInt(e.target.value) }))
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                      <option value="4">⭐⭐⭐⭐ Good</option>
                      <option value="3">⭐⭐⭐ Average</option>
                      <option value="2">⭐⭐ Poor</option>
                      <option value="1">⭐ Bad</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Comment</label>
                    <textarea
                      value={reviewData.comment}
                      onChange={(e) =>
                        setReviewData((prev) => ({ ...prev, comment: e.target.value }))
                      }
                      required
                      minLength="10"
                      maxLength="500"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Share your experience..."
                      rows="4"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-text mb-4">Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-textMuted">Subtotal</span>
                  <span className="text-text">₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textMuted">Delivery Fee</span>
                  <span className="text-text">₹{order.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textMuted">Tax</span>
                  <span className="text-text">₹{order.tax.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span>-₹{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-border flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{order.finalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
