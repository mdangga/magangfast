import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const AUTH_SECRET = new TextEncoder().encode(
  process.env.APP_SECRET || 'secret-salt-titikmagang-auth-2026'
)
const COOKIE_NAME = 'admin_session_token'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value

  let isAuthenticated = false
  if (token) {
    try {
      await jwtVerify(token, AUTH_SECRET)
      isAuthenticated = true
    } catch {
      isAuthenticated = false
    }
  }

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isProtectedAdminRoute =
    pathname.startsWith('/dashboard') ||
    (pathname.startsWith('/locations') && !pathname.startsWith('/locations/submit')) ||
    pathname.startsWith('/categories') ||
    pathname.startsWith('/faculties') ||
    pathname.startsWith('/departments') ||
    pathname.startsWith('/profile')

  if (isProtectedAdminRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/locations/:path*',
    '/categories/:path*',
    '/faculties/:path*',
    '/departments/:path*',
    '/profile/:path*',
    '/login',
    '/register',
  ],
}

