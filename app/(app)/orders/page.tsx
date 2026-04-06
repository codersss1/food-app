'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Clock, CheckCircle, TrendingUp, Truck } from 'lucide-react'

// Sample restaurants data for lookup
const restaurantsData: Record<string, any> = {
  '1': { id: '1', name: 'Pizza Paradise', image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' },
  '2': { id: '2', name: 'Burger Barn', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
  '3': { id: '3', name: 'Dragon Wok', image_url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop' },
  '4': { id: '4', name: 'Spice Garden', image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },
  '5': { id: '5', name: 'Dosa Corner', image_url: 'https://images.unsplash.com/photo-1668236543090-82eb5eaf701b?w=400&h=300&fit=crop' },
  '6': { id: '6', name: 'Cafe Mocha', image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop' },
}

interface Order {
  id: string
  restaurant_id: string
  total_amount: number
  order_status: string
  payment_status: string
  created_at: string
  restaurants?: any
}

const statusConfig: any = {
  pending_payment: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Pending Payment' },
  confirmed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Confirmed' },
  preparing: { icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Preparing' },
  ready: { icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Ready for Pickup' },
  on_the_way: { icon: Truck, color: 'text-orange-600', bg: 'bg-orange-50', label: 'On the Way' },
  delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Delivered' },
  cancelled: { icon: Clock, color: 'text-red-600', bg: 'bg-red-50', label: 'Cancelled' },
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = () => {
      try {
        // Check if user is logged in
        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
          router.push('/auth/login')
          return
        }

        // Get orders from localStorage
        const storedOrders = JSON.parse(localStorage.getItem('foodhub_orders') || '[]')
        
        // Add restaurant data to orders
        const ordersWithRestaurants = storedOrders.map((order: Order) => ({
          ...order,
          restaurants: restaurantsData[order.restaurant_id] || { name: 'Restaurant', image_url: '' }
        }))

        setOrders(ordersWithRestaurants)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [router])

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="p-4 md:p-8 pb-24 md:pb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>
        <div className="text-center py-12">
          <p className="text-4xl mb-4">📦</p>
          <p className="text-gray-500 text-lg mb-6">No orders yet</p>
          <Link href="/home">
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-lg">
              Order Now
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const config = statusConfig[order.order_status] || statusConfig.pending_payment
          const Icon = config.icon

          return (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <div className={`${config.bg} border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow cursor-pointer mb-4`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">
                      {order.restaurants?.name || 'Restaurant'}
                    </h3>
                    <p className="text-sm text-gray-600">Order #{order.id.slice(0, 8)}</p>
                  </div>
                  <div className={`flex items-center gap-2 ${config.color}`}>
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{config.label}</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Total Amount:</span> Rs. {order.total_amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Payment:</span> {order.payment_status === 'completed' ? '✓ Paid' : 'Pending'}
                    </p>
                  </div>

                  <div className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
