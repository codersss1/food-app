import { type NextRequest, NextResponse } from 'next/server'

// Next.js 16 proxy function (replaces middleware)
export function proxy(request: NextRequest) {
  // Allow all requests to pass through
  // Auth is handled client-side in the app layout
  return NextResponse.next()
}

// Also export as default for compatibility
export default proxy

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
