'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { restaurantAPI } from '@/lib/api'
import { Search, MapPin, Clock, DollarSign, Star } from 'lucide-react'

interface Restaurant {
  _id: string
  name: string
  cuisine: string
  rating: number
  deliveryTime: number
  deliveryFee: number
  minOrder: number
  image: string
}

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedCuisine, setSelectedCuisine] = useState('all')
  const [hostelInfo, setHostelInfo] = useState<any>(null)

  const cuisines = [
    { id: 'all', name: 'All' },
    { id: 'pizza', name: 'Pizza' },
    { id: 'burger', name: 'Burgers' },
    { id: 'chinese', name: 'Chinese' },
    { id: 'north-indian', name: 'North Indian' },
    { id: 'south-indian', name: 'South Indian' },
  ]

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    const fetchData = async () => {
      try {
        // Fetch restaurants from backend API
        const response = await restaurantAPI.getAll()
        const data = response.data || response
        
        setRestaurants(data)
        setFilteredRestaurants(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter restaurants based on search and cuisine
  useEffect(() => {
    let filtered = restaurants

    // Filter by cuisine
    if (selectedCuisine !== 'all') {
      filtered = filtered.filter((r) =>
        r.cuisine.toLowerCase().includes(selectedCuisine)
      )
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredRestaurants(filtered)
  }, [searchQuery, selectedCuisine, restaurants])

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading restaurants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8">
      {/* Header with User Info */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {user
            ? `Welcome back, ${user.name?.split(' ')[0] || user.fullName?.split(' ')[0]}! 👋`
            : 'Order Food Online'}
        </h1>
        {hostelInfo && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5 text-orange-600" />
            <span>Delivering to {hostelInfo.hostels?.name || 'your location'}</span>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search restaurants or cuisines"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Cuisine Filter */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine.id}
              onClick={() => setSelectedCuisine(cuisine.id)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCuisine === cuisine.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cuisine.name}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurants Grid */}
      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden cursor-pointer h-full flex flex-col">
                {/* Restaurant Image */}
                <div className="relative h-40 bg-gray-200 overflow-hidden">
                  <img
                    src={restaurant.image_url || '/placeholder-restaurant.jpg'}
                    alt={restaurant.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
                    <Star className="w-4 h-4 text-orange-600 fill-orange-600" />
                    <span className="font-semibold text-gray-900">{restaurant.rating}</span>
                  </div>
                </div>

                {/* Restaurant Info */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{restaurant.cuisine}</p>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-gray-600 flex-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{restaurant.delivery_time} min delivery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span>
                        Min order: Rs. {restaurant.min_order} • Delivery: Rs.{' '}
                        {restaurant.delivery_fee}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchQuery || selectedCuisine !== 'all'
              ? 'No restaurants found. Try different filters.'
              : 'No restaurants available'}
          </p>
        </div>
      )}
    </div>
  )
}
