// Database helper functions
// Using mock Supabase client for demo purposes

import { createClient } from '@/lib/supabase/client'

// Restaurant queries
export async function getRestaurants() {
  const supabase = createClient()
  const result = await supabase
    .from('restaurants')
    .select('*')
    .eq('is_active', true)
    .order('rating', { ascending: false })
  
  return result.data || []
}

export async function getRestaurantById(id: string) {
  const supabase = createClient()
  const result = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single()
  
  return result.data
}

// Menu items queries
export async function getMenuItems(restaurantId: string) {
  const supabase = createClient()
  const result = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('is_available', true)
    .order('category', { ascending: true })
  
  return result.data || []
}

// Order queries
export async function createOrder(
  userId: string,
  restaurantId: string,
  items: any[],
  deliveryAddress: string,
  totalAmount: number
) {
  const supabase = createClient()
  
  const result = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      restaurant_id: restaurantId,
      items: items,
      delivery_address: deliveryAddress,
      total_amount: totalAmount,
      order_status: 'pending_payment',
      payment_status: 'pending'
    })
    .select()
    .single()
  
  return result.data
}

export async function getUserOrders(userId: string) {
  const supabase = createClient()
  const result = await supabase
    .from('orders')
    .select('*, restaurants(name, image_url)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return result.data || []
}

export async function getOrderById(orderId: string) {
  const supabase = createClient()
  const result = await supabase
    .from('orders')
    .select('*, restaurants(name, image_url, phone)')
    .eq('id', orderId)
    .single()
  
  return result.data
}

// Hostel queries
export async function getHostels() {
  const supabase = createClient()
  const result = await supabase
    .from('hostels')
    .select('*')
    .eq('is_active', true)
  
  return result.data || []
}

// User profile queries
export async function getUserProfile(userId: string) {
  const supabase = createClient()
  const result = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  return result.data
}

export async function updateUserProfile(userId: string, updates: any) {
  const supabase = createClient()
  const result = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()
  
  return result.data
}
