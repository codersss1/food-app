'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Phone, MapPin, Clock, CheckCircle2 } from 'lucide-react'

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
  const [realtimeUpdates, setRealtimeUpdates] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const supabase = createClient()

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/auth/login')
          return
        }

        // Fetch order
        const { data, error } = await supabase
          .from('orders')
          .select('*, restaurants(name, phone, address, image_url)')
          .eq('id', orderId)
          .eq('user_id', user.id)
          .single()

        if (error) throw error
        setOrder(data)

        // Subscribe to real-time updates
        const subscription = supabase
          .channel(`order:${orderId}`)
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
            (payload) => {
              setOrder((prev) =>
                prev ? { ...prev, ...payload.new } : null
              )
              setRealtimeUpdates(true)
              setTimeout(() => setRealtimeUpdates(false), 2000)
            }
          )
          .subscribe()

        return () => {
          subscription.unsubscribe()
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
          <p className="text-gray-500">Order not found</p>
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

      {realtimeUpdates && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
          Order updated in real-time
        </div>
      )}

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
                <span>Rs. {order.total_amount}</span>
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
