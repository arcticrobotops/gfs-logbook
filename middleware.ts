import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'site-auth';

// #2: Remove fallback secret — validated lazily to avoid build-time errors
function getCookieSecret(): string {
  const secret = process.env.COOKIE_SECRET;
  if (!secret) {
    throw new Error('COOKIE_SECRET environment variable must be set');
  }
  return secret;
}

// #6: Token expiration — reject tokens older than 30 days
const TOKEN_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * #21: This middleware uses the Web Crypto API (crypto.subtle) for HMAC signing
 * because Edge Middleware runs in the Edge runtime where the Node.js `crypto` module
 * is not available. The auth route (app/api/auth/route.ts) uses Node.js `crypto.createHmac`
 * because API routes run in the Node.js runtime. Both produce identical HMAC-SHA256
 * signatures so tokens are interoperable across runtimes.
 */
async function hmacSign(value: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function verifyToken(token: string): Promise<boolean> {
  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return false;
  const value = token.slice(0, lastDot);
  const providedSig = token.slice(lastDot + 1);
  const expectedSig = await hmacSign(value, getCookieSecret());
  if (!timingSafeEqual(expectedSig, providedSig)) return false;

  // #6: Parse timestamp from token payload and reject tokens older than 30 days
  // Token format: "authenticated:<timestamp>"
  const parts = value.split(':');
  if (parts.length >= 2) {
    const timestamp = parseInt(parts[1], 10);
    if (!isNaN(timestamp)) {
      if (Date.now() - timestamp > TOKEN_MAX_AGE_MS) {
        return false;
      }
    }
  }

  return true;
}

export async function middleware(request: NextRequest) {
  // Skip auth routes
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Check for auth cookie with HMAC verification
  const authCookie = request.cookies.get(COOKIE_NAME);
  if (authCookie?.value && (await verifyToken(authCookie.value))) {
    return NextResponse.next();
  }

  // Redirect to login
  const loginUrl = new URL('/api/auth', request.url);
  loginUrl.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
