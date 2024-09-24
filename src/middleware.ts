import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jwt from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || ''

const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (publicRoutes.includes(path)) {
    return NextResponse.next()
  }

  if (protectedRoutes.some((route) => path.startsWith(route))) {
    const token = request.cookies.get('token')?.value

    if (!token) {
      console.log('No token found, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET)
      await jwt.jwtVerify(token, secret)
      console.log('Token verified successfully')
      return NextResponse.next()
    } catch (error) {
      console.log('Token verification failed:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
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
