// Real LPU Campus Food Stalls and Restaurants
// Based on actual food outlets at Lovely Professional University, Phagwara

export const restaurants = [
  { 
    id: '1', 
    name: "Domino's Pizza", 
    cuisine: 'Pizza, Italian', 
    rating: 4.1, 
    delivery_time: 30, 
    delivery_fee: 40, 
    min_order: 199, 
    address: 'Uni Mall, LPU Campus', 
    phone: '+91 98765 43210', 
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop', 
    is_active: true 
  },
  { 
    id: '2', 
    name: 'La Pinoz Pizza', 
    cuisine: 'Pizza, Fast Food', 
    rating: 4.3, 
    delivery_time: 25, 
    delivery_fee: 30, 
    min_order: 149, 
    address: 'Uni Mall, LPU Campus', 
    phone: '+91 98765 43211', 
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=400&fit=crop', 
    is_active: true 
  },
  { 
    id: '3', 
    name: 'Cafe Coffee Day', 
    cuisine: 'Cafe, Beverages, Snacks', 
    rating: 4.2, 
    delivery_time: 20, 
    delivery_fee: 25, 
    min_order: 100, 
    address: 'Uni Mall, LPU Campus', 
    phone: '+91 98765 43212', 
    image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=400&fit=crop', 
    is_active: true 
  },
  { 
    id: '4', 
    name: 'Lovely Sweets', 
    cuisine: 'Sweets, North Indian, Snacks', 
    rating: 4.5, 
    delivery_time: 25, 
    delivery_fee: 20, 
    min_order: 100, 
    address: 'Block 34, LPU Campus', 
    phone: '+91 98765 43213', 
    image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&h=400&fit=crop', 
    is_active: true 
  },
  { 
    id: '5', 
    name: 'South Indian Corner', 
    cuisine: 'South Indian, Dosa, Idli', 
    rating: 4.4, 
    delivery_time: 20, 
    delivery_fee: 15, 
    min_order: 80, 
    address: 'Food Court, Block 34', 
    phone: '+91 98765 43214', 
    image_url: 'https://images.unsplash.com/photo-1668236543090-82eb5eaf701b?w=800&h=400&fit=crop', 
    is_active: true 
  },
  { 
    id: '6', 
    name: 'Maggi Point', 
    cuisine: 'Snacks, Fast Food', 
    rating: 4.0, 
    delivery_time: 15, 
    delivery_fee: 10, 
    min_order: 50, 
    address: 'Near Block 32, LPU Campus', 
    phone: '+91 98765 43215', 
    image_url: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800&h=400&fit=crop', 
    is_active: true 
  },
  { 
    id: '7', 
    name: 'Punjabi Dhaba', 
    cuisine: 'North Indian, Punjabi', 
    rating: 4.6, 
    delivery_time: 35, 
    delivery_fee: 25, 
    min_order: 150, 
    address: 'Food Court, LPU Campus', 
    phone: '+91 98765 43216', 
    image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=400&fit=crop', 
    is_active: true 
  },
  { 
    id: '8', 
    name: 'Chinese Wok', 
    cuisine: 'Chinese, Asian, Noodles', 
    rating: 4.2, 
    delivery_time: 30, 
    delivery_fee: 30, 
    min_order: 120, 
    address: 'Food Court, Block 34', 
    phone: '+91 98765 43217', 
    image_url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=400&fit=crop', 
    is_active: true 
  },
]

