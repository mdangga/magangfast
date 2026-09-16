import { getProfileWeb } from '@/lib/actions/profile'
import { ProfileForm } from '@/components/admin/ProfileForm'

export const revalidate = 0

export default async function AdminProfilePage() {
  const profile = await getProfileWeb()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Pengaturan Profil Website
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Sesuaikan judul, deskripsi, dan logo yang tampil pada navigasi dan halaman utama.
        </p>
      </div>

      <ProfileForm initialProfile={profile} />
    </div>
  )
}

