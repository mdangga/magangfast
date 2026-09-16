'use client'

import Link from 'next/link'
import Image from 'next/image'

interface ApplicationLogoProps {
  appName: string
  logoPath: string
  showText?: boolean
  href?: string
  className?: string
}

export function ApplicationLogo({
  appName,
  logoPath,
  showText = true,
  href = '/',
  className = '',
}: ApplicationLogoProps) {
  const content = (
    <div
      className={`flex items-center gap-2.5 font-bold tracking-tight ${className}`}
    >
      <div className="relative flex h-10 w-10">
        {logoPath ? (
          <Image
            src={logoPath}
            alt={appName}
            fill
            sizes="30px"
            className="object-center"
          />
        ) : ""}
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-lg font-extrabold text-neutral-900 dark:text-white">
            {appName}
          </span>

          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            WebGIS Magang
          </span>
        </div>
      )}
    </div>
  )

  if (!href) {
    return content
  }

  return (
    <Link
      href={href}
      className=""
    >
      {content}
    </Link>
  )
}