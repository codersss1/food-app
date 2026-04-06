// Server-side Supabase client mock
// Re-exports the client-side mock for consistency

import { createClient as createClientImpl } from './client'

export async function createClient() {
  return createClientImpl()
}

export default createClient
