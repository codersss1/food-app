'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Demo login - shows the UI without dependencies
      if (email && password) {
        localStorage.setItem('user', JSON.stringify({ 
          id: `user-${Date.now()}`,
          email, 
          name: email.split('@')[0],
          fullName: email.split('@')[0]
        }))
        localStorage.setItem('foodhub_user', JSON.stringify({ 
          id: `user-${Date.now()}`,
          email, 
          name: email.split('@')[0] 
        }))
        router.push('/home')
      } else {
        setError('Please enter email and password')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError(null)
    try {
      // Demo Google sign in
      const userData = { 
        id: `user-${Date.now()}`,
        email: 'student@lpu.in', 
        name: 'Student', 
        fullName: 'Student User',
        provider: 'google' 
      }
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('foodhub_user', JSON.stringify(userData))
      router.push('/home')
    } catch (err: any) {
      setError('Failed to sign in with Google')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 rounded-full mb-4">
            <span className="text-2xl">🍕</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FoodHub LPU</h1>
          <p className="text-gray-600">Food delivered to your hostel, fast & fresh</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="student@lpu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
            >
              {loading ? <Spinner className="w-4 h-4" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <span className="text-sm text-gray-500">
                Forgot password? Contact support
              </span>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="text-gray-500 text-sm">Or continue with</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Google Sign In Button */}
          <Button
            type="button"
            disabled={googleLoading}
            onClick={handleGoogleSignIn}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            {googleLoading ? (
              <Spinner className="w-4 h-4" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {googleLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Sign Up Link */}
          <Link href="/auth/signup">
            <Button
              type="button"
              variant="outline"
              className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 font-semibold py-3 rounded-lg"
            >
              Create Account
            </Button>
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-xs mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
