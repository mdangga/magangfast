import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getFaculties } from '@/lib/actions/faculties'
import { createDepartmentAction } from '@/lib/actions/departments'
import { ArrowLeft, Check } from 'lucide-react'

export default async function CreateDepartmentPage() {
  const faculties = await getFaculties()

  const handleCreate = async (formData: FormData) => {
    'use server'
    const res = await createDepartmentAction(null, formData)
    if (res.success) {
      redirect('/departments')
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <Link
          href="/departments"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-medium mb-3 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Jurusan</span>
        </Link>
        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
          Tambah Jurusan Baru
        </h1>
      </div>

      <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <form action={handleCreate} className="space-y-4">
          <div>
            <label
              htmlFor="name_department"
              className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              Nama Program Studi / Jurusan <span className="text-red-500">*</span>
            </label>
            <input
              id="name_department"
              name="name_department"
              type="text"
              required
              placeholder="Contoh: Teknologi Informasi, Akuntansi..."
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="degree_level"
              className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              Jenjang Pendidikan <span className="text-red-500">*</span>
            </label>
            <select
              id="degree_level"
              name="degree_level"
              required
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="S1">S1 (Sarjana)</option>
              <option value="D4">D4 (Sarjana Terapan)</option>
              <option value="D3">D3 (Diploma)</option>
              <option value="S2">S2 (Magister)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="id_faculty"
              className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              Fakultas Induk <span className="text-red-500">*</span>
            </label>
            <select
              id="id_faculty"
              name="id_faculty"
              required
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="">-- Pilih Fakultas --</option>
              {faculties.map((f) => (
                <option key={f.id_faculty} value={f.id_faculty}>
                  {f.name_faculty}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Link
              href="/departments"
              className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-primary text-neutral-900 font-bold rounded-xl text-xs hover:bg-primary-dark transition shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Jurusan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

