import { createClient } from '@/lib/supabase/server'

// Restaurant queries
export async function getRestaurants() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('is_active', true)
    .order('rating', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getRestaurantById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

// Menu items queries
export async function getMenuItems(restaurantId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('is_available', true)
    .order('category', { ascending: true })
  
  if (error) throw error
  return data
}

export async function getMenuItemsByCategory(restaurantId: string, category: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('category', category)
    .eq('is_available', true)
  
  if (error) throw error
  return data
}

// Promo codes queries
export async function validatePromoCode(code: string, userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single()
  
  if (error) return { valid: false, error: 'Invalid promo code' }
  
  // Check if code is for LPU students
  if (data.for_lpu_students_only) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_lpu_student')
      .eq('id', userId)
      .single()
    
    if (!profile?.is_lpu_student) {
      return { valid: false, error: 'This code is only for LPU students' }
    }
  }
  
  // Check expiry
  if (data.valid_until && new Date(data.valid_until) < new Date()) {
    return { valid: false, error: 'Promo code has expired' }
  }
  
  return { valid: true, data }
}

// Order queries
export async function createOrder(
  userId: string,
  restaurantId: string,
  items: any[],
  deliveryAddress: string,
  totalAmount: number,
  promoCodeId?: string
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      restaurant_id: restaurantId,
      items: items,
      delivery_address: deliveryAddress,
      total_amount: totalAmount,
      promo_code_id: promoCodeId,
      order_status: 'pending_payment',
      payment_status: 'pending'
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getUserOrders(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, restaurants(name, image_url), promo_codes(discount_percentage)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getOrderById(orderId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, restaurants(name, image_url, phone), order_tracking(*)')
    .eq('id', orderId)
    .single()
  
  if (error) throw error
  return data
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  status: 'pending_payment' | 'confirmed' | 'preparing' | 'ready' | 'on_the_way' | 'delivered' | 'cancelled'
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .update({ order_status: status, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Payment update
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: 'pending' | 'completed' | 'failed',
  paymentId?: string
) {
  const supabase = await createClient()
  const updateData: any = { payment_status: paymentStatus }
  if (paymentId) updateData.razorpay_payment_id = paymentId
  
  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Hostel queries
export async function getHostels() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('hostels')
    .select('*')
    .eq('is_active', true)
  
  if (error) throw error
  return data
}

// User profile queries
export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export async function updateUserProfile(userId: string, updates: any) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}
