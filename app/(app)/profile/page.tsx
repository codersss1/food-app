'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { CheckCircle2, Edit2, Save, X } from 'lucide-react'

// Sample hostels
const sampleHostels = [
  { id: 'h1', name: 'Block 34 - Boys Hostel' },
  { id: 'h2', name: 'Block 35 - Boys Hostel' },
  { id: 'h3', name: 'Block 36 - Girls Hostel' },
  { id: 'h4', name: 'Block 37 - Girls Hostel' },
  { id: 'h5', name: 'Block 38 - International Hostel' },
]

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [hostelId, setHostelId] = useState('')

  useEffect(() => {
    const loadProfile = () => {
      try {
        // Get current user from localStorage
        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
          router.push('/auth/login')
          return
        }

        const userData = JSON.parse(storedUser)
        setUser(userData)
        setFullName(userData.fullName || userData.name || '')
        setPhone(userData.phone || '')
        setAddress(userData.address || '')
        setHostelId(userData.hostelId || '')
      } catch (error) {
        console.error('Error loading profile:', error)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleSave = () => {
    setError(null)
    setSuccess(null)

    if (!fullName.trim()) {
      setError('Please enter your full name')
      return
    }

    if (!phone.trim()) {
      setError('Please enter your phone number')
      return
    }

    setSaving(true)

    try {
      // Update user in localStorage
      const updatedUser = {
        ...user,
        fullName,
        name: fullName,
        phone,
        address,
        hostelId,
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      localStorage.setItem('foodhub_user', JSON.stringify(updatedUser))
      setUser(updatedUser)

      setSuccess('Profile updated successfully!')
      setEditing(false)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFullName(user?.fullName || user?.name || '')
    setPhone(user?.phone || '')
    setAddress(user?.address || '')
    setHostelId(user?.hostelId || '')
    setEditing(false)
    setError(null)
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="text-center py-12">
          <Spinner />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Form */}
            <div className="space-y-6">
              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-semibold">
                  {user?.email || 'Not set'}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!editing}
                  className="w-full"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!editing}
                  className="w-full"
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={!editing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 disabled:border-gray-300"
                  rows={3}
                  placeholder="Enter your hostel room number and address"
                />
              </div>

              {/* Hostel Selection */}
              {editing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Hostel
                  </label>
                  <select
                    value={hostelId}
                    onChange={(e) => setHostelId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select hostel</option>
                    {sampleHostels.map((hostel) => (
                      <option key={hostel.id} value={hostel.id}>
                        {hostel.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Demo Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  This is a demo application. Your profile data is stored locally in your browser.
                </p>
              </div>

              {/* Action Buttons */}
              {editing && (
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
                  >
                    {saving ? <Spinner className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Account Info */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6 shadow-lg">
            <p className="text-sm text-gray-600 mb-2">Welcome to FoodHub</p>
            <p className="text-2xl font-bold text-gray-900">
              {fullName || 'User'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a
                href="/orders"
                className="block text-orange-600 hover:text-orange-700 font-semibold text-sm"
              >
                View Orders
              </a>
              <a
                href="/home"
                className="block text-orange-600 hover:text-orange-700 font-semibold text-sm"
              >
                Browse Restaurants
              </a>
              <a
                href="/cart"
                className="block text-orange-600 hover:text-orange-700 font-semibold text-sm"
              >
                View Cart
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
