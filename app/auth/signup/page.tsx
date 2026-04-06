'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

export default function SignUpPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!fullName.trim()) {
      setError('Please enter your full name')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    if (phone.length < 10) {
      setError('Please enter a valid phone number')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!agreeTerms) {
      setError('Please agree to the terms and conditions')
      return
    }

    setLoading(true)

    try {
      // Demo signup
      const userData = { 
        id: `user-${Date.now()}`,
        fullName, 
        email, 
        phone, 
        name: fullName 
      }
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('foodhub_user', JSON.stringify(userData))
      router.push('/home')
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true)
    setError(null)
    try {
      // Demo Google sign up
      const userData = { 
        id: `user-${Date.now()}`,
        fullName: 'Google User', 
        email: 'user@gmail.com', 
        name: 'Google User',
        provider: 'google' 
      }
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('foodhub_user', JSON.stringify(userData))
      router.push('/home')
    } catch (err: any) {
      setError('Failed to sign up with Google')
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join FoodHub and get hungry fast</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
          {/* Google Sign Up Button */}
          <Button
            type="button"
            disabled={googleLoading}
            onClick={handleGoogleSignUp}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mb-6"
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
            {googleLoading ? 'Signing up...' : 'Sign up with Google'}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="text-gray-500 text-sm">or sign up with email</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {/* Email */}
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

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-orange-600 hover:text-orange-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-orange-600 hover:text-orange-700">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Sign Up Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mt-6"
            >
              {loading ? <Spinner className="w-4 h-4" /> : null}
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-orange-600 hover:text-orange-700 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-xs mt-8">
          We&apos;ll send a verification email to confirm your account
        </p>
      </div>
    </div>
  )
}
