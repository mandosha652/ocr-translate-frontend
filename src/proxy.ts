import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { MAINTENANCE_HTML } from '@/lib/maintenance-html';

const isDev = process.env.NODE_ENV === 'development';

const protectedRoutes = [
  '/dashboard',
  '/translate',
  '/batch',
  '/history',
  '/settings',
];
const authRoutes = ['/login', '/signup'];
const adminRoutes = ['/admin'];

function matchesRoute(pathname: string, routes: string[]) {
  return routes.some(r => pathname === r || pathname.startsWith(`${r}/`));
}

function handleMaintenance(request: NextRequest): NextResponse | null {
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  const secret = process.env.MAINTENANCE_SECRET || '';
  if (!maintenanceMode) return null;

  const { pathname } = request.nextUrl;

  if (pathname === '/maintenance') return NextResponse.next();

  // Bypass via cookie
  if (secret && request.cookies.get('maintenance_bypass')?.value === secret) {
    return NextResponse.next();
  }

  // Bypass via X-Maintenance-Bypass header — sets cookie for future requests
  if (secret && request.headers.get('x-maintenance-bypass') === secret) {
    const response = NextResponse.redirect(new URL(pathname, request.url));
    response.cookies.set('maintenance_bypass', secret, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  }

  return new NextResponse(MAINTENANCE_HTML, {
    status: 503,
    headers: { 'Content-Type': 'text/html', 'Retry-After': '86400' },
  });
}

export function proxy(request: NextRequest) {
  const maintenance = handleMaintenance(request);
  if (maintenance) return maintenance;

  if (process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true') {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const isAuthenticated = !!request.cookies.get('access_token')?.value;

  // Redirect unauthenticated users to login
  if (matchesRoute(pathname, protectedRoutes) && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    const rawCallback =
      request.nextUrl.searchParams.get('callbackUrl') ?? pathname;
    const safeCallback =
      rawCallback.startsWith('/') && !rawCallback.startsWith('//')
        ? rawCallback
        : '/dashboard';
    loginUrl.searchParams.set('callbackUrl', safeCallback);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (matchesRoute(pathname, authRoutes) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Guard admin routes — require session cookie set by AdminAuthGate
  if (matchesRoute(pathname, adminRoutes)) {
    if (
      !request.cookies.get('admin_authenticated')?.value &&
      pathname !== '/admin'
    ) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // Generate nonce for CSP (per-request, cryptographically secure)
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''} https://vercel.live https://*.vercel-scripts.com;
    style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`};
    img-src 'self' blob: data: https:;
    font-src 'self';
    connect-src 'self' https://o4510886285672448.ingest.us.sentry.io https://vercel.live wss:${isDev ? ' http://localhost:* ws://localhost:*' : ''};
    worker-src 'self' blob:;
    media-src 'self';
    object-src 'none';
    base-uri 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;

  // Normalize CSP: remove extra spaces and newlines
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Set nonce in request headers for layout access
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  // Create response with updated request headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set CSP header on response
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  );

  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
