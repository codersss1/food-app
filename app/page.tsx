'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Star, ChefHat } from 'lucide-react';
import { restaurants } from '@/lib/data';

export default function LandingPage() {
  // Show top 4 restaurants on landing page
  const featuredRestaurants = restaurants.slice(0, 4);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-orange-600 text-white rounded-lg p-1.5">
              <ChefHat className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-foreground">LPU Eats</span>
          </div>
          <div className="flex gap-2">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orange-50 to-background">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Food delivery for LPU Campus
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Order from Domino&apos;s, CCD, Lovely Sweets & more. Delivered to your hostel in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto">
                  Start Ordering
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  I have an account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-orange-600">8+</div>
              <div className="text-sm text-muted-foreground">Restaurants</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-orange-600">15 min</div>
              <div className="text-sm text-muted-foreground">Avg. Delivery</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Popular on Campus</h2>
          <Link href="/auth/login" className="text-orange-600 hover:underline text-sm font-medium">
            View all
          </Link>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredRestaurants.map((restaurant) => (
            <Link href="/auth/login" key={restaurant.id}>
              <div className="bg-card rounded-lg border overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="h-32 bg-muted overflow-hidden">
                  <img
                    src={restaurant.image_url}
                    alt={restaurant.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-foreground truncate">{restaurant.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{restaurant.cuisine}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
                      {restaurant.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {restaurant.delivery_time} min
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-muted/30 border-y">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">1</div>
              <h3 className="font-semibold text-foreground mb-1">Choose Restaurant</h3>
              <p className="text-sm text-muted-foreground">Browse from campus favorites like Domino&apos;s, CCD & more</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">2</div>
              <h3 className="font-semibold text-foreground mb-1">Place Order</h3>
              <p className="text-sm text-muted-foreground">Add items to cart and checkout with your hostel address</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">3</div>
              <h3 className="font-semibold text-foreground mb-1">Get Delivery</h3>
              <p className="text-sm text-muted-foreground">Receive your food at your hostel in minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-orange-600 text-white rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to order?</h2>
          <p className="text-orange-100 mb-6">Join thousands of LPU students ordering food daily</p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-foreground">LPU Eats</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Lovely Professional University, Phagwara, Punjab</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
