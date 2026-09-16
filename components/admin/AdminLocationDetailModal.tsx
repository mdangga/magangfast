'use client'

import { LocationType } from '@/types'
import { X, MapPin, User, GraduationCap, Phone, Calendar } from 'lucide-react'

interface AdminLocationDetailModalProps {
  location: LocationType | null
  onClose: () => void
}

export function AdminLocationDetailModal({
  location,
  onClose,
}: AdminLocationDetailModalProps) {
  if (!location) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 flex flex-col max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-neutral-900 dark:text-primary-300 font-bold text-[10px] uppercase">
            {location.category?.name_category}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              location.approved_at
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
            }`}
          >
            {location.approved_at ? 'Disetujui' : 'Menunggu Persetujuan'}
          </span>
        </div>

        <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white">
          {location.name_location}
        </h2>

        {/* Image thumbnails */}
        {location.images && location.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
            {location.images.map((img) => (
              <a
                key={img.id_image}
                href={`/${img.image_path}`}
                target="_blank"
                rel="noreferrer"
                className="aspect-video rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 group relative block"
              >
                <img
                  src={`/${img.image_path}`}
                  alt={location.name_location}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                />
              </a>
            ))}
          </div>
        )}

        <div className="space-y-4 text-xs mt-2">
          <div>
            <h4 className="font-bold text-neutral-400 uppercase tracking-wider text-[10px] mb-1">
              Deskripsi & Alamat
            </h4>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
              {location.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-100 dark:border-neutral-800 space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase">Data Mahasiswa</span>
              <div className="flex items-center gap-1.5 font-semibold text-neutral-800 dark:text-neutral-200">
                <User className="w-3.5 h-3.5 text-primary-dark" />
                <span>{location.student_name} ({location.nim})</span>
              </div>
              {location.department && (
                <div className="flex items-center gap-1.5 text-neutral-500 text-[11px]">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{location.department.degree_level} {location.department.name_department}</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-100 dark:border-neutral-800 space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase">Kontak & Lokasi</span>
              <div className="flex items-center gap-1.5 font-semibold text-neutral-800 dark:text-neutral-200">
                <Phone className="w-3.5 h-3.5 text-primary-dark" />
                <span>{location.contact}</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-500 text-[11px] font-mono">
                <MapPin className="w-3.5 h-3.5" />
                <span>{location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold rounded-xl text-xs transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

