'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createCategoryAction } from '@/lib/actions/categories'
import { ArrowLeft, Check, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useEffect } from 'react'

export default function CreateCategoryPage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createCategoryAction, null)

  useEffect(() => {
    if (state?.success) {
      toast.success('Kategori berhasil ditambahkan!')
      router.push('/categories')
    }
  }, [state, router])

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-medium mb-3 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Kategori</span>
        </Link>
        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
          Tambah Kategori Baru
        </h1>
      </div>

      <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
        {state?.error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="name_category"
              className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              Nama Kategori <span className="text-red-500">*</span>
            </label>
            <input
              id="name_category"
              name="name_category"
              type="text"
              required
              placeholder="Contoh: Software House, BUMN, Perhotelan..."
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Link
              href="/categories"
              className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-neutral-900 font-bold rounded-xl text-xs hover:bg-primary-dark transition shadow-sm disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isPending ? 'Menyimpan...' : 'Simpan Kategori'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

