import jwt from 'jsonwebtoken'

const COOKIE_NAME = 'msa_admin_token'
const isProd = process.env.NODE_ENV === 'production'

export function generateToken(payload) {
  const secret = process.env.JWT_SECRET
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
  return jwt.sign(payload, secret, { expiresIn })
}

export function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd, // must be true in production (HTTPS) for SameSite=None to work
    sameSite: isProd ? 'none' : 'lax', // 'none' for cross-origin prod (e.g. Vercel front + separate backend)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  })
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  })
}

export const AUTH_COOKIE_NAME = COOKIE_NAME
