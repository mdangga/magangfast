'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Copy, Check, X, QrCode as QrIcon } from 'lucide-react'
import { toast } from 'sonner'

interface QrCodeModalProps {
  isOpen: boolean
  onClose: () => void
  link: string
}

export function QrCodeModal({ isOpen, onClose, link }: QrCodeModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (link && isOpen) {
      QRCode.toDataURL(link, {
        width: 280,
        margin: 2,
        color: {
          dark: '#171717',
          light: '#ffffff',
        },
      }).then(setQrDataUrl)
    }
  }, [link, isOpen])

  if (!isOpen) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    toast.success('Tautan berhasil disalin ke clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col items-center text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-dark dark:text-primary flex items-center justify-center mb-3">
          <QrIcon className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
          QR Code & Tautan Pengajuan
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs">
          Bagikan QR Code atau tautan ini kepada mahasiswa. Tautan ini bertanda tangan aman dan berlaku selama 24 jam.
        </p>

        {/* QR image */}
        <div className="my-5 p-3 bg-white rounded-xl shadow-sm border border-neutral-200 flex items-center justify-center">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code Pengajuan Lokasi" className="w-56 h-56 rounded-lg" />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-xs text-neutral-400">
              Membuat QR Code...
            </div>
          )}
        </div>

        {/* Link input & copy */}
        <div className="w-full flex items-center gap-2 p-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl">
          <input
            type="text"
            readOnly
            value={link}
            className="flex-1 bg-transparent px-3 text-xs text-neutral-700 dark:text-neutral-300 outline-none truncate font-mono"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-neutral-900 rounded-lg text-xs font-semibold hover:bg-primary-dark transition shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Tersalin' : 'Salin'}
          </button>
        </div>
      </div>
    </div>
  )
}

