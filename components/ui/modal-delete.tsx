'use client'

import { AlertTriangle, X } from 'lucide-react'

interface ModalDeleteProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  isLoading?: boolean
}

export function ModalDelete({
  isOpen,
  onClose,
  onConfirm,
  title = 'Hapus Data',
  message = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
  isLoading = false,
}: ModalDeleteProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col items-center text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-neutral-900 dark:text-white">
          {title}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
          {message}
        </p>

        <div className="w-full flex items-center gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2 px-4 rounded-xl bg-red-600 text-xs font-semibold text-white hover:bg-red-700 transition shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  )
}

