'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { DepartmentType } from '@/types'
import { deleteDepartmentAction } from '@/lib/actions/departments'
import { ModalDelete } from '@/components/ui/modal-delete'
import { Plus, Edit2, Trash2, GraduationCap, Building2 } from 'lucide-react'
import { toast } from 'sonner'

export function DepartmentTable({
  initialDepartments,
}: {
  initialDepartments: DepartmentType[]
}) {
  const [departments, setDepartments] = useState(initialDepartments)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!deleteId) return
    startTransition(async () => {
      const res = await deleteDepartmentAction(deleteId)
      if (res.success) {
        toast.success('Jurusan berhasil dihapus.')
        setDepartments((prev) => prev.filter((d) => d.id_department !== deleteId))
        setDeleteId(null)
      } else {
        toast.error(res.error || 'Gagal menghapus jurusan.')
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-500">
          Total: <span className="font-bold text-neutral-900 dark:text-white">{departments.length}</span> program studi / jurusan
        </p>
        <Link
          href="/departments/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-neutral-900 font-bold rounded-xl text-xs hover:bg-primary-dark transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jurusan</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              <th className="py-3 px-4 w-14 text-center">No</th>
              <th className="py-3 px-4">Nama Program Studi / Jurusan</th>
              <th className="py-3 px-4">Jenjang</th>
              <th className="py-3 px-4">Fakultas</th>
              <th className="py-3 px-4 text-center">Jumlah Lokasi</th>
              <th className="py-3 px-4 text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {departments.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-neutral-400">
                  Belum ada data jurusan.
                </td>
              </tr>
            ) : (
              departments.map((d, idx) => (
                <tr
                  key={d.id_department}
                  className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 transition"
                >
                  <td className="py-3 px-4 text-center font-mono text-neutral-400">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary-dark" />
                      <span>{d.name_department}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-[10px]">
                      {d.degree_level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{d.faculty?.name_faculty || '-'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-[11px]">
                      {d.locations_count || 0} Titik
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/departments/${d.id_department}/edit`}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                        title="Edit Jurusan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteId(d.id_department)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition"
                        title="Hapus Jurusan"
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
        title="Hapus Jurusan"
        message="Apakah Anda yakin ingin menghapus data jurusan ini? Data lokasi magang yang terikat pada jurusan ini dapat terpengaruh."
      />
    </div>
  )
}

