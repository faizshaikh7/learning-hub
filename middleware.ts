import { next } from '@vercel/edge'

/**
 * Vercel Edge Middleware — server-side HTTP Basic Auth for the whole site.
 *
 * This runs on Vercel's edge BEFORE any file (HTML, JS, assets) is served, so
 * the app and its content are never delivered to an unauthenticated visitor.
 * Credentials live in Vercel environment variables (BASIC_AUTH_USER /
 * BASIC_AUTH_PASS) — they are never shipped in the client bundle.
 *
 * Fails closed: if the env vars are not configured, everything is denied.
 */
export const config = {
  // Protect every path. Once the browser has the credentials it sends the
  // Authorization header on all follow-up requests, so assets are covered too.
  matcher: '/(.*)',
}

function unauthorized(): Response {
  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="LearnKar", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  })
}

export default function middleware(request: Request) {
  const USER = process.env.BASIC_AUTH_USER
  const PASS = process.env.BASIC_AUTH_PASS

  // No credentials configured → deny everything (secure default).
  if (!USER || !PASS) return unauthorized()

  const header = request.headers.get('authorization')
  if (!header || !header.startsWith('Basic ')) return unauthorized()

  let decoded = ''
  try {
    decoded = atob(header.slice(6))
  } catch {
    return unauthorized()
  }

  const sep = decoded.indexOf(':')
  const user = sep === -1 ? decoded : decoded.slice(0, sep)
  const pass = sep === -1 ? '' : decoded.slice(sep + 1)

  if (user === USER && pass === PASS) return next()
  return unauthorized()
}
