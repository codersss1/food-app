'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleResendOTP = async () => {
    setLoading(true)
    try {
      // Demo: simulate resending
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Verification email resent successfully!')
    } catch (err: any) {
      setMessage(err.message || 'Failed to resend')
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    // For demo, go directly to home
    router.push('/home')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">Almost there! Check your inbox to verify your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
              <p className="font-semibold mb-1">Demo Mode</p>
              <p>In a real app, you would receive an email. For now, click Continue to proceed.</p>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">What happens next?</p>
              <ol className="space-y-2 list-decimal list-inside">
                <li>Check your email (including spam folder)</li>
                <li>Click the verification link</li>
                <li>Complete student verification</li>
                <li>Start ordering delicious food</li>
              </ol>
            </div>

            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
                {message}
              </div>
            )}

            <Button
              type="button"
              onClick={handleContinue}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg"
            >
              Continue to App
            </Button>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600 mb-4">Didn&apos;t receive the email?</p>
              <Button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                variant="outline"
                className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 font-semibold py-3 rounded-lg"
              >
                {loading ? 'Resending...' : 'Resend Verification Email'}
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/auth/login" className="text-orange-600 hover:text-orange-700 font-semibold text-sm">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
