import Link from 'next/link'
import { ApplicationLogo } from '@/components/shared/ApplicationLogo'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { LogIn, LayoutDashboard } from 'lucide-react'
import { SessionUser, ProfileWebType } from '@/types'

interface PublicNavbarProps {
  user: SessionUser | null
  profile: ProfileWebType | null
}

export function PublicNavbar({ user, profile }: PublicNavbarProps) {
  return (
    <header className="h-16 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
      <div className="flex items-center gap-3">
        <ApplicationLogo appName={profile?.app_name || 'Titik Magang'} />
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        {user ? (
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3.5 py-2 bg-primary text-neutral-900 rounded-xl text-xs font-bold hover:bg-primary-dark transition shadow-xs"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard Admin</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 px-3.5 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition shadow-xs"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk Admin</span>
          </Link>
        )}
      </div>
    </header>
  )
}

