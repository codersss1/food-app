'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { restaurants } from '@/lib/data'
import { Search, MapPin, Clock, DollarSign, Star } from 'lucide-react'

const cuisines = ['All', 'Pizza', 'Cafe', 'Indian', 'Chinese', 'Snacks', 'South Indian']

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('All')

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  const filtered = restaurants.filter((r) => {
    const matchesCuisine = selectedCuisine === 'All' || r.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase())
    const matchesSearch = !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCuisine && matchesSearch
  })

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {user ? `Welcome, ${user.name?.split(' ')[0] || 'Guest'}!` : 'Order Food Online'}
        </h1>
        <p className="text-gray-600 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-600" /> Delivering to LPU Campus
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search restaurants"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Cuisines */}
      <div className="flex gap-2 overflow-x-auto mb-8 pb-2">
        {cuisines.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCuisine(c)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap ${
              selectedCuisine === c ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Restaurants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((r) => (
          <Link key={r.id} href={`/restaurant/${r.id}`}>
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden h-full">
              <div className="relative h-40 bg-gray-200">
                <img src={r.image_url} alt={r.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow">
                  <Star className="w-4 h-4 text-orange-600 fill-orange-600" />
                  <span className="font-semibold">{r.rating}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900">{r.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{r.cuisine}</p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> {r.delivery_time} min</p>
                  <p className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> Min Rs. {r.min_order}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-12">No restaurants found</p>
      )}
    </div>
  )
}
