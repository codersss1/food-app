'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, User, Home, LogOut, Crown, PlayCircle, MessageCircle } from 'lucide-react'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
          router.push('/auth/login')
          return
        }
        setUser(JSON.parse(storedUser))
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        setCartCount(cart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0))
      } catch (error) {
        console.error('Error checking user:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    const handleStorageChange = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartCount(cart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0))
    }

    const interval = setInterval(handleStorageChange, 1000)
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('foodhub_user')
    localStorage.removeItem('cart')
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading LPU Eats...</p>
        </div>
      </div>
    )
  }

  const isActive = (path: string) => pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/home" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl p-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                LPU Eats
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/home"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive('/home') ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Home
              </Link>
              <Link
                href="/videos"
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  isActive('/videos') ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <PlayCircle className="w-4 h-4" />
                Videos
              </Link>
              <Link
                href="/subscriptions"
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  isActive('/subscriptions') ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Crown className="w-4 h-4" />
                Premium
              </Link>
              <Link
                href="/chat"
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  isActive('/chat') ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </Link>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <Link
                href="/cart"
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="hidden md:flex items-center gap-2 pl-3 border-l">
                <Link href="/profile" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.name?.split(' ')[0] || 'User'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto pb-20 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="flex items-center justify-around py-2">
          <Link
            href="/home"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${
              isActive('/home') ? 'text-orange-600' : 'text-gray-500'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            href="/videos"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${
              isActive('/videos') ? 'text-orange-600' : 'text-gray-500'
            }`}
          >
            <PlayCircle className="w-5 h-5" />
            <span className="text-xs">Videos</span>
          </Link>
          <Link
            href="/cart"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg relative ${
              isActive('/cart') ? 'text-orange-600' : 'text-gray-500'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-1 bg-orange-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="text-xs">Cart</span>
          </Link>
          <Link
            href="/subscriptions"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${
              isActive('/subscriptions') ? 'text-orange-600' : 'text-gray-500'
            }`}
          >
            <Crown className="w-5 h-5" />
            <span className="text-xs">Premium</span>
          </Link>
          <Link
            href="/profile"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${
              isActive('/profile') ? 'text-orange-600' : 'text-gray-500'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
