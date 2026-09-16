import { getFaculties } from '@/lib/actions/faculties'
import { FacultyTable } from '@/components/admin/FacultyTable'

export const revalidate = 0

export default async function FacultiesPage() {
  const faculties = await getFaculties()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Data Fakultas
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Kelola master data fakultas perguruan tinggi.
        </p>
      </div>

      <FacultyTable initialFaculties={faculties} />
    </div>
  )
}

