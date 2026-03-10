import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for security and rate limiting
 */

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers (these are also in next.config.js, but middleware adds per-request)
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  // Log suspicious activity (example)
  const userAgent = request.headers.get('user-agent') || '';
  if (userAgent.toLowerCase().includes('bot') && !userAgent.includes('googlebot')) {
    console.warn('Suspicious bot detected:', {
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      path: request.nextUrl.pathname,
      userAgent,
    });
  }

  return response;
}

// Configure which routes use middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

