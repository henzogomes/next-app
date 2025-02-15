import { NextResponse, type NextRequest } from 'next/server'
import { SessionController } from '@/controllers/SessionController'
import {
  API_ROUTE,
  AUTH_API_ROUTE,
  PROTECTED_PAGE_ROUTES,
  PUBLIC_API_ROUTES,
  PUBLIC_PAGE_ROUTES,
} from '@/lib/constants'

const UNAUTHORIZED_STATUS = 401

async function isAuthenticated(): Promise<boolean> {
  const session = await SessionController.verifySession()
  return session.isAuth
}

async function handleApiRequest(path: string): Promise<NextResponse> {
  if (path === AUTH_API_ROUTE || PUBLIC_API_ROUTES.includes(path)) {
    return NextResponse.next()
  }

  const isAuth = await isAuthenticated()

  if (!isAuth) {
    console.log('Not logged in')
    return NextResponse.json({ message: 'Unauthorized' }, { status: UNAUTHORIZED_STATUS })
  }

  return NextResponse.next()
}

async function handlePageRequest(path: string, request: NextRequest): Promise<NextResponse> {
  if (PUBLIC_PAGE_ROUTES.includes(path)) {
    return NextResponse.next()
  }

  if (PROTECTED_PAGE_ROUTES.some((route) => path.startsWith(route))) {
    const isAuth = await isAuthenticated()

    if (!isAuth) {
      console.log('No session found, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const path = request.nextUrl.pathname

  if (path.startsWith(API_ROUTE)) {
    return handleApiRequest(path)
  } else {
    return handlePageRequest(path, request)
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
