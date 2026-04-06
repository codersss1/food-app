'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<any[]>([])
  const [restaurant, setRestaurant] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient()

        // Get current user
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (!authUser) {
          router.push('/auth/login')
          return
        }

        setUser(authUser)

        // Get user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (profileData) {
          setProfile(profileData)
          setPhoneNumber(profileData.phone || '')
          setDeliveryAddress(profileData.address || '')
        }

        // Load cart
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
        setCart(savedCart)

        if (savedCart.length > 0) {
          // Fetch restaurant
          const { data: restData } = await supabase
            .from('restaurants')
            .select('*')
            .eq('id', savedCart[0].restaurantId)
            .single()

          if (restData) {
            setRestaurant(restData)
          }
        }

        // Load Razorpay script
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        document.body.appendChild(script)
      } catch (error) {
        console.error('Error loading checkout:', error)
        setError('Failed to load checkout')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      setError(null)
      setPromoDiscount(0)
      return
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode.toUpperCase())
        .eq('is_active', true)
        .single()

      if (error) {
        setError('Invalid promo code')
        setPromoDiscount(0)
        return
      }

      // Check if code is for LPU students only
      if (data.for_lpu_students_only && !profile?.is_lpu_student) {
        setError('This code is only for LPU students')
        setPromoDiscount(0)
        return
      }

      // Check expiry
      if (data.valid_until && new Date(data.valid_until) < new Date()) {
        setError('Promo code has expired')
        setPromoDiscount(0)
        return
      }

      setPromoDiscount(data.discount_percentage || 0)
      setError(null)
    } catch (err) {
      setError('Error validating promo code')
      setPromoDiscount(0)
    }
  }

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTax = () => {
    return Math.round(getSubtotal() * 0.05 * 100) / 100
  }

  const getDiscount = () => {
    return Math.round(getSubtotal() * (promoDiscount / 100) * 100) / 100
  }

  const getDeliveryFee = () => {
    return restaurant?.delivery_fee || 0
  }

  const getTotal = () => {
    return getSubtotal() + getTax() + getDeliveryFee() - getDiscount()
  }

  const handlePayment = async () => {
    setError(null)

    if (!deliveryAddress.trim()) {
      setError('Please enter delivery address')
      return
    }

    if (!phoneNumber.trim()) {
      setError('Please enter phone number')
      return
    }

    setProcessing(true)

    try {
      // Create order in Supabase first
      const supabase = createClient()

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          restaurant_id: restaurant.id,
          items: cart,
          delivery_address: deliveryAddress,
          total_amount: getTotal(),
          order_status: 'pending_payment',
          payment_status: 'pending',
        })
        .select()
        .single()

      if (orderError) throw orderError

      const orderId = orderData.id

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(getTotal() * 100), // Amount in paise
        currency: 'INR',
        name: 'FoodHub LPU',
        description: `Order #${orderId.slice(0, 8)}`,
        prefill: {
          name: profile?.full_name || '',
          email: user.email,
          contact: phoneNumber,
        },
        handler: async (response: any) => {
          try {
            // Update order with payment details
            await supabase
              .from('orders')
              .update({
                payment_status: 'completed',
                order_status: 'confirmed',
                razorpay_payment_id: response.razorpay_payment_id,
              })
              .eq('id', orderId)

            // Clear cart
            localStorage.removeItem('cart')

            // Redirect to order confirmation
            router.push(`/orders/${orderId}`)
          } catch (err) {
            console.error('Error updating payment:', err)
            setError('Payment recorded but order update failed')
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (err: any) {
      setError(err.message || 'Payment failed')
      setProcessing(false)
    }
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

  if (cart.length === 0) {
    return (
      <div className="p-4 md:p-8 pb-24 md:pb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {/* Delivery Address */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your hostel room number and address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Promo Code */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Promo Code</h2>
            <div className="flex gap-2">
              <Input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter promo code"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={validatePromoCode}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Apply
              </Button>
            </div>
            {promoDiscount > 0 && (
              <p className="text-green-600 text-sm mt-2">
                {promoDiscount}% discount applied!
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 sticky top-32 h-fit">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            {restaurant && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-1">From</p>
                <p className="font-bold text-gray-900">{restaurant.name}</p>
              </div>
            )}

            {/* Items */}
            <div className="space-y-2 mb-6 pb-6 border-b border-gray-200 max-h-48 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="font-semibold text-gray-900">
                    Rs. {item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>Rs. {getSubtotal()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (5%)</span>
                <span>Rs. {getTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery</span>
                <span>Rs. {getDeliveryFee()}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({promoDiscount}%)</span>
                  <span>-Rs. {getDiscount()}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between font-bold text-lg text-gray-900 mb-6 pt-6 border-t border-gray-200">
              <span>Total</span>
              <span>Rs. {getTotal()}</span>
            </div>

            <Button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
            >
              {processing ? <Spinner className="w-4 h-4" /> : null}
              {processing ? 'Processing...' : 'Pay with Razorpay'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
