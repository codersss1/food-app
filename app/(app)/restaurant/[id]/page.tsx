'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Star, Clock, MapPin, Plus, Minus, ShoppingCart } from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  description: string
  image_url?: string
  is_available: boolean
}

interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  delivery_time: number
  delivery_fee: number
  min_order: number
  address: string
  phone: string
  image_url: string
}

export default function RestaurantPage() {
  const params = useParams()
  const router = useRouter()
  const restaurantId = params.id as string

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()

        // Fetch restaurant
        const { data: restData, error: restError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', restaurantId)
          .single()

        if (restError) throw restError
        setRestaurant(restData)

        // Fetch menu items
        const { data: menuData, error: menuError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .eq('is_available', true)
          .order('category', { ascending: true })

        if (menuError) throw menuError
        setMenuItems(menuData || [])

        // Extract unique categories
        const uniqueCategories = [...new Set(menuData?.map((item) => item.category) || [])]
        setCategories(uniqueCategories as string[])
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0] as string)
        }

        // Load cart from localStorage
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
        setCart(savedCart)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [restaurantId])

  const addToCart = (item: MenuItem) => {
    const updatedCart = [...cart]
    const existingItem = updatedCart.find(
      (cartItem) => cartItem.id === item.id && cartItem.restaurantId === restaurantId
    )

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      updatedCart.push({
        ...item,
        restaurantId,
        quantity: 1,
      })
    }

    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const removeFromCart = (itemId: string) => {
    const updatedCart = cart.filter((item) => item.id !== itemId)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    const updatedCart = cart
      .map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item
      )
      .filter((item) => item.quantity > 0)

    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : menuItems

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading restaurant details...</p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="p-4 md:p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Restaurant not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-24 md:pb-8">
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-80 bg-gray-200 overflow-hidden">
        <img
          src={restaurant.image_url || '/placeholder-restaurant.jpg'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
          <div className="p-4 md:p-8 text-white w-full">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-lg mb-4">{restaurant.cuisine}</p>
            <div className="flex flex-wrap gap-4 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-current" />
                <span>{restaurant.rating} rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{restaurant.delivery_time} min</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>Rs. {restaurant.delivery_fee}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white p-4 md:p-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Address</p>
            <p className="font-semibold text-gray-900">{restaurant.address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Contact</p>
            <p className="font-semibold text-gray-900">{restaurant.phone}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="mb-8 sticky top-20 bg-white z-10 py-4">
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                        selectedCategory === category
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const cartItem = cart.find((c) => c.id === item.id)
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      {/* Item Image */}
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}

                      {/* Item Details */}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                        <p className="font-bold text-lg text-gray-900">Rs. {item.price}</p>
                      </div>

                      {/* Add/Remove Button */}
                      <div className="flex items-end">
                        {cartItem ? (
                          <div className="flex items-center gap-2 bg-orange-100 rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, cartItem.quantity - 1)
                              }
                              className="p-2 hover:bg-orange-200 rounded"
                            >
                              <Minus className="w-4 h-4 text-orange-600" />
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, cartItem.quantity + 1)
                              }
                              className="p-2 hover:bg-orange-200 rounded"
                            >
                              <Plus className="w-4 h-4 text-orange-600" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-lg transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Cart Summary Sidebar */}
          {cart.length > 0 && (
            <div className="lg:col-span-1 sticky top-32 h-fit">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">x{item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        Rs. {item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Rs. {getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>Rs. {restaurant.delivery_fee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>Rs. {getCartTotal() + restaurant.delivery_fee}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout">
                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                    Proceed to Checkout
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
