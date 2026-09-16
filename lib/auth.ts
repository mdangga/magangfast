import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { SessionUser } from '@/types'

const AUTH_SECRET = new TextEncoder().encode(
  process.env.APP_SECRET || 'secret-salt-titikmagang-auth-2026'
)
const COOKIE_NAME = 'admin_session_token'

export async function signSession(user: SessionUser): Promise<string> {
  return new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(AUTH_SECRET)
}

export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, AUTH_SECRET)
    return {
      id: Number(payload.id),
      name: payload.name as string,
      email: payload.email as string,
    }
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifySession(token)
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function removeSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function authenticateUser(email: string, passwordPlain: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return { success: false, error: 'Email atau kata sandi salah.' }
  }

  const isValid = await bcrypt.compare(passwordPlain, user.password)
  if (!isValid) {
    return { success: false, error: 'Email atau kata sandi salah.' }
  }

  const sessionUser: SessionUser = {
    id: Number(user.id),
    name: user.name,
    email: user.email,
  }

  const token = await signSession(sessionUser)
  await setSessionCookie(token)

  return { success: true, user: sessionUser }
}

