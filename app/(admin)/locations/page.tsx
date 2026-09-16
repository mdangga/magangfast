import { getAllLocations } from '@/lib/actions/locations'
import { LocationManagementTable } from '@/components/admin/LocationManagementTable'

export const revalidate = 0

export default async function AdminLocationsPage() {
  const locations = await getAllLocations()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Kelola Titik Lokasi Magang
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Daftar seluruh lokasi magang yang diajukan oleh mahasiswa beserta status verifikasinya.
        </p>
      </div>

      <LocationManagementTable initialLocations={locations} />
    </div>
  )
}

