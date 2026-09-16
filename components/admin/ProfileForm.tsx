'use client'

import { useState, useTransition } from 'react'
import { ProfileWebType } from '@/types'
import { updateProfileWebAction } from '@/lib/actions/profile'
import { Check, Upload, Building, FileText, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export function ProfileForm({
  initialProfile,
}: {
  initialProfile: ProfileWebType | null
}) {
  const [isPending, startTransition] = useTransition()
  const [previewLogo, setPreviewLogo] = useState<string | null>(
    initialProfile?.logo_path ? `/${initialProfile.logo_path}` : null
  )
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPreviewLogo(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await updateProfileWebAction(null, formData)
      if (res.success) {
        toast.success(res.message || 'Profil website berhasil diperbarui!')
      } else {
        setErrorMsg(res.error || 'Gagal memperbarui profil.')
        toast.error(res.error || 'Terjadi kesalahan.')
      }
    })
  }

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xs max-w-2xl">
      {errorMsg && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* App Name */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
            Nama Aplikasi / Website <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="app_name"
              required
              defaultValue={initialProfile?.app_name || 'Titik Magang'}
              placeholder="Contoh: Titik Magang"
              className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
            Deskripsi Aplikasi <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <textarea
              name="description"
              required
              rows={3}
              defaultValue={
                initialProfile?.description ||
                'Sistem Informasi Geografis Pemetaan Persebaran Lokasi Magang Mahasiswa'
              }
              placeholder="Jelaskan deskripsi singkat website..."
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
            Logo Website
          </label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-hidden flex items-center justify-center shrink-0">
              {previewLogo ? (
                <img
                  src={previewLogo}
                  alt="Logo Preview"
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <span className="text-[10px] text-neutral-400 font-bold">No Logo</span>
              )}
            </div>

            <div className="flex-1">
              <input
                type="file"
                name="logo"
                id="logo-input"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <label
                htmlFor="logo-input"
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded-xl cursor-pointer transition border border-neutral-200 dark:border-neutral-700"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih Berkas Logo Baru</span>
              </label>
              <p className="text-[10px] text-neutral-400 mt-1">
                Format gambar PNG/JPG/SVG, maks 2MB
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-neutral-900 font-bold rounded-xl text-xs hover:bg-primary-dark transition shadow-md disabled:opacity-50 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{isPending ? 'Menyimpan...' : 'Simpan Profil Website'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

