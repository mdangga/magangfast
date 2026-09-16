'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { CategoryType } from '@/types'
import { deleteCategoryAction } from '@/lib/actions/categories'
import { ModalDelete } from '@/components/ui/modal-delete'
import { Plus, Edit2, Trash2, FolderKanban } from 'lucide-react'
import { toast } from 'sonner'

export function CategoryTable({
  initialCategories,
}: {
  initialCategories: CategoryType[]
}) {
  const [categories, setCategories] = useState(initialCategories)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!deleteId) return
    startTransition(async () => {
      const res = await deleteCategoryAction(deleteId)
      if (res.success) {
        toast.success('Kategori berhasil dihapus.')
        setCategories((prev) => prev.filter((c) => c.id_category !== deleteId))
        setDeleteId(null)
      } else {
        toast.error(res.error || 'Gagal menghapus kategori.')
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-500">
          Total: <span className="font-bold text-neutral-900 dark:text-white">{categories.length}</span> kategori
        </p>
        <Link
          href="/categories/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-neutral-900 font-bold rounded-xl text-xs hover:bg-primary-dark transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              <th className="py-3 px-4 w-14 text-center">No</th>
              <th className="py-3 px-4">Nama Kategori</th>
              <th className="py-3 px-4 text-center">Jumlah Titik Magang</th>
              <th className="py-3 px-4 text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-neutral-400">
                  Belum ada kategori yang dibuat.
                </td>
              </tr>
            ) : (
              categories.map((c, idx) => (
                <tr
                  key={c.id_category}
                  className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 transition"
                >
                  <td className="py-3 px-4 text-center font-mono text-neutral-400">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <FolderKanban className="w-4 h-4 text-primary-dark" />
                      <span>{c.name_category}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-[11px]">
                      {c.locations_count || 0} Lokasi
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/categories/${c.id_category}/edit`}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                        title="Edit Kategori"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteId(c.id_category)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ModalDelete
        isOpen={deleteId !== null}
        isLoading={isPending}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Hapus Kategori"
        message="Apakah Anda yakin ingin menghapus kategori ini? Menghapus kategori dapat berdampak pada data lokasi yang terkait."
      />
    </div>
  )
}

