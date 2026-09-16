import { getSession } from '@/lib/auth'
import { getProfileWeb } from '@/lib/actions/profile'
import { PublicNavbar } from '@/components/public/PublicNavbar'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, profile] = await Promise.all([getSession(), getProfileWeb()])

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-950">
      <PublicNavbar user={user} profile={profile} />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  )
}

