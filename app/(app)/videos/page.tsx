'use client'

import { useState } from 'react'
import { Play, Clock, Eye, Heart, Share2, ChefHat, Lock, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Video {
  id: string
  title: string
  description: string
  duration: string
  views: number
  likes: number
  thumbnail: string
  chef: string
  restaurant: string
  category: string
  isPremium: boolean
}

const cookingVideos: Video[] = [
  {
    id: '1',
    title: 'How to Make Perfect Margherita Pizza',
    description: 'Learn the secrets of making authentic Italian Margherita pizza with fresh ingredients',
    duration: '12:45',
    views: 15420,
    likes: 892,
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=450&fit=crop',
    chef: 'Chef Rahul',
    restaurant: "Domino's Pizza",
    category: 'Pizza',
    isPremium: false,
  },
  {
    id: '2',
    title: 'Authentic South Indian Masala Dosa',
    description: 'Step by step guide to crispy dosa with spicy potato filling',
    duration: '18:30',
    views: 23150,
    likes: 1456,
    thumbnail: 'https://images.unsplash.com/photo-1668236543090-82eb5eaf701b?w=800&h=450&fit=crop',
    chef: 'Chef Lakshmi',
    restaurant: 'South Indian Corner',
    category: 'South Indian',
    isPremium: false,
  },
  {
    id: '3',
    title: 'Classic Maggi with a Twist',
    description: 'Transform your regular Maggi into a gourmet dish with these easy tips',
    duration: '8:15',
    views: 45230,
    likes: 3201,
    thumbnail: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800&h=450&fit=crop',
    chef: 'Chef Amit',
    restaurant: 'Maggi Point',
    category: 'Snacks',
    isPremium: false,
  },
  {
    id: '4',
    title: 'Restaurant Style Dal Makhani',
    description: 'The secret recipe behind creamy, rich dal makhani that takes 24 hours',
    duration: '25:00',
    views: 18900,
    likes: 1678,
    thumbnail: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=450&fit=crop',
    chef: 'Chef Harpreet',
    restaurant: 'Punjabi Dhaba',
    category: 'North Indian',
    isPremium: true,
  },
  {
    id: '5',
    title: 'Perfect Cappuccino at Home',
    description: 'Barista secrets to making cafe-quality cappuccino without expensive equipment',
    duration: '10:20',
    views: 12340,
    likes: 876,
    thumbnail: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=450&fit=crop',
    chef: 'Chef Priya',
    restaurant: 'Cafe Coffee Day',
    category: 'Beverages',
    isPremium: true,
  },
  {
    id: '6',
    title: 'Indo-Chinese Hakka Noodles',
    description: 'Authentic street-style hakka noodles with the perfect smoky flavor',
    duration: '15:45',
    views: 28760,
    likes: 2134,
    thumbnail: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=450&fit=crop',
    chef: 'Chef Wong',
    restaurant: 'Chinese Wok',
    category: 'Chinese',
    isPremium: false,
  },
  {
    id: '7',
    title: 'Soft Gulab Jamun from Scratch',
    description: 'Traditional recipe for melt-in-mouth gulab jamun with perfect sugar syrup',
    duration: '20:10',
    views: 34520,
    likes: 2890,
    thumbnail: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&h=450&fit=crop',
    chef: 'Chef Sunita',
    restaurant: 'Lovely Sweets',
    category: 'Desserts',
    isPremium: true,
  },
  {
    id: '8',
    title: 'Cheese Burst Pizza Base Secret',
    description: 'How to make restaurant-style cheese burst pizza base at home',
    duration: '22:30',
    views: 19870,
    likes: 1543,
    thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=450&fit=crop',
    chef: 'Chef Marco',
    restaurant: 'La Pinoz Pizza',
    category: 'Pizza',
    isPremium: true,
  },
]

const categories = ['All', 'Pizza', 'North Indian', 'South Indian', 'Chinese', 'Snacks', 'Beverages', 'Desserts']

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null)
  const [likedVideos, setLikedVideos] = useState<string[]>([])

  const filteredVideos = selectedCategory === 'All'
    ? cookingVideos
    : cookingVideos.filter((v) => v.category === selectedCategory)

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  const toggleLike = (videoId: string) => {
    setLikedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    )
  }

  const isPremiumUser = () => {
    const subscription = localStorage.getItem('subscription')
    return subscription === 'premium' || subscription === 'pro'
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cooking Videos</h1>
        <p className="text-gray-600">
          Learn to cook your favorite dishes from campus restaurant chefs
        </p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Premium Banner */}
      {!isPremiumUser() && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Unlock All Premium Videos</h3>
                <p className="text-orange-100 text-sm">
                  Get unlimited access to exclusive cooking content
                </p>
              </div>
            </div>
            <Link href="/subscriptions">
              <Button className="bg-white text-orange-600 hover:bg-orange-50">
                Upgrade Now
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => {
          const isLocked = video.isPremium && !isPremiumUser()

          return (
            <div
              key={video.id}
              className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              <div
                className="relative aspect-video bg-gray-100 cursor-pointer group"
                onClick={() => !isLocked && setPlayingVideo(video)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className={`w-full h-full object-cover ${isLocked ? 'filter blur-sm' : ''}`}
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isLocked ? (
                    <div className="bg-black/60 rounded-full p-4">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                  ) : (
                    <div className="bg-orange-500 rounded-full p-4">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  )}
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>

                {/* Premium Badge */}
                {video.isPremium && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Premium
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {video.description}
                </p>

                {/* Chef Info */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <ChefHat className="w-3 h-3 text-orange-600" />
                  </div>
                  <span className="text-sm text-gray-600">{video.chef}</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-500">{video.restaurant}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatViews(video.views)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLike(video.id)
                      }}
                      className={`flex items-center gap-1 ${
                        likedVideos.includes(video.id) ? 'text-red-500' : ''
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${likedVideos.includes(video.id) ? 'fill-red-500' : ''}`}
                      />
                      {video.likes + (likedVideos.includes(video.id) ? 1 : 0)}
                    </button>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Video Player Modal */}
      {playingVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setPlayingVideo(null)}
        >
          <div
            className="bg-white rounded-xl max-w-4xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video Player Placeholder */}
            <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
              <img
                src={playingVideo.thumbnail}
                alt={playingVideo.title}
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <Play className="w-16 h-16 mb-4" />
                <p className="text-lg font-medium">Video Player</p>
                <p className="text-sm text-gray-300">Demo - Video would play here</p>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{playingVideo.title}</h2>
              <p className="text-gray-600 mb-4">{playingVideo.description}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">{playingVideo.chef}</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">{playingVideo.restaurant}</span>
              </div>
              <div className="mt-4 flex gap-3">
                <Button
                  onClick={() => setPlayingVideo(null)}
                  variant="outline"
                >
                  Close
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Order This Dish
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
