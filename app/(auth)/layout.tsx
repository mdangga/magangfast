import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { ApplicationLogo } from '@/components/shared/ApplicationLogo'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <ApplicationLogo className="mb-4" />
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-neutral-900 py-8 px-6 shadow-xl sm:rounded-2xl sm:px-10 border border-neutral-200 dark:border-neutral-800">
          {children}
        </div>
      </div>
    </div>
  )
}