export const menuItems: Record<string, any[]> = {
  '1': [ // Domino's Pizza
    { id: 'm1', name: 'Margherita Pizza', category: 'Pizza', price: 199, description: 'Classic cheese and tomato pizza', is_available: true },
    { id: 'm2', name: 'Peppy Paneer', category: 'Pizza', price: 349, description: 'Paneer with peppy peppers', is_available: true },
    { id: 'm3', name: 'Farmhouse Pizza', category: 'Pizza', price: 399, description: 'Loaded with veggies', is_available: true },
    { id: 'm4', name: 'Garlic Breadsticks', category: 'Sides', price: 99, description: 'Crispy garlic bread', is_available: true },
    { id: 'm5', name: 'Choco Lava Cake', category: 'Desserts', price: 109, description: 'Warm chocolate cake', is_available: true },
  ],
  '2': [ // La Pinoz Pizza
    { id: 'm6', name: 'Cheese Burst Pizza', category: 'Pizza', price: 249, description: 'Extra cheese loaded pizza', is_available: true },
    { id: 'm7', name: 'Paneer Tikka Pizza', category: 'Pizza', price: 299, description: 'Tandoori paneer toppings', is_available: true },
    { id: 'm8', name: 'Pasta Alfredo', category: 'Pasta', price: 179, description: 'Creamy white sauce pasta', is_available: true },
    { id: 'm9', name: 'Garlic Bread', category: 'Sides', price: 79, description: 'Cheesy garlic bread', is_available: true },
  ],
  '3': [ // Cafe Coffee Day
    { id: 'm10', name: 'Cappuccino', category: 'Coffee', price: 159, description: 'Classic Italian coffee', is_available: true },
    { id: 'm11', name: 'Cold Coffee', category: 'Coffee', price: 179, description: 'Chilled coffee with ice cream', is_available: true },
    { id: 'm12', name: 'Veg Sandwich', category: 'Snacks', price: 149, description: 'Grilled vegetable sandwich', is_available: true },
    { id: 'm13', name: 'Chocolate Brownie', category: 'Desserts', price: 129, description: 'Rich chocolate brownie', is_available: true },
    { id: 'm14', name: 'Frappe', category: 'Coffee', price: 199, description: 'Blended iced coffee', is_available: true },
  ],
  '4': [ // Lovely Sweets
    { id: 'm15', name: 'Gulab Jamun', category: 'Sweets', price: 40, description: '2 pieces of soft gulab jamun', is_available: true },
    { id: 'm16', name: 'Rasgulla', category: 'Sweets', price: 35, description: 'Soft cottage cheese balls', is_available: true },
    { id: 'm17', name: 'Samosa', category: 'Snacks', price: 25, description: 'Crispy potato samosa', is_available: true },
    { id: 'm18', name: 'Chole Bhature', category: 'Main Course', price: 89, description: 'Spicy chickpeas with fried bread', is_available: true },
    { id: 'm19', name: 'Lassi', category: 'Beverages', price: 49, description: 'Sweet Punjabi lassi', is_available: true },
  ],
  '5': [ // South Indian Corner
    { id: 'm20', name: 'Masala Dosa', category: 'Dosa', price: 79, description: 'Crispy dosa with potato filling', is_available: true },
    { id: 'm21', name: 'Plain Dosa', category: 'Dosa', price: 59, description: 'Crispy plain dosa', is_available: true },
    { id: 'm22', name: 'Idli Sambar', category: 'Breakfast', price: 49, description: '2 idlis with sambar & chutney', is_available: true },
    { id: 'm23', name: 'Vada', category: 'Snacks', price: 39, description: 'Crispy medu vada', is_available: true },
    { id: 'm24', name: 'Filter Coffee', category: 'Beverages', price: 29, description: 'Authentic South Indian coffee', is_available: true },
  ],
  '6': [ // Maggi Point
    { id: 'm25', name: 'Classic Maggi', category: 'Maggi', price: 40, description: '2-minute noodles', is_available: true },
    { id: 'm26', name: 'Cheese Maggi', category: 'Maggi', price: 60, description: 'Maggi with extra cheese', is_available: true },
    { id: 'm27', name: 'Egg Maggi', category: 'Maggi', price: 55, description: 'Maggi with scrambled egg', is_available: true },
    { id: 'm28', name: 'Veggie Maggi', category: 'Maggi', price: 50, description: 'Maggi loaded with vegetables', is_available: true },
    { id: 'm29', name: 'Masala Chai', category: 'Beverages', price: 15, description: 'Hot Indian tea', is_available: true },
  ],
  '7': [ // Punjabi Dhaba
    { id: 'm30', name: 'Dal Makhani', category: 'Main Course', price: 149, description: 'Creamy black lentils', is_available: true },
    { id: 'm31', name: 'Paneer Butter Masala', category: 'Main Course', price: 179, description: 'Cottage cheese in tomato gravy', is_available: true },
    { id: 'm32', name: 'Butter Naan', category: 'Breads', price: 35, description: 'Soft buttered naan', is_available: true },
    { id: 'm33', name: 'Jeera Rice', category: 'Rice', price: 89, description: 'Cumin flavored rice', is_available: true },
    { id: 'm34', name: 'Rajma Chawal', category: 'Combos', price: 99, description: 'Kidney beans with rice', is_available: true },
  ],
  '8': [ // Chinese Wok
    { id: 'm35', name: 'Veg Fried Rice', category: 'Rice', price: 99, description: 'Vegetable fried rice', is_available: true },
    { id: 'm36', name: 'Hakka Noodles', category: 'Noodles', price: 89, description: 'Stir-fried noodles', is_available: true },
    { id: 'm37', name: 'Manchurian', category: 'Starters', price: 129, description: 'Crispy veg manchurian', is_available: true },
    { id: 'm38', name: 'Spring Roll', category: 'Starters', price: 79, description: 'Crispy vegetable rolls', is_available: true },
    { id: 'm39', name: 'Chilli Paneer', category: 'Starters', price: 149, description: 'Spicy paneer Indo-Chinese style', is_available: true },
  ],
}

export function getRestaurant(id: string) {
  return restaurants.find(r => r.id === id) || null
}

export function getMenuItems(restaurantId: string) {
  return menuItems[restaurantId] || []
}
