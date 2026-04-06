import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const response = await restaurantAPI.getById(id);
        const { restaurant: rest, categories: cats } = response.data;
        setRestaurant(rest);
        setCategories(cats);
        if (cats.length > 0) {
          setSelectedCategory(cats[0].id);
        }
      } catch (err) {
        setError('Failed to load restaurant');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleAddToCart = (item) => {
    addItem(item, restaurant);
    alert(`${item.name} added to cart!`);
  };

  if (loading) return <LoadingSpinner />;

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-error mb-4">{error || 'Restaurant not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentCategory = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Restaurant Header */}
      <div className="bg-white shadow-md">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-64 object-cover"
        />
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-text mb-2">{restaurant.name}</h1>
          <p className="text-textMuted mb-4">{restaurant.description}</p>
          <div className="flex gap-4 flex-wrap text-sm">
            <span className="flex items-center gap-1">⭐ {restaurant.rating}</span>
            <span className="flex items-center gap-1">🚚 {restaurant.deliveryTime} min</span>
            <span className="flex items-center gap-1">💰 ₹{restaurant.deliveryFee} delivery</span>
            <span className="flex items-center gap-1">🍽️ {restaurant.cuisineType.join(', ')}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-text border border-border hover:border-primary'
                }`}
              >
                {category.name} ({category.items?.length || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        {currentCategory && (
          <div>
            <h2 className="text-2xl font-bold text-text mb-6">{currentCategory.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCategory.items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-text mb-1">{item.name}</h3>
                    <p className="text-sm text-textMuted mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">₹{item.price}</span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 text-sm font-medium"
                      >
                        Add
                      </button>
                    </div>
                    {(item.isVegetarian || item.isVegan) && (
                      <div className="mt-2 text-xs">
                        {item.isVegan && <span className="bg-green-100 text-green-700 px-2 py-1 rounded mr-1">Vegan</span>}
                        {item.isVegetarian && !item.isVegan && (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Vegetarian</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
