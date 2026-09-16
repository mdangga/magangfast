import { getDepartments } from '@/lib/actions/departments'
import { DepartmentTable } from '@/components/admin/DepartmentTable'

export const revalidate = 0

export default async function DepartmentsPage() {
  const departments = await getDepartments()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Data Program Studi / Jurusan
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Kelola master data program studi mahasiswa beserta fakultas induknya.
        </p>
      </div>

      <DepartmentTable initialDepartments={departments} />
    </div>
  )
}

