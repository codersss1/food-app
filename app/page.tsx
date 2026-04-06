'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Utensils } from 'lucide-react';

export default function HomePage() {

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-orange-600 text-white rounded-full p-2">
              <Utensils className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">FoodHub</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/login">
              <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Hungry? We&apos;ve Got You Covered
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Order from your favorite restaurants and enjoy delicious meals delivered to your hostel in minutes. Fast, fresh, and absolutely delicious.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-6">
                Order Now
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-gray-300 text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Get your order delivered in 30 minutes or less. We guarantee freshness and speed.
            </p>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Safe & Secure</h3>
            <p className="text-gray-600">
              Your payment information is encrypted and protected. Shop with confidence.
            </p>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">500+ Restaurants</h3>
            <p className="text-gray-600">
              Choose from hundreds of verified restaurants delivering to your location.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-orange-600 text-white rounded-lg p-12 text-center mt-20">
          <h3 className="text-3xl font-bold mb-4">Ready to Order?</h3>
          <p className="text-orange-100 mb-6 text-lg">
            Sign up today and get 20% off your first order
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 text-lg px-8 py-6">
              Sign Up for Free
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
