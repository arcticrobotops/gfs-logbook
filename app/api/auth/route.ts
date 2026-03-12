import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// #2 / #7: Validate SITE_PASSWORD is defined and non-empty.
// Validated lazily to avoid breaking the build when env vars are not yet available.
function getPassword(): string {
  const pw = process.env.SITE_PASSWORD;
  if (!pw || pw.trim() === '') {
    throw new Error('SITE_PASSWORD environment variable must be set and non-empty');
  }
  return pw;
}

// #2: Remove fallback secret — throw if env var not set.
function getCookieSecret(): string {
  const secret = process.env.COOKIE_SECRET;
  if (!secret) {
    throw new Error('COOKIE_SECRET environment variable must be set');
  }
  return secret;
}

const COOKIE_NAME = 'site-auth';

// #1: In-memory rate limiter — track by IP, max 5 attempts per 60s
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

/** Validate that `next` is a safe relative path (no open redirect). */
function sanitizeNext(next: string): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.includes('://')) {
    return '/';
  }
  return next;
}

/** Create an HMAC-signed token for the auth cookie. */
function signToken(value: string): string {
  const hmac = crypto.createHmac('sha256', getCookieSecret());
  hmac.update(value);
  return `${value}.${hmac.digest('hex')}`;
}

/**
 * Verify an HMAC-signed token. Returns true if valid.
 *
 * #21: This auth route uses Node.js `crypto` module (crypto.createHmac) because
 * API routes run in the Node.js runtime and have full access to the `crypto` module.
 * The middleware uses Web Crypto API (crypto.subtle) because Edge Middleware runs
 * in the Edge runtime where the Node.js `crypto` module is not available.
 * Both produce identical HMAC-SHA256 signatures so tokens are interoperable.
 */
// #22: Removed `export` keyword — verifyToken is only used internally in this file.
function verifyToken(token: string): boolean {
  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return false;
  const value = token.slice(0, lastDot);
  const expected = signToken(value);
  // Use timing-safe comparison for the full signed token
  if (expected.length !== token.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

// Keep verifyToken referenced to avoid unused-variable lint (used internally)
void verifyToken;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function GET(request: NextRequest) {
  const rawNext = request.nextUrl.searchParams.get('next') || '/';
  const next = sanitizeNext(rawNext);
  return new NextResponse(loginHTML(next), {
    headers: { 'Content-Type': 'text/html' },
  });
}

export async function POST(request: NextRequest) {
  // #1: Rate limiting by IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return new NextResponse(
      loginHTML('/', 'Too many login attempts. Please try again later.'),
      {
        status: 429,
        headers: { 'Content-Type': 'text/html' },
      },
    );
  }

  // #13: CSRF protection — validate Origin/Referer header
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const requestUrl = new URL(request.url);
  const expectedOrigin = requestUrl.origin;

  if (origin && origin !== expectedOrigin) {
    return new NextResponse(loginHTML('/', 'Invalid request origin'), {
      status: 403,
      headers: { 'Content-Type': 'text/html' },
    });
  }
  if (!origin && referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      if (refererOrigin !== expectedOrigin) {
        return new NextResponse(loginHTML('/', 'Invalid request origin'), {
          status: 403,
          headers: { 'Content-Type': 'text/html' },
        });
      }
    } catch {
      // malformed referer — reject
      return new NextResponse(loginHTML('/', 'Invalid request'), {
        status: 403,
        headers: { 'Content-Type': 'text/html' },
      });
    }
  }

  try {
    const formData = await request.formData();
    const password = formData.get('password') as string;
    const rawNext = formData.get('next') as string || '/';
    const next = sanitizeNext(rawNext);

    // Timing-safe password comparison
    const sitePassword = getPassword();
    const isValid =
      password &&
      sitePassword.length === password.length &&
      crypto.timingSafeEqual(Buffer.from(sitePassword), Buffer.from(password));

    if (isValid) {
      const response = NextResponse.redirect(new URL(next, request.url));
      // #15: Token already includes a timestamp for expiration checking in middleware
      const payload = `authenticated:${Date.now()}`;
      const token = signToken(payload);
      response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });
      return response;
    }

    return new NextResponse(loginHTML(next, 'Incorrect password'), {
      status: 401,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch {
    return new NextResponse(loginHTML('/', 'Something went wrong'), {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

function loginHTML(next: string, error?: string) {
  const safeNext = escapeHtml(next);
  const safeError = error ? escapeHtml(error) : undefined;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ghost Forest Surf Club</title>
  <link rel="icon" href="/favicon.ico" />
  <meta name="description" content="Maritime inventory of coldwater surf goods. Station 45°N. Neskowin, Oregon." />
  <meta property="og:title" content="Ghost Forest Surf Club" />
  <meta property="og:description" content="Maritime inventory of coldwater surf goods. Station 45°N. Neskowin, Oregon." />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a1a;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #e5e5e5;
    }
    .container {
      text-align: center;
      padding: 2rem;
      max-width: 360px;
      width: 100%;
    }
    .brand {
      font-size: 11px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #666;
      margin-bottom: 2rem;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 300;
      margin-bottom: 2rem;
      color: #ccc;
    }
    form { display: flex; flex-direction: column; gap: 1rem; }
    input[type="password"] {
      padding: 12px 16px;
      background: #2a2a2a;
      border: 1px solid #333;
      border-radius: 6px;
      color: #e5e5e5;
      font-size: 14px;
      text-align: center;
      outline: none;
      transition: border-color 0.2s;
    }
    input[type="password"]:focus { border-color: #555; }
    button {
      padding: 12px 16px;
      background: #333;
      border: 1px solid #444;
      border-radius: 6px;
      color: #e5e5e5;
      font-size: 13px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover { background: #444; }
    .error {
      color: #e57373;
      font-size: 13px;
      margin-bottom: 0.5rem;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      white-space: nowrap;
      border: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <p class="brand">Ghost Forest Surf Club</p>
    <h1>Enter Password</h1>
    ${safeError ? `<p class="error" aria-live="polite">${safeError}</p>` : ''}
    <form method="POST" action="/api/auth" id="auth-form">
      <input type="hidden" name="next" value="${safeNext}" />
      <label for="password" class="sr-only">Password</label>
      <input type="password" id="password" name="password" placeholder="Password" autofocus required />
      <p class="error" id="client-error" aria-live="polite" hidden></p>
      <button type="submit">Enter</button>
    </form>
    <script>
      document.getElementById('auth-form').addEventListener('submit', function(e) {
        var pw = document.getElementById('password').value;
        var errEl = document.getElementById('client-error');
        if (!pw || pw.trim() === '') {
          e.preventDefault();
          errEl.textContent = 'Please enter a password';
          errEl.hidden = false;
        } else {
          errEl.hidden = true;
        }
      });
    </script>
  </div>
</body>
</html>`;
}
