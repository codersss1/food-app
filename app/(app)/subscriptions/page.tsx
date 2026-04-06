'use client'

import { useState } from 'react'
import { Check, Crown, Zap, Star, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Basic access to order food',
    features: [
      'Order from all restaurants',
      'Standard delivery',
      'Basic order tracking',
      'Email support',
    ],
    highlighted: false,
    icon: Star,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 99,
    period: 'month',
    description: 'Best for regular food lovers',
    features: [
      'Everything in Free',
      'Free delivery on orders above Rs. 199',
      'Priority order processing',
      'Exclusive discounts (up to 20%)',
      'Access to cooking videos',
      'Voice chat support',
      'Early access to new restaurants',
    ],
    highlighted: true,
    icon: Crown,
    badge: 'Most Popular',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 249,
    period: 'month',
    description: 'For food enthusiasts',
    features: [
      'Everything in Premium',
      'Free delivery on all orders',
      'Personal food concierge',
      'Unlimited cooking video access',
      'Priority voice chat',
      'Exclusive chef meetups',
      'Custom meal planning',
      'VIP restaurant access',
    ],
    highlighted: false,
    icon: Zap,
  },
]

export default function SubscriptionsPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [currentPlan, setCurrentPlan] = useState('free')

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId)
    // Simulate subscription
    setTimeout(() => {
      setCurrentPlan(planId)
      setSelectedPlan(null)
      localStorage.setItem('subscription', planId)
      alert(`Successfully subscribed to ${plans.find(p => p.id === planId)?.name} plan!`)
    }, 1500)
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-4">
          <Gift className="w-4 h-4" />
          <span className="text-sm font-medium">Save up to 40% with annual plans</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Choose Your Plan
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          Unlock premium features, free delivery, and exclusive content with our subscription plans
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon
          const isCurrentPlan = currentPlan === plan.id
          const isLoading = selectedPlan === plan.id

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 p-6 transition-all ${
                plan.highlighted
                  ? 'border-orange-500 shadow-xl scale-105'
                  : 'border-gray-200 hover:border-orange-300 hover:shadow-lg'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`inline-flex p-3 rounded-xl mb-4 ${
                  plan.highlighted ? 'bg-orange-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${plan.highlighted ? 'text-orange-600' : 'text-gray-600'}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              </div>

              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price === 0 ? 'Free' : `Rs. ${plan.price}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-gray-500">/{plan.period}</span>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className={`mt-0.5 rounded-full p-0.5 ${
                      plan.highlighted ? 'bg-orange-100' : 'bg-gray-100'
                    }`}>
                      <Check className={`w-3 h-3 ${
                        plan.highlighted ? 'text-orange-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCurrentPlan || isLoading}
                className={`w-full ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                    : isCurrentPlan
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : isCurrentPlan ? (
                  'Current Plan'
                ) : (
                  `Get ${plan.name}`
                )}
              </Button>
            </div>
          )
        })}
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-900">Can I cancel anytime?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Yes, you can cancel your subscription anytime. You will continue to have access until the end of your billing period.
            </p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-900">How does free delivery work?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Premium members get free delivery on orders above Rs. 199, while Pro members get free delivery on all orders.
            </p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-900">What are cooking videos?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Exclusive video content showing how your favorite dishes are made, with tips from campus restaurant chefs.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
