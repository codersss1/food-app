// Mock Supabase client for demo - uses shared data
import { restaurants } from '@/lib/data'

const STORAGE = { USER: 'foodhub_user', ORDERS: 'foodhub_orders', PROFILE: 'foodhub_profile' }

const getStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback
  try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback } catch { return fallback }
}

const setStorage = <T>(key: string, value: T) => {
  if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(value))
}

function createQueryBuilder(table: string) {
  let filters: { col: string; val: any }[] = []
  let single = false

  const builder = {
    select: () => builder,
    eq: (col: string, val: any) => { filters.push({ col, val }); return builder },
    order: () => builder,
    single: () => { single = true; return builder },
    insert: (data: any) => {
      const item = { ...data, id: Date.now().toString(), created_at: new Date().toISOString() }
      if (table === 'orders') {
        const orders = getStorage<any[]>(STORAGE.ORDERS, [])
        orders.unshift(item)
        setStorage(STORAGE.ORDERS, orders)
      }
      return Promise.resolve({ data: single ? item : [item], error: null })
    },
    update: (data: any) => {
      if (table === 'profiles') setStorage(STORAGE.PROFILE, { ...getStorage(STORAGE.PROFILE, {}), ...data })
      return Promise.resolve({ data: single ? data : [data], error: null })
    },
    then: (resolve: (r: { data: any; error: any }) => void) => {
      let result: any[] = []
      if (table === 'restaurants') result = restaurants
      else if (table === 'orders') result = getStorage<any[]>(STORAGE.ORDERS, []).map(o => ({ ...o, restaurants: restaurants.find(r => r.id === o.restaurant_id) }))
      else if (table === 'profiles') result = [getStorage(STORAGE.PROFILE, null)].filter(Boolean)
      
      for (const f of filters) result = result.filter(item => item[f.col] === f.val)
      resolve({ data: single ? (result[0] || null) : result, error: null })
    }
  }
  return builder
}

const auth = {
  getUser: async () => ({ data: { user: getStorage(STORAGE.USER, null) }, error: null }),
  signInWithPassword: async ({ email }: { email: string }) => { const user = { id: Date.now().toString(), email }; setStorage(STORAGE.USER, user); return { data: { user }, error: null } },
  signUp: async ({ email, options }: any) => { const user = { id: Date.now().toString(), email, ...options?.data }; setStorage(STORAGE.USER, user); return { data: { user }, error: null } },
  signOut: async () => { localStorage.removeItem(STORAGE.USER); return { error: null } }
}

export function createClient() {
  return {
    auth,
    from: createQueryBuilder,
    channel: () => ({ on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }) })
  }
}

export default createClient
