import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Middleware enabled but not restricting routes yet
  // Auth will be fully enabled after NextAuth dependencies are installed
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
