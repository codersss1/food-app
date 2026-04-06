import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow all requests to pass through
  // Auth is handled client-side in the app layout
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
