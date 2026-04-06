'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

// Sample hostels
const sampleHostels = [
  { id: 'h1', name: 'Block 34 - Boys Hostel' },
  { id: 'h2', name: 'Block 35 - Boys Hostel' },
  { id: 'h3', name: 'Block 36 - Girls Hostel' },
  { id: 'h4', name: 'Block 37 - Girls Hostel' },
  { id: 'h5', name: 'Block 38 - International Hostel' },
]

export default function VerifyStudentPage() {
  const router = useRouter()
  const [studentId, setStudentId] = useState('')
  const [hostelId, setHostelId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!studentId.trim()) {
      setError('Please enter your student ID')
      return
    }

    if (!hostelId) {
      setError('Please select your hostel')
      return
    }

    setLoading(true)

    try {
      // Demo verification - save to localStorage
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        const updatedUser = {
          ...userData,
          studentId,
          hostelId,
          isLpuStudent: true,
          isVerified: true,
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        localStorage.setItem('foodhub_user', JSON.stringify(updatedUser))
      }

      setSuccessMessage('Student verification successful!')
      setTimeout(() => {
        router.push('/home')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 rounded-full mb-4">
            <span className="text-2xl">🎓</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LPU Student Verification</h1>
          <p className="text-gray-600">Verify your student status to unlock exclusive offers</p>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
          <form onSubmit={handleVerification} className="space-y-6">
            {/* Info Box */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
              <p className="font-semibold mb-1">Why verify?</p>
              <p>Get student-exclusive discounts, faster delivery to hostels, and special promo codes!</p>
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student ID
              </label>
              <Input
                type="text"
                placeholder="e.g., LPU12345678"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Found on your student ID card</p>
            </div>

            {/* Hostel Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Hostel
              </label>
              <select
                value={hostelId}
                onChange={(e) => setHostelId(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select your hostel</option>
                {sampleHostels.map((hostel) => (
                  <option key={hostel.id} value={hostel.id}>
                    {hostel.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            {/* Verify Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
            >
              {loading ? <Spinner className="w-4 h-4" /> : null}
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </Button>

            {/* Skip Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/home')}
              className="w-full border-gray-300 text-gray-700 font-semibold py-3 rounded-lg"
            >
              Skip for Now
            </Button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-xs mt-8">
          You can verify your student status anytime in your profile settings
        </p>
      </div>
    </div>
  )
}
