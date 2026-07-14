import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_CLIENT = ['/compte']
const PROTECTED_ADMIN = ['/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Lecture du token depuis localStorage n'est pas possible dans le middleware
  // On lit depuis un cookie "ll_token" (à définir au login)
  const token = request.cookies.get('ll_token')?.value
  const userRole = request.cookies.get('ll_role')?.value

  const isClientRoute = PROTECTED_CLIENT.some((p) => pathname.startsWith(p))
  const isAdminRoute = PROTECTED_ADMIN.some((p) => pathname.startsWith(p))

  // Non authentifié → redirige vers /connexion
  if ((isClientRoute || isAdminRoute) && !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/connexion'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Authentifié mais pas ADMIN → redirige vers accueil
  if (isAdminRoute && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/compte/:path*', '/admin/:path*'],
}
