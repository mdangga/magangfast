import { getSession } from '@/lib/auth'
import { AdminLayoutShell } from '@/components/shared/AdminLayoutShell'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSession()

  return <AdminLayoutShell user={user}>{children}</AdminLayoutShell>
}

