'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Star, Clock, MapPin, Plus, Minus, ShoppingCart } from 'lucide-react'

// Sample restaurants data
const restaurantsData: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Pizza Paradise',
    cuisine: 'Italian, Pizza',
    rating: 4.5,
    delivery_time: 30,
    delivery_fee: 40,
    min_order: 200,
    address: 'Block 34, LPU Campus',
    phone: '+91 98765 43210',
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop',
  },
  '2': {
    id: '2',
    name: 'Burger Barn',
    cuisine: 'American, Burgers',
    rating: 4.3,
    delivery_time: 25,
    delivery_fee: 30,
    min_order: 150,
    address: 'Block 32, LPU Campus',
    phone: '+91 98765 43211',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop',
  },
  '3': {
    id: '3',
    name: 'Dragon Wok',
    cuisine: 'Chinese, Asian',
    rating: 4.4,
    delivery_time: 35,
    delivery_fee: 35,
    min_order: 250,
    address: 'Block 28, LPU Campus',
    phone: '+91 98765 43212',
    image_url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=400&fit=crop',
  },
  '4': {
    id: '4',
    name: 'Spice Garden',
    cuisine: 'North Indian',
    rating: 4.6,
    delivery_time: 40,
    delivery_fee: 25,
    min_order: 200,
    address: 'Block 36, LPU Campus',
    phone: '+91 98765 43213',
    image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=400&fit=crop',
  },
  '5': {
    id: '5',
    name: 'Dosa Corner',
    cuisine: 'South Indian',
    rating: 4.7,
    delivery_time: 25,
    delivery_fee: 20,
    min_order: 100,
    address: 'Block 30, LPU Campus',
    phone: '+91 98765 43214',
    image_url: 'https://images.unsplash.com/photo-1668236543090-82eb5eaf701b?w=800&h=400&fit=crop',
  },
  '6': {
    id: '6',
    name: 'Cafe Mocha',
    cuisine: 'Cafe, Snacks',
    rating: 4.2,
    delivery_time: 20,
    delivery_fee: 15,
    min_order: 100,
    address: 'Block 25, LPU Campus',
    phone: '+91 98765 43215',
    image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=400&fit=crop',
  },
}

