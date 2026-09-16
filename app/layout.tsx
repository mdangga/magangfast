import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Titik Magang - Sistem Informasi Geografis Lokasi Magang',
  description: 'Peta pemetaan persebaran lokasi magang mahasiswa secara interaktif',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${figtree.variable} font-sans antialiased bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 min-h-screen flex flex-col`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
