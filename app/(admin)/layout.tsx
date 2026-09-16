import { getSession } from '@/lib/auth'
import { getProfileWeb } from '@/lib/actions/profile'
import { AdminLayoutShell } from '@/components/shared/AdminLayoutShell'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, profile] = await Promise.all([getSession(), getProfileWeb()])

  return (
    <AdminLayoutShell
      user={user}
      appName={profile?.app_name ?? 'Titik Magang'}
      logoPath={profile?.logo_path ?? ''}
    >
      {children}
    </AdminLayoutShell>
  )
}

