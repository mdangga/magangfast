import { AdminLayoutShell } from '@/components/shared/AdminLayoutShell'
import { prisma } from '@/lib/prisma'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await prisma.profileWeb.findFirst({
    select: {
      app_name: true,
      logo_path: true,
    },
  })

  // Sesuaikan dengan cara kamu mengambil user/session
  const user = null

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