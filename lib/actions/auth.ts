'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { authenticateUser, removeSessionCookie, signSession, setSessionCookie } from '@/lib/auth'

export async function loginAction(_prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email dan kata sandi wajib diisi.' }
  }

  const result = await authenticateUser(email, password)
  if (!result.success) {
    return { error: result.error }
  }

  redirect('/dashboard')
}

export async function registerAction(_prevState: unknown, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const passwordConfirmation = formData.get('password_confirmation') as string

  if (!name || !email || !password) {
    return { error: 'Semua field wajib diisi.' }
  }

  if (password !== passwordConfirmation) {
    return { error: 'Konfirmasi kata sandi tidak cocok.' }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: 'Email sudah terdaftar.' }
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  const token = await signSession({
    id: Number(newUser.id),
    name: newUser.name,
    email: newUser.email,
  })
  await setSessionCookie(token)

  redirect('/dashboard')
}

export async function logoutAction() {
  await removeSessionCookie()
  redirect('/login')
}

