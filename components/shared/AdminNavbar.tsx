'use client'

import { useState } from 'react'
import { Menu, LogOut, User as UserIcon, ChevronDown } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { SessionUser } from '@/types'
import { logoutAction } from '@/lib/actions/auth'

interface AdminNavbarProps {
  user?: SessionUser | null
  onToggleSidebar: () => void
}

export function AdminNavbar({ user, onToggleSidebar }: AdminNavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 hidden sm:inline-block">
          Panel Administrasi &bull; Titik Magang
        </span>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* User profile menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-primary text-neutral-900 font-bold flex items-center justify-center text-xs shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-neutral-400 truncate max-w-[120px]">
                {user?.email || 'admin@magang.id'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 py-1 z-50 text-xs animate-fadeIn">
                <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800 sm:hidden">
                  <p className="font-bold text-neutral-800 dark:text-neutral-200">{user?.name}</p>
                  <p className="text-neutral-400 truncate text-[10px]">{user?.email}</p>
                </div>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-left transition font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar (Logout)
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

