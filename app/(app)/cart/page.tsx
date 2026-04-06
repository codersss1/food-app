'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trash2, Plus, Minus } from 'lucide-react'
import { getRestaurant } from '@/lib/data'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  restaurantId: string
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [restaurant, setRestaurant] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
        setCart(savedCart)

        if (savedCart.length > 0) {
          const restaurantData = getRestaurant(savedCart[0].restaurantId)
          if (restaurantData) setRestaurant(restaurantData)
        }
      } catch (error) {
        console.error('Error loading cart:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [])

  const updateQuantity = (itemId: string, quantity: number) => {
    const updatedCart = cart
      .map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item
      )
      .filter((item) => item.quantity > 0)

    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const removeFromCart = (itemId: string) => {
    const updatedCart = cart.filter((item) => item.id !== itemId)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTax = () => {
    return Math.round(getSubtotal() * 0.05 * 100) / 100 // 5% tax
  }

  const getDeliveryFee = () => {
    return restaurant?.delivery_fee || 0
  }

  const getTotal = () => {
    return getSubtotal() + getTax() + getDeliveryFee()
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="p-4 md:p-8 pb-24 md:pb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        <div className="text-center py-12">
          <p className="text-4xl mb-4">🛒</p>
          <p className="text-gray-500 text-lg mb-6">Your cart is empty</p>
          <Link href="/home">
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-lg">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {restaurant && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Ordering from</p>
              <p className="font-bold text-lg text-gray-900">{restaurant.name}</p>
              <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
            </div>
          )}

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600 font-semibold">Rs. {item.price}</p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-orange-100 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-orange-200 rounded transition-colors"
                    >
                      <Minus className="w-4 h-4 text-orange-600" />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-orange-200 rounded transition-colors"
                    >
                      <Plus className="w-4 h-4 text-orange-600" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="w-20 text-right">
                    <p className="font-bold text-gray-900">
                      Rs. {item.price * item.quantity}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 sticky top-32 h-fit">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs. {getSubtotal()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (5%)</span>
                <span>Rs. {getTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>Rs. {getDeliveryFee()}</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg text-gray-900 mb-6">
              <span>Total Amount</span>
              <span>Rs. {getTotal()}</span>
            </div>

            <Link href="/checkout">
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors">
                Proceed to Checkout
              </button>
            </Link>

            <Link href="/home">
              <button className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-lg transition-colors">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
