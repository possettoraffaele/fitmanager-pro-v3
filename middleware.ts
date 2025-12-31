import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Proteggi le route dashboard
  if (pathname.startsWith('/dashboard')) {
    const isAuth = request.cookies.get('auth')
    
    if (!isAuth) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }
  
  // Redirect root a dashboard se autenticato
  if (pathname === '/') {
    const isAuth = request.cookies.get('auth')
    if (isAuth) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*']
}
