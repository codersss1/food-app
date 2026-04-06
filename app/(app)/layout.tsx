'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, User, Home, LogOut } from 'lucide-react'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = () => {
      try {
        // Check localStorage for user data
        const storedUser = localStorage.getItem('user')
        
        if (!storedUser) {
          router.push('/auth/login')
          return
        }

        setUser(JSON.parse(storedUser))

        // Get cart count from localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        setCartCount(cart.length)
      } catch (error) {
        console.error('Error checking user:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Listen for storage changes to update cart count
    const handleStorageChange = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartCount(cart.length)
    }

    // Also check periodically for cart changes (for same-tab updates)
    const interval = setInterval(handleStorageChange, 1000)

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [router])

  const handleLogout = () => {
    try {
      localStorage.removeItem('user')
      localStorage.removeItem('foodhub_user')
      localStorage.removeItem('cart')
      router.push('/auth/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">🍕</div>
          <p className="text-gray-600">Loading FoodHub...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2 text-2xl font-bold text-orange-600">
            <span>🍕</span>
            <span>FoodHub</span>
          </Link>

          {/* Center - Search/Branding */}
          <div className="flex-1 mx-8 hidden md:block">
            <div className="text-sm text-gray-600">
              Delivering to <span className="font-semibold text-gray-900">LPU Campus</span>
            </div>
          </div>

          {/* Right - Cart & User Menu */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
              <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="w-6 h-6 text-gray-700" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around">
          <Link
            href="/home"
            className="flex-1 flex flex-col items-center gap-1 py-3 text-gray-700 hover:text-orange-600"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            href="/cart"
            className="flex-1 flex flex-col items-center gap-1 py-3 text-gray-700 hover:text-orange-600 relative"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-2 right-4 bg-orange-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="text-xs">Cart</span>
          </Link>
          <Link
            href="/orders"
            className="flex-1 flex flex-col items-center gap-1 py-3 text-gray-700 hover:text-orange-600"
          >
            <span className="text-xl">📦</span>
            <span className="text-xs">Orders</span>
          </Link>
          <Link
            href="/profile"
            className="flex-1 flex flex-col items-center gap-1 py-3 text-gray-700 hover:text-orange-600"
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
