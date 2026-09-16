'use client'

import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

export const DynamicInteractiveMap = dynamic(
  () => import('./InteractiveMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] bg-neutral-100 dark:bg-neutral-900 flex flex-col items-center justify-center text-neutral-400 gap-3 animate-pulse">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <span className="text-xs font-medium">Memuat Peta Interaktif...</span>
      </div>
    ),
  }
)

export const DynamicLocationPickerMap = dynamic(
  () => import('./LocationPickerMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[360px] rounded-xl bg-neutral-100 dark:bg-neutral-900 flex flex-col items-center justify-center text-neutral-400 gap-3 animate-pulse border border-neutral-200 dark:border-neutral-800">
        <div className="w-8 h-8 rounded-full border-3 border-red-500 border-t-transparent animate-spin" />
        <span className="text-xs font-medium">Memuat Peta Pemilih Lokasi...</span>
      </div>
    ),
  }
)