// Sample menu items
const menuItemsData: Record<string, any[]> = {
  '1': [
    { id: 'm1', restaurant_id: '1', name: 'Margherita Pizza', category: 'Pizza', price: 299, description: 'Classic tomato and mozzarella', is_available: true, image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop' },
    { id: 'm2', restaurant_id: '1', name: 'Pepperoni Pizza', category: 'Pizza', price: 399, description: 'Loaded with spicy pepperoni', is_available: true, image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&h=200&fit=crop' },
    { id: 'm3', restaurant_id: '1', name: 'Garlic Bread', category: 'Sides', price: 149, description: 'Crispy garlic bread with herbs', is_available: true },
    { id: 'm4', restaurant_id: '1', name: 'Pasta Alfredo', category: 'Pasta', price: 279, description: 'Creamy white sauce pasta', is_available: true },
    { id: 'm5', restaurant_id: '1', name: 'Cold Coffee', category: 'Beverages', price: 99, description: 'Chilled coffee with ice cream', is_available: true },
  ],
  '2': [
    { id: 'm6', restaurant_id: '2', name: 'Classic Burger', category: 'Burgers', price: 199, description: 'Beef patty with fresh veggies', is_available: true, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
    { id: 'm7', restaurant_id: '2', name: 'Cheese Burger', category: 'Burgers', price: 249, description: 'Double cheese loaded burger', is_available: true },
    { id: 'm8', restaurant_id: '2', name: 'French Fries', category: 'Sides', price: 99, description: 'Crispy golden fries', is_available: true },
    { id: 'm9', restaurant_id: '2', name: 'Chicken Wings', category: 'Sides', price: 199, description: 'Spicy chicken wings', is_available: true },
    { id: 'm10', restaurant_id: '2', name: 'Milkshake', category: 'Beverages', price: 129, description: 'Creamy vanilla milkshake', is_available: true },
  ],
  '3': [
    { id: 'm11', restaurant_id: '3', name: 'Fried Rice', category: 'Rice', price: 179, description: 'Vegetable fried rice', is_available: true, image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200&h=200&fit=crop' },
    { id: 'm12', restaurant_id: '3', name: 'Manchurian', category: 'Starters', price: 199, description: 'Crispy veg manchurian', is_available: true },
    { id: 'm13', restaurant_id: '3', name: 'Hakka Noodles', category: 'Noodles', price: 169, description: 'Spicy hakka noodles', is_available: true },
    { id: 'm14', restaurant_id: '3', name: 'Spring Rolls', category: 'Starters', price: 149, description: 'Crispy vegetable spring rolls', is_available: true },
    { id: 'm15', restaurant_id: '3', name: 'Sweet Corn Soup', category: 'Soups', price: 99, description: 'Hot and sweet corn soup', is_available: true },
  ],
  '4': [
    { id: 'm16', restaurant_id: '4', name: 'Butter Chicken', category: 'Main Course', price: 349, description: 'Creamy tomato chicken curry', is_available: true, image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&h=200&fit=crop' },
    { id: 'm17', restaurant_id: '4', name: 'Dal Makhani', category: 'Main Course', price: 249, description: 'Creamy black lentils', is_available: true },
    { id: 'm18', restaurant_id: '4', name: 'Butter Naan', category: 'Breads', price: 49, description: 'Soft butter naan', is_available: true },
    { id: 'm19', restaurant_id: '4', name: 'Biryani', category: 'Rice', price: 299, description: 'Aromatic chicken biryani', is_available: true },
    { id: 'm20', restaurant_id: '4', name: 'Lassi', category: 'Beverages', price: 79, description: 'Sweet yogurt drink', is_available: true },
  ],
  '5': [
    { id: 'm21', restaurant_id: '5', name: 'Masala Dosa', category: 'Dosa', price: 99, description: 'Crispy dosa with potato filling', is_available: true, image_url: 'https://images.unsplash.com/photo-1668236543090-82eb5eaf701b?w=200&h=200&fit=crop' },
    { id: 'm22', restaurant_id: '5', name: 'Idli Sambar', category: 'Breakfast', price: 79, description: 'Soft idlis with sambar', is_available: true },
    { id: 'm23', restaurant_id: '5', name: 'Vada', category: 'Snacks', price: 49, description: 'Crispy medu vada', is_available: true },
    { id: 'm24', restaurant_id: '5', name: 'Uttapam', category: 'Dosa', price: 89, description: 'Thick pancake with toppings', is_available: true },
    { id: 'm25', restaurant_id: '5', name: 'Filter Coffee', category: 'Beverages', price: 39, description: 'Traditional South Indian coffee', is_available: true },
  ],
  '6': [
    { id: 'm26', restaurant_id: '6', name: 'Cappuccino', category: 'Coffee', price: 149, description: 'Rich espresso with foam', is_available: true },
    { id: 'm27', restaurant_id: '6', name: 'Sandwich', category: 'Snacks', price: 129, description: 'Grilled vegetable sandwich', is_available: true },
    { id: 'm28', restaurant_id: '6', name: 'Brownie', category: 'Desserts', price: 99, description: 'Warm chocolate brownie', is_available: true },
    { id: 'm29', restaurant_id: '6', name: 'Pasta', category: 'Main', price: 199, description: 'Creamy pasta with garlic bread', is_available: true },
    { id: 'm30', restaurant_id: '6', name: 'Smoothie', category: 'Beverages', price: 129, description: 'Mixed berry smoothie', is_available: true },
  ],
}

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
    const fetchData = () => {
      try {
        // Get restaurant data
        const restData = restaurantsData[restaurantId]
        if (restData) {
          setRestaurant(restData)
        }

        // Get menu items
        const menuData = menuItemsData[restaurantId] || []
        setMenuItems(menuData)

        // Extract unique categories
        const uniqueCategories = [...new Set(menuData.map((item) => item.category))]
        setCategories(uniqueCategories)
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0])
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
    // Check if cart has items from a different restaurant
    if (cart.length > 0 && cart[0].restaurantId !== restaurantId) {
      if (confirm('Your cart has items from another restaurant. Clear cart and add this item?')) {
        const newCart = [{
          ...item,
          restaurantId,
          quantity: 1,
        }]
        setCart(newCart)
        localStorage.setItem('cart', JSON.stringify(newCart))
      }
      return
    }

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
          <p className="text-gray-500 mb-4">Restaurant not found</p>
          <Link href="/home">
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg">
              Browse Restaurants
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-24 md:pb-8">
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-80 bg-gray-200 overflow-hidden">
        <img
          src={restaurant.image_url}
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
                <span>Rs. {restaurant.delivery_fee} delivery</span>
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
