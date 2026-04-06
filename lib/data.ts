// Shared sample data for the demo app
// All data is stored in one place to reduce memory usage

export const restaurants = [
  { id: '1', name: 'Pizza Paradise', cuisine: 'Italian, Pizza', rating: 4.5, delivery_time: 30, delivery_fee: 40, min_order: 200, address: 'Block 34, LPU Campus', phone: '+91 98765 43210', image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop', is_active: true },
  { id: '2', name: 'Burger Barn', cuisine: 'American, Burgers', rating: 4.3, delivery_time: 25, delivery_fee: 30, min_order: 150, address: 'Block 32, LPU Campus', phone: '+91 98765 43211', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop', is_active: true },
  { id: '3', name: 'Dragon Wok', cuisine: 'Chinese, Asian', rating: 4.4, delivery_time: 35, delivery_fee: 35, min_order: 250, address: 'Block 28, LPU Campus', phone: '+91 98765 43212', image_url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=400&fit=crop', is_active: true },
  { id: '4', name: 'Spice Garden', cuisine: 'North Indian', rating: 4.6, delivery_time: 40, delivery_fee: 25, min_order: 200, address: 'Block 36, LPU Campus', phone: '+91 98765 43213', image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=400&fit=crop', is_active: true },
  { id: '5', name: 'Dosa Corner', cuisine: 'South Indian', rating: 4.7, delivery_time: 25, delivery_fee: 20, min_order: 100, address: 'Block 30, LPU Campus', phone: '+91 98765 43214', image_url: 'https://images.unsplash.com/photo-1668236543090-82eb5eaf701b?w=800&h=400&fit=crop', is_active: true },
  { id: '6', name: 'Cafe Mocha', cuisine: 'Cafe, Snacks', rating: 4.2, delivery_time: 20, delivery_fee: 15, min_order: 100, address: 'Block 25, LPU Campus', phone: '+91 98765 43215', image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=400&fit=crop', is_active: true },
]

export const menuItems: Record<string, any[]> = {
  '1': [
    { id: 'm1', name: 'Margherita Pizza', category: 'Pizza', price: 299, description: 'Classic tomato and mozzarella', is_available: true },
    { id: 'm2', name: 'Pepperoni Pizza', category: 'Pizza', price: 399, description: 'Loaded with spicy pepperoni', is_available: true },
    { id: 'm3', name: 'Garlic Bread', category: 'Sides', price: 149, description: 'Crispy garlic bread with herbs', is_available: true },
    { id: 'm4', name: 'Pasta Alfredo', category: 'Pasta', price: 279, description: 'Creamy white sauce pasta', is_available: true },
  ],
  '2': [
    { id: 'm6', name: 'Classic Burger', category: 'Burgers', price: 199, description: 'Beef patty with fresh veggies', is_available: true },
    { id: 'm7', name: 'Cheese Burger', category: 'Burgers', price: 249, description: 'Double cheese loaded burger', is_available: true },
    { id: 'm8', name: 'French Fries', category: 'Sides', price: 99, description: 'Crispy golden fries', is_available: true },
  ],
  '3': [
    { id: 'm11', name: 'Fried Rice', category: 'Rice', price: 179, description: 'Vegetable fried rice', is_available: true },
    { id: 'm12', name: 'Manchurian', category: 'Starters', price: 199, description: 'Crispy veg manchurian', is_available: true },
    { id: 'm13', name: 'Hakka Noodles', category: 'Noodles', price: 169, description: 'Spicy hakka noodles', is_available: true },
  ],
  '4': [
    { id: 'm16', name: 'Butter Chicken', category: 'Main Course', price: 349, description: 'Creamy tomato chicken curry', is_available: true },
    { id: 'm17', name: 'Dal Makhani', category: 'Main Course', price: 249, description: 'Creamy black lentils', is_available: true },
    { id: 'm18', name: 'Butter Naan', category: 'Breads', price: 49, description: 'Soft butter naan', is_available: true },
  ],
  '5': [
    { id: 'm21', name: 'Masala Dosa', category: 'Dosa', price: 99, description: 'Crispy dosa with potato filling', is_available: true },
    { id: 'm22', name: 'Idli Sambar', category: 'Breakfast', price: 79, description: 'Soft idlis with sambar', is_available: true },
    { id: 'm23', name: 'Filter Coffee', category: 'Beverages', price: 39, description: 'Traditional South Indian coffee', is_available: true },
  ],
  '6': [
    { id: 'm26', name: 'Cappuccino', category: 'Coffee', price: 149, description: 'Rich espresso with foam', is_available: true },
    { id: 'm27', name: 'Sandwich', category: 'Snacks', price: 129, description: 'Grilled vegetable sandwich', is_available: true },
    { id: 'm28', name: 'Brownie', category: 'Desserts', price: 99, description: 'Warm chocolate brownie', is_available: true },
  ],
}

export function getRestaurant(id: string) {
  return restaurants.find(r => r.id === id) || null
}

export function getMenuItems(restaurantId: string) {
  return menuItems[restaurantId] || []
}
