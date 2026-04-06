'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Star, Clock, MapPin, Plus, Minus, ShoppingCart } from 'lucide-react'
import { getRestaurant, getMenuItems } from '@/lib/data'

interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  description: string
  is_available: boolean
}

export default function RestaurantPage() {
  const params = useParams()
  const restaurantId = params.id as string

  const [cart, setCart] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')

  const restaurant = getRestaurant(restaurantId)
  const menuItems = getMenuItems(restaurantId)
  const categories = [...new Set(menuItems.map((item) => item.category))]

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0])
    }
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(savedCart)
  }, [])

  const addToCart = (item: MenuItem) => {
    if (cart.length > 0 && cart[0].restaurantId !== restaurantId) {
      if (confirm('Clear cart and add this item?')) {
        const newCart = [{ ...item, restaurantId, quantity: 1 }]
        setCart(newCart)
        localStorage.setItem('cart', JSON.stringify(newCart))
      }
      return
    }

    const updatedCart = [...cart]
    const existing = updatedCart.find((c) => c.id === item.id)
    if (existing) {
      existing.quantity += 1
    } else {
      updatedCart.push({ ...item, restaurantId, quantity: 1 })
    }
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    const updatedCart = cart
      .map((item) => item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item)
      .filter((item) => item.quantity > 0)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const getCartTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : menuItems

  if (!restaurant) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">Restaurant not found</p>
        <Link href="/home" className="text-orange-600 hover:underline">Browse Restaurants</Link>
      </div>
    )
  }

  return (
    <div className="pb-24 md:pb-8">
      {/* Header */}
      <div className="relative h-64 md:h-80 bg-gray-200">
        <img src={restaurant.image_url} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30 flex items-end">
          <div className="p-6 text-white w-full">
            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
            <p className="mb-3">{restaurant.cuisine}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-current" /> {restaurant.rating}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {restaurant.delivery_time} min</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Rs. {restaurant.delivery_fee} delivery</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu */}
          <div className="lg:col-span-2">
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full font-medium whitespace-nowrap ${
                    selectedCategory === cat ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Items */}
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const cartItem = cart.find((c) => c.id === item.id)
                return (
                  <div key={item.id} className="bg-white rounded-lg border p-4 flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                      <p className="font-bold text-gray-900 mt-2">Rs. {item.price}</p>
                    </div>
                    {cartItem ? (
                      <div className="flex items-center gap-2 bg-orange-100 rounded-lg">
                        <button onClick={() => updateQuantity(item.id, cartItem.quantity - 1)} className="p-2">
                          <Minus className="w-4 h-4 text-orange-600" />
                        </button>
                        <span className="w-8 text-center font-semibold">{cartItem.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, cartItem.quantity + 1)} className="p-2">
                          <Plus className="w-4 h-4 text-orange-600" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(item)} className="bg-orange-600 text-white p-2 rounded-lg">
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border p-6 sticky top-32">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4 pb-4 border-b">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} x{item.quantity}</span>
                      <span>Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Rs. {getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span>Rs. {restaurant.delivery_fee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>Rs. {getCartTotal() + restaurant.delivery_fee}</span>
                  </div>
                </div>
                <Link href="/checkout">
                  <button className="w-full bg-orange-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Checkout
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
