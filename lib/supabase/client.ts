// Mock Supabase client for demo purposes
// This simulates Supabase functionality using localStorage

const STORAGE_KEYS = {
  USER: 'foodhub_user',
  PROFILE: 'foodhub_profile',
  ORDERS: 'foodhub_orders',
  RESTAURANTS: 'foodhub_restaurants',
  MENU_ITEMS: 'foodhub_menu_items',
}

// Sample restaurants data
const sampleRestaurants = [
  {
    id: '1',
    name: 'Pizza Paradise',
    cuisine: 'Italian, Pizza',
    rating: 4.5,
    delivery_time: 30,
    delivery_fee: 40,
    min_order: 200,
    address: 'Block 34, LPU Campus',
    phone: '+91 98765 43210',
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    is_active: true,
  },
  {
    id: '2',
    name: 'Burger Barn',
    cuisine: 'American, Burgers',
    rating: 4.3,
    delivery_time: 25,
    delivery_fee: 30,
    min_order: 150,
    address: 'Block 32, LPU Campus',
    phone: '+91 98765 43211',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    is_active: true,
  },
  {
    id: '3',
    name: 'Dragon Wok',
    cuisine: 'Chinese, Asian',
    rating: 4.4,
    delivery_time: 35,
    delivery_fee: 35,
    min_order: 250,
    address: 'Block 28, LPU Campus',
    phone: '+91 98765 43212',
    image_url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop',
    is_active: true,
  },
  {
    id: '4',
    name: 'Spice Garden',
    cuisine: 'North Indian',
    rating: 4.6,
    delivery_time: 40,
    delivery_fee: 25,
    min_order: 200,
    address: 'Block 36, LPU Campus',
    phone: '+91 98765 43213',
    image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    is_active: true,
  },
  {
    id: '5',
    name: 'Dosa Corner',
    cuisine: 'South Indian',
    rating: 4.7,
    delivery_time: 25,
    delivery_fee: 20,
    min_order: 100,
    address: 'Block 30, LPU Campus',
    phone: '+91 98765 43214',
    image_url: 'https://images.unsplash.com/photo-1668236543090-82eb5eaf701b?w=400&h=300&fit=crop',
    is_active: true,
  },
  {
    id: '6',
    name: 'Cafe Mocha',
    cuisine: 'Cafe, Snacks',
    rating: 4.2,
    delivery_time: 20,
    delivery_fee: 15,
    min_order: 100,
    address: 'Block 25, LPU Campus',
    phone: '+91 98765 43215',
    image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
    is_active: true,
  },
]

