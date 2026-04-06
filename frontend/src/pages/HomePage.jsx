import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    minRating: 0,
    maxDeliveryTime: Infinity,
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await restaurantAPI.getAll({
          searchQuery,
          minRating: filters.minRating,
          maxDeliveryTime: filters.maxDeliveryTime === Infinity ? undefined : filters.maxDeliveryTime,
        });
        setRestaurants(response.data.restaurants);
      } catch (err) {
        setError('Failed to load restaurants');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchRestaurants, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filters]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Welcome to Campus Eats</h1>
          <p className="text-lg opacity-90">Order food from your favorite restaurants on campus</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Search restaurants or cuisines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />

          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-text">Min Rating:</label>
              <select
                value={filters.minRating}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, minRating: parseFloat(e.target.value) }))
                }
                className="px-3 py-2 border border-border rounded-lg text-sm"
              >
                <option value="0">All ratings</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="4.5">4.5+</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-text">Delivery Time:</label>
              <select
                value={filters.maxDeliveryTime === Infinity ? '' : filters.maxDeliveryTime}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxDeliveryTime: e.target.value ? parseInt(e.target.value) : Infinity,
                  }))
                }
                className="px-3 py-2 border border-border rounded-lg text-sm"
              >
                <option value="">All times</option>
                <option value="15">Under 15 min</option>
                <option value="30">Under 30 min</option>
                <option value="45">Under 45 min</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-error rounded-lg text-error mb-8">
            {error}
          </div>
        )}

        {restaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-textMuted">No restaurants found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`}>
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-text mb-1">{restaurant.name}</h3>
                    <p className="text-sm text-textMuted mb-3 line-clamp-2">
                      {restaurant.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-text">
                        ⭐ {restaurant.rating} ({restaurant.reviewCount})
                      </span>
                      <span className="text-sm text-textMuted">{restaurant.deliveryTime} min</span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-border text-xs text-textMuted">
                      {restaurant.cuisineType.join(', ')}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
