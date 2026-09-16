'use client'

import { useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { AdminNavbar } from './AdminNavbar'
import { SessionUser } from '@/types'

interface AdminLayoutShellProps {
  user: SessionUser | null
  children: React.ReactNode
}

export function AdminLayoutShell({ user, children }: AdminLayoutShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64 flex flex-col flex-1">
        <AdminNavbar
          user={user}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

