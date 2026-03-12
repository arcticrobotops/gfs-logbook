import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const PASSWORD = process.env.SITE_PASSWORD;
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'fallback-secret-change-me';
const COOKIE_NAME = 'site-auth';

/** Validate that `next` is a safe relative path (no open redirect). */
function sanitizeNext(next: string): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.includes('://')) {
    return '/';
  }
  return next;
}

/** Create an HMAC-signed token for the auth cookie. */
function signToken(value: string): string {
  const hmac = crypto.createHmac('sha256', COOKIE_SECRET);
  hmac.update(value);
  return `${value}.${hmac.digest('hex')}`;
}

/** Verify an HMAC-signed token. Returns true if valid. */
export function verifyToken(token: string): boolean {
  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return false;
  const value = token.slice(0, lastDot);
  const expected = signToken(value);
  // Use timing-safe comparison for the full signed token
  if (expected.length !== token.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

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
  try {
    const formData = await request.formData();
    const password = formData.get('password') as string;
    const rawNext = formData.get('next') as string || '/';
    const next = sanitizeNext(rawNext);

    // Timing-safe password comparison
    const isValid =
      PASSWORD &&
      password &&
      PASSWORD.length === password.length &&
      crypto.timingSafeEqual(Buffer.from(PASSWORD), Buffer.from(password));

    if (isValid) {
      const response = NextResponse.redirect(new URL(next, request.url));
      const token = signToken('authenticated');
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
    <form method="POST" action="/api/auth">
      <input type="hidden" name="next" value="${safeNext}" />
      <label for="password" class="sr-only">Password</label>
      <input type="password" id="password" name="password" placeholder="Password" autofocus required />
      <button type="submit">Enter</button>
    </form>
  </div>
</body>
</html>`;
}
