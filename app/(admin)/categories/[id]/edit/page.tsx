import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getCategoryById, updateCategoryAction } from '@/lib/actions/categories'
import { ArrowLeft, Check } from 'lucide-react'

interface EditCategoryPageProps {
  params: Promise<{ id: string }>
}

export default async function EditCategoryPage(props: EditCategoryPageProps) {
  const params = await props.params
  const id = parseInt(params.id)
  if (isNaN(id)) notFound()

  const category = await getCategoryById(id)
  if (!category) notFound()

  const handleUpdate = async (formData: FormData) => {
    'use server'
    const res = await updateCategoryAction(id, null, formData)
    if (res.success) {
      redirect('/categories')
    }
  }

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
          Edit Kategori
        </h1>
      </div>

      <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <form action={handleUpdate} className="space-y-4">
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
              defaultValue={category.name_category}
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
              className="flex items-center gap-2 px-5 py-2 bg-primary text-neutral-900 font-bold rounded-xl text-xs hover:bg-primary-dark transition shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

