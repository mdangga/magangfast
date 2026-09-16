import { MapPin } from 'lucide-react'
import Link from 'next/link'

export function ApplicationLogo({
  appName = 'Titik Magang',
  showText = true,
  href = '/',
  className = '',
}: {
  appName?: string
  showText?: boolean
  href?: string
  className?: string
}) {
  const content = (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight ${className}`}>
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 via-primary to-yellow-300 flex items-center justify-center text-neutral-900 shadow-sm">
        <MapPin className="w-5 h-5 fill-neutral-900" />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-lg font-extrabold text-neutral-900 dark:text-white">
            {appName}
          </span>
          <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 tracking-wider uppercase">
            WebGIS Magang
          </span>
        </div>
      )}
    </div>
  )

  if (!href) return content

  return (
    <Link href={href} className="focus:outline-none focus:ring-2 focus:ring-primary rounded-lg">
      {content}
    </Link>
  )
}

