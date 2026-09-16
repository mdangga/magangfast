'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { loginAction } from '@/lib/actions/auth'
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          Masuk ke Dashboard
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Silakan masukkan kredensial akun administrator Anda
        </p>
      </div>

      {state?.error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-center gap-2.5 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            Alamat Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@magang.id"
              className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            Kata Sandi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 px-4 bg-primary text-neutral-900 font-bold rounded-xl text-xs hover:bg-primary-dark transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <div className="w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Belum punya akun?{' '}
          <Link
            href="/register"
            className="font-bold text-primary-dark hover:underline"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  )
}

