'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Phone, MapPin, Clock, CheckCircle2 } from 'lucide-react'

// Sample restaurants data for lookup
const restaurantsData: Record<string, any> = {
  '1': { id: '1', name: 'Pizza Paradise', address: 'Block 34, LPU Campus', phone: '+91 98765 43210', image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' },
  '2': { id: '2', name: 'Burger Barn', address: 'Block 32, LPU Campus', phone: '+91 98765 43211', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
  '3': { id: '3', name: 'Dragon Wok', address: 'Block 28, LPU Campus', phone: '+91 98765 43212', image_url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop' },
  '4': { id: '4', name: 'Spice Garden', address: 'Block 36, LPU Campus', phone: '+91 98765 43213', image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },
  '5': { id: '5', name: 'Dosa Corner', address: 'Block 30, LPU Campus', phone: '+91 98765 43214', image_url: 'https://images.unsplash.com/photo-1668236543090-82eb5eaf701b?w=400&h=300&fit=crop' },
  '6': { id: '6', name: 'Cafe Mocha', address: 'Block 25, LPU Campus', phone: '+91 98765 43215', image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop' },
}

interface OrderDetails {
  id: string
  restaurant_id: string
  total_amount: number
  order_status: string
  payment_status: string
  delivery_address: string
  items: any[]
  created_at: string
  restaurants?: any
}

const trackingSteps = [
  { id: 'pending_payment', label: 'Payment', description: 'Processing payment' },
  { id: 'confirmed', label: 'Confirmed', description: 'Order confirmed' },
  { id: 'preparing', label: 'Preparing', description: 'Food being prepared' },
  { id: 'ready', label: 'Ready', description: 'Ready for delivery' },
  { id: 'on_the_way', label: 'On the Way', description: 'Delivery partner on the way' },
  { id: 'delivered', label: 'Delivered', description: 'Order delivered' },
]

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = () => {
      try {
        // Check if user is logged in
        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
          router.push('/auth/login')
          return
        }

        // Get orders from localStorage
        const storedOrders = JSON.parse(localStorage.getItem('foodhub_orders') || '[]')
        const foundOrder = storedOrders.find((o: OrderDetails) => o.id === orderId)

        if (foundOrder) {
          // Add restaurant data
          foundOrder.restaurants = restaurantsData[foundOrder.restaurant_id] || { 
            name: 'Restaurant', 
            address: 'LPU Campus',
            phone: '+91 98765 43210'
          }
          setOrder(foundOrder)
        }
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, router])

  const getCurrentStepIndex = () => {
    const statusOrder = [
      'pending_payment',
      'confirmed',
      'preparing',
      'ready',
      'on_the_way',
      'delivered',
    ]
    return statusOrder.indexOf(order?.order_status || 'pending_payment')
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-4 md:p-8">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Order not found</p>
          <Link href="/orders">
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg">
              View All Orders
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const currentStep = getCurrentStepIndex()

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8">
      <Link href="/orders" className="text-orange-600 hover:text-orange-700 font-semibold mb-6 inline-block">
        ← Back to Orders
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Order Tracking */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Order Tracking</h2>

            {/* Timeline */}
            <div className="space-y-6">
              {trackingSteps.map((step, index) => {
                const isCompleted = index <= currentStep
                const isActive = index === currentStep

                return (
                  <div key={step.id} className="flex gap-4">
                    {/* Timeline Indicator */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          isCompleted
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : index + 1}
                      </div>
                      {index < trackingSteps.length - 1 && (
                        <div
                          className={`w-1 h-16 mt-2 ${
                            isCompleted ? 'bg-orange-600' : 'bg-gray-200'
                          }`}
                        ></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="pt-2 pb-6">
                      <h3
                        className={`font-bold text-lg ${
                          isCompleted ? 'text-gray-900' : 'text-gray-500'
                        }`}
                      >
                        {step.label}
                      </h3>
                      <p
                        className={`text-sm ${
                          isCompleted ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">Rs. {item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs. {(order.total_amount * 0.9).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>Rs. {(order.total_amount * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-200">
                <span>Total Amount</span>
                <span>Rs. {order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Restaurant Card */}
          {order.restaurants && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">From Restaurant</h3>
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900">{order.restaurants.name}</h4>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{order.restaurants.address}</p>
                </div>
                <a
                  href={`tel:${order.restaurants.phone}`}
                  className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm"
                >
                  <Phone className="w-4 h-4" />
                  {order.restaurants.phone}
                </a>
              </div>
            </div>
          )}

          {/* Delivery Address */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery Address</h3>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
              <p className="text-gray-900 font-semibold">{order.delivery_address}</p>
            </div>
          </div>

          {/* Estimated Time */}
          {order.order_status !== 'delivered' && order.order_status !== 'cancelled' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-gray-900">Estimated Delivery</h3>
              </div>
              <p className="text-2xl font-bold text-orange-600">25-30 min</p>
              <p className="text-sm text-gray-600 mt-1">Based on current location</p>
            </div>
          )}

          {/* Status Badge */}
          {order.order_status === 'delivered' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <p className="font-bold text-green-900">Order Delivered!</p>
              <p className="text-sm text-green-700 mt-1">Thank you for your order</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
