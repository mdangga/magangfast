'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MapPin,
  FolderKanban,
  GraduationCap,
  Building2,
  Settings,
  X,
} from 'lucide-react'
import { ApplicationLogo } from './ApplicationLogo'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
  appName: string
  logoPath: string
}

export function AdminSidebar({
  isOpen,
  onClose,
  appName,
  logoPath,
}: AdminSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Lokasi Magang', href: '/locations', icon: MapPin },
    { label: 'Kategori', href: '/categories', icon: FolderKanban },
    { label: 'Jurusan', href: '/departments', icon: GraduationCap },
    { label: 'Fakultas', href: '/faculties', icon: Building2 },
    { label: 'Pengaturan Web', href: '/profile', icon: Settings },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transition-transform duration-200 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header / Logo */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
          <ApplicationLogo appName={appName} logoPath={logoPath} />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
            Menu Utama
          </p>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-primary text-neutral-900 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-900' : 'text-neutral-500 dark:text-neutral-400'}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 text-center">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl text-xs font-medium border border-neutral-200 dark:border-neutral-700 transition"
          >
            Buka Peta Publik &rarr;
          </Link>
        </div>
      </aside>
    </>
  )
}