// Sample menu items
const sampleMenuItems: Record<string, any[]> = {
  '1': [
    { id: 'm1', restaurant_id: '1', name: 'Margherita Pizza', category: 'Pizza', price: 299, description: 'Classic tomato and mozzarella', is_available: true, image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop' },
    { id: 'm2', restaurant_id: '1', name: 'Pepperoni Pizza', category: 'Pizza', price: 399, description: 'Loaded with spicy pepperoni', is_available: true, image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&h=200&fit=crop' },
    { id: 'm3', restaurant_id: '1', name: 'Garlic Bread', category: 'Sides', price: 149, description: 'Crispy garlic bread with herbs', is_available: true },
    { id: 'm4', restaurant_id: '1', name: 'Pasta Alfredo', category: 'Pasta', price: 279, description: 'Creamy white sauce pasta', is_available: true },
    { id: 'm5', restaurant_id: '1', name: 'Cold Coffee', category: 'Beverages', price: 99, description: 'Chilled coffee with ice cream', is_available: true },
  ],
  '2': [
    { id: 'm6', restaurant_id: '2', name: 'Classic Burger', category: 'Burgers', price: 199, description: 'Beef patty with fresh veggies', is_available: true, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
    { id: 'm7', restaurant_id: '2', name: 'Cheese Burger', category: 'Burgers', price: 249, description: 'Double cheese loaded burger', is_available: true },
    { id: 'm8', restaurant_id: '2', name: 'French Fries', category: 'Sides', price: 99, description: 'Crispy golden fries', is_available: true },
    { id: 'm9', restaurant_id: '2', name: 'Chicken Wings', category: 'Sides', price: 199, description: 'Spicy chicken wings', is_available: true },
    { id: 'm10', restaurant_id: '2', name: 'Milkshake', category: 'Beverages', price: 129, description: 'Creamy vanilla milkshake', is_available: true },
  ],
  '3': [
    { id: 'm11', restaurant_id: '3', name: 'Fried Rice', category: 'Rice', price: 179, description: 'Vegetable fried rice', is_available: true, image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200&h=200&fit=crop' },
    { id: 'm12', restaurant_id: '3', name: 'Manchurian', category: 'Starters', price: 199, description: 'Crispy veg manchurian', is_available: true },
    { id: 'm13', restaurant_id: '3', name: 'Hakka Noodles', category: 'Noodles', price: 169, description: 'Spicy hakka noodles', is_available: true },
    { id: 'm14', restaurant_id: '3', name: 'Spring Rolls', category: 'Starters', price: 149, description: 'Crispy vegetable spring rolls', is_available: true },
    { id: 'm15', restaurant_id: '3', name: 'Sweet Corn Soup', category: 'Soups', price: 99, description: 'Hot and sweet corn soup', is_available: true },
  ],
  '4': [
    { id: 'm16', restaurant_id: '4', name: 'Butter Chicken', category: 'Main Course', price: 349, description: 'Creamy tomato chicken curry', is_available: true, image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&h=200&fit=crop' },
    { id: 'm17', restaurant_id: '4', name: 'Dal Makhani', category: 'Main Course', price: 249, description: 'Creamy black lentils', is_available: true },
    { id: 'm18', restaurant_id: '4', name: 'Butter Naan', category: 'Breads', price: 49, description: 'Soft butter naan', is_available: true },
    { id: 'm19', restaurant_id: '4', name: 'Biryani', category: 'Rice', price: 299, description: 'Aromatic chicken biryani', is_available: true },
    { id: 'm20', restaurant_id: '4', name: 'Lassi', category: 'Beverages', price: 79, description: 'Sweet yogurt drink', is_available: true },
  ],
  '5': [
    { id: 'm21', restaurant_id: '5', name: 'Masala Dosa', category: 'Dosa', price: 99, description: 'Crispy dosa with potato filling', is_available: true, image_url: 'https://images.unsplash.com/photo-1668236543090-82eb5eaf701b?w=200&h=200&fit=crop' },
    { id: 'm22', restaurant_id: '5', name: 'Idli Sambar', category: 'Breakfast', price: 79, description: 'Soft idlis with sambar', is_available: true },
    { id: 'm23', restaurant_id: '5', name: 'Vada', category: 'Snacks', price: 49, description: 'Crispy medu vada', is_available: true },
    { id: 'm24', restaurant_id: '5', name: 'Uttapam', category: 'Dosa', price: 89, description: 'Thick pancake with toppings', is_available: true },
    { id: 'm25', restaurant_id: '5', name: 'Filter Coffee', category: 'Beverages', price: 39, description: 'Traditional South Indian coffee', is_available: true },
  ],
  '6': [
    { id: 'm26', restaurant_id: '6', name: 'Cappuccino', category: 'Coffee', price: 149, description: 'Rich espresso with foam', is_available: true },
    { id: 'm27', restaurant_id: '6', name: 'Sandwich', category: 'Snacks', price: 129, description: 'Grilled vegetable sandwich', is_available: true },
    { id: 'm28', restaurant_id: '6', name: 'Brownie', category: 'Desserts', price: 99, description: 'Warm chocolate brownie', is_available: true },
    { id: 'm29', restaurant_id: '6', name: 'Pasta', category: 'Main', price: 199, description: 'Creamy pasta with garlic bread', is_available: true },
    { id: 'm30', restaurant_id: '6', name: 'Smoothie', category: 'Beverages', price: 129, description: 'Mixed berry smoothie', is_available: true },
  ],
}

// Sample hostels
const sampleHostels = [
  { id: 'h1', name: 'Block 34 - Boys Hostel', is_active: true },
  { id: 'h2', name: 'Block 35 - Boys Hostel', is_active: true },
  { id: 'h3', name: 'Block 36 - Girls Hostel', is_active: true },
  { id: 'h4', name: 'Block 37 - Girls Hostel', is_active: true },
  { id: 'h5', name: 'Block 38 - International Hostel', is_active: true },
]

// Helper to get from localStorage
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

// Helper to save to localStorage
function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Mock query builder
class MockQueryBuilder {
  private table: string
  private filters: Array<{ column: string; op: string; value: any }> = []
  private orderColumn: string | null = null
  private orderAsc = true
  private isSingle = false
  private selectColumns = '*'
  private insertData: any = null
  private updateData: any = null

  constructor(table: string) {
    this.table = table
  }

  select(columns: string = '*') {
    this.selectColumns = columns
    return this
  }

  eq(column: string, value: any) {
    this.filters.push({ column, op: 'eq', value })
    return this
  }

  order(column: string, { ascending = true }: { ascending?: boolean } = {}) {
    this.orderColumn = column
    this.orderAsc = ascending
    return this
  }

  single() {
    this.isSingle = true
    return this
  }

  insert(data: any) {
    this.insertData = data
    return this
  }

  update(data: any) {
    this.updateData = data
    return this
  }

  private getData(): any[] {
    switch (this.table) {
      case 'restaurants':
        return sampleRestaurants
      case 'menu_items': {
        const restaurantFilter = this.filters.find(f => f.column === 'restaurant_id')
        if (restaurantFilter) {
          return sampleMenuItems[restaurantFilter.value] || []
        }
        return Object.values(sampleMenuItems).flat()
      }
      case 'hostels':
        return sampleHostels
      case 'profiles':
        return [getFromStorage(STORAGE_KEYS.PROFILE, null)].filter(Boolean)
      case 'orders':
        return getFromStorage(STORAGE_KEYS.ORDERS, [])
      case 'promo_codes':
        return [
          { id: 'p1', code: 'WELCOME20', discount_percentage: 20, is_active: true, for_lpu_students_only: false },
          { id: 'p2', code: 'LPU10', discount_percentage: 10, is_active: true, for_lpu_students_only: true },
        ]
      default:
        return []
    }
  }

  async then(resolve: (result: { data: any; error: any }) => void) {
    try {
      // Handle insert
      if (this.insertData) {
        const newItem = {
          ...this.insertData,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          created_at: new Date().toISOString(),
        }
        
        if (this.table === 'orders') {
          const orders = getFromStorage<any[]>(STORAGE_KEYS.ORDERS, [])
          orders.unshift(newItem)
          saveToStorage(STORAGE_KEYS.ORDERS, orders)
        } else if (this.table === 'profiles') {
          saveToStorage(STORAGE_KEYS.PROFILE, newItem)
        }
        
        resolve({ data: this.isSingle ? newItem : [newItem], error: null })
        return
      }

      // Handle update
      if (this.updateData) {
        if (this.table === 'orders') {
          const orders = getFromStorage<any[]>(STORAGE_KEYS.ORDERS, [])
          const idFilter = this.filters.find(f => f.column === 'id')
          if (idFilter) {
            const index = orders.findIndex(o => o.id === idFilter.value)
            if (index !== -1) {
              orders[index] = { ...orders[index], ...this.updateData }
              saveToStorage(STORAGE_KEYS.ORDERS, orders)
              resolve({ data: this.isSingle ? orders[index] : [orders[index]], error: null })
              return
            }
          }
        } else if (this.table === 'profiles') {
          const profile = getFromStorage(STORAGE_KEYS.PROFILE, {})
          const updated = { ...profile, ...this.updateData }
          saveToStorage(STORAGE_KEYS.PROFILE, updated)
          resolve({ data: this.isSingle ? updated : [updated], error: null })
          return
        }
      }

      // Handle select
      let data = this.getData()

      // Apply filters
      for (const filter of this.filters) {
        if (filter.op === 'eq') {
          data = data.filter(item => item[filter.column] === filter.value)
        }
      }

      // Apply ordering
      if (this.orderColumn) {
        data.sort((a, b) => {
          const aVal = a[this.orderColumn!]
          const bVal = b[this.orderColumn!]
          if (this.orderAsc) {
            return aVal > bVal ? 1 : -1
          }
          return aVal < bVal ? 1 : -1
        })
      }

      // Handle joins for orders
      if (this.table === 'orders' && this.selectColumns.includes('restaurants')) {
        data = data.map(order => {
          const restaurant = sampleRestaurants.find(r => r.id === order.restaurant_id)
          return { ...order, restaurants: restaurant }
        })
      }

      resolve({
        data: this.isSingle ? (data[0] || null) : data,
        error: data.length === 0 && this.isSingle ? { message: 'No data found' } : null,
      })
    } catch (error) {
      resolve({ data: null, error })
    }
  }
}

// Mock auth
const mockAuth = {
  getUser: async () => {
    const user = getFromStorage(STORAGE_KEYS.USER, null)
    return { data: { user }, error: null }
  },
  signUp: async ({ email, password, options }: any) => {
    const user = {
      id: `user-${Date.now()}`,
      email,
      ...options?.data,
    }
    saveToStorage(STORAGE_KEYS.USER, user)
    saveToStorage(STORAGE_KEYS.PROFILE, {
      id: user.id,
      email,
      full_name: options?.data?.full_name || '',
      phone: options?.data?.phone || '',
      created_at: new Date().toISOString(),
    })
    return { data: { user }, error: null }
  },
  signInWithPassword: async ({ email, password }: any) => {
    const user = {
      id: `user-${Date.now()}`,
      email,
    }
    saveToStorage(STORAGE_KEYS.USER, user)
    return { data: { user }, error: null }
  },
  signOut: async () => {
    localStorage.removeItem(STORAGE_KEYS.USER)
    return { error: null }
  },
}

// Create mock Supabase client
export function createClient() {
  return {
    auth: mockAuth,
    from: (table: string) => new MockQueryBuilder(table),
    channel: (name: string) => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
      subscribe: () => ({ unsubscribe: () => {} }),
    }),
  }
}

export default createClient
