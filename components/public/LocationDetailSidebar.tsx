'use client'

import { useState } from 'react'
import { LocationType } from '@/types'
import {
  X,
  Phone,
  User,
  GraduationCap,
  Building2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'

interface LocationDetailSidebarProps {
  location: LocationType | null
  onClose: () => void
}

export function LocationDetailSidebar({
  location,
  onClose,
}: LocationDetailSidebarProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  if (!location) return null

  const images = location.images || []
  const hasMultipleImages = images.length > 1

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Sanitize contact for WhatsApp
  const cleanPhone = location.contact.replace(/[^0-9]/g, '')
  const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone

  return (
    <div className="absolute top-4 left-4 z-20 w-[92%] sm:w-[380px] max-h-[calc(100%-2rem)] bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden animate-slideUp">
      {/* Header with close button */}
      <div className="p-4 pb-2 flex items-start justify-between">
        <div>
          <span className="inline-block px-2.5 py-1 rounded-full bg-primary/20 text-neutral-900 dark:text-primary-300 font-bold text-[10px] uppercase tracking-wider mb-1">
            {location.category?.name_category || 'Kategori Magang'}
          </span>
          <h2 className="text-base font-extrabold text-neutral-900 dark:text-white leading-tight">
            {location.name_location}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pt-2 space-y-4">
        {/* Images Gallery */}
        {images.length > 0 ? (
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-inner group">
            <img
              src={images[activeImageIndex]?.image_path}
              alt={location.name_location}
              className="w-full h-full object-cover transition-transform duration-300"
            />

            {hasMultipleImages && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 bg-black/40 px-2 py-0.5 rounded-full">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        idx === activeImageIndex ? 'bg-white w-3' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-32 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center text-neutral-400 text-xs">
            <MapPin className="w-6 h-6 mb-1 opacity-50" />
            <span>Tidak ada foto lokasi</span>
          </div>
        )}

        {/* Description */}
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
            Deskripsi Lokasi / Perusahaan
          </h4>
          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
            {location.description}
          </p>
        </div>

        {/* Student Information */}
        <div className="p-3 bg-neutral-50 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-700/50 space-y-2 text-xs">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Informasi Mahasiswa Magang
          </h4>

          <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
            <User className="w-4 h-4 text-primary-dark shrink-0" />
            <span className="font-semibold">{location.student_name}</span>
            <span className="text-neutral-400 text-[11px]">({location.nim})</span>
          </div>

          {location.department && (
            <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
              <GraduationCap className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>
                {location.department.degree_level} {location.department.name_department}
              </span>
            </div>
          )}

          {location.department?.faculty && (
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-[11px]">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span>{location.department.faculty.name_faculty}</span>
            </div>
          )}
        </div>

        {/* Contact & Google Maps Actions */}
        <div className="space-y-2 pt-1">
          <a
            href={`https://wa.me/${waPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Hubungi via WhatsApp ({location.contact})</span>
          </a>

          <a
            href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-medium transition border border-neutral-200 dark:border-neutral-700"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Buka di Google Maps</span>
          </a>
        </div>
      </div>
    </div>
  )
}

