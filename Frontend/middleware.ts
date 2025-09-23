import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected (dashboard routes)
  const isProtectedRoute = pathname.startsWith('/dashboard')

  if (isProtectedRoute) {
    // In a real app, you would check for authentication here
    // For now, we'll let the client-side handle the redirect
    // You can add server-side session validation here if needed
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}


