import { getCategories } from '@/lib/actions/categories'
import { CategoryTable } from '@/components/admin/CategoryTable'

export const revalidate = 0

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Kategori Tempat Magang
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Kelola master kategori instansi atau bidang industri tempat magang mahasiswa.
        </p>
      </div>

      <CategoryTable initialCategories={categories} />
    </div>
  )
}

