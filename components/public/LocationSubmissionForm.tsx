'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DynamicLocationPickerMap } from '@/components/map/MapWrapper'
import { submitLocationAction } from '@/lib/actions/locations'
import { CategoryType, FacultyType } from '@/types'
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Building,
  User,
  Phone,
  FileText,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'

interface LocationSubmissionFormProps {
  categories: CategoryType[]
  faculties: FacultyType[]
}

export function LocationSubmissionForm({
  categories,
  faculties,
}: LocationSubmissionFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Coordinates state
  const [coords, setCoords] = useState<{ latitude: number; longitude: number }>({
    latitude: -8.65,
    longitude: 115.22,
  })

  // Selected faculty for cascading department dropdown
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | ''>('')
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | ''>('')

  // Files state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const filteredDepartments = faculties.find(
    (f) => f.id_faculty === Number(selectedFacultyId)
  )?.departments || []

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...filesArr])

      const newUrls = filesArr.map((file) => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...newUrls])
    }
  }

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    formData.set('latitude', coords.latitude.toString())
    formData.set('longitude', coords.longitude.toString())

    // Append images
    formData.delete('images')
    selectedFiles.forEach((file) => {
      formData.append('images', file)
    })

    startTransition(async () => {
      const res = await submitLocationAction(null, formData)
      if (res.success) {
        setSubmitted(true)
        toast.success(res.message)
      } else {
        setErrorMessage(res.error || 'Terjadi kesalahan saat menyimpan data.')
        toast.error(res.error || 'Gagal mengirim pengajuan.')
      }
    })
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white dark:bg-neutral-900 rounded-3xl shadow-xl border border-neutral-200 dark:border-neutral-800 text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Pengajuan Berhasil Dikirim!
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
          Terima kasih telah berkontribusi mendata titik magang. Data Anda telah tersimpan dan akan segera ditinjau oleh administrator sebelum ditampilkan pada peta publik.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2.5 bg-primary text-neutral-900 font-bold rounded-xl text-sm hover:bg-primary-dark transition shadow-md"
        >
          Kembali ke Peta Utama
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-center gap-3 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Section 1: Mahasiswa */}
      <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <User className="w-5 h-5 text-primary-dark" />
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            1. Data Mahasiswa
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Nama Mahasiswa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="student_name"
              required
              placeholder="Contoh: I Putu Angga Murdika"
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              NIM Mahasiswa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nim"
              required
              maxLength={10}
              placeholder="Contoh: 2105551001"
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Fakultas <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={selectedFacultyId}
              onChange={(e) => {
                setSelectedFacultyId(Number(e.target.value))
                setSelectedDepartmentId('')
              }}
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="">-- Pilih Fakultas --</option>
              {faculties.map((f) => (
                <option key={f.id_faculty} value={f.id_faculty}>
                  {f.name_faculty}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Program Studi / Jurusan <span className="text-red-500">*</span>
            </label>
            <select
              name="id_department"
              required
              disabled={!selectedFacultyId}
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
            >
              <option value="">
                {selectedFacultyId ? '-- Pilih Jurusan --' : 'Pilih Fakultas Dahulu'}
              </option>
              {filteredDepartments.map((d) => (
                <option key={d.id_department} value={d.id_department}>
                  {d.degree_level} - {d.name_department}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Informasi Tempat Magang */}
      <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <Building className="w-5 h-5 text-primary-dark" />
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            2. Informasi Perusahaan / Tempat Magang
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Nama Tempat / Instansi Magang <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name_location"
              required
              placeholder="Contoh: PT Telkom Indonesia Denpasar"
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Kategori Magang <span className="text-red-500">*</span>
            </label>
            <select
              name="id_category"
              required
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((c) => (
                <option key={c.id_category} value={c.id_category}>
                  {c.name_category}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Kontak / Nomor Telepon Perusahaan (WhatsApp) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="contact"
                required
                maxLength={15}
                placeholder="Contoh: 081234567890"
                className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary outline-none font-mono"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Deskripsi & Alamat Lengkap <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Jelaskan alamat, profil singkat tempat, divisi magang, atau informasi bermanfaat lainnya..."
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary outline-none leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Titik Koordinat Peta */}
      <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <MapPin className="w-5 h-5 text-primary-dark" />
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              3. Titik Koordinat Lokasi
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Tentukan posisi lokasi magang dengan mengklik peta atau menggeser pin penanda.
            </p>
          </div>
        </div>

        <DynamicLocationPickerMap
          latitude={coords.latitude}
          longitude={coords.longitude}
          onChange={(newCoords) => setCoords(newCoords)}
        />

        <div className="grid grid-cols-2 gap-4 pt-1">
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/50">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Latitude</span>
            <p className="text-xs font-mono font-semibold text-neutral-800 dark:text-neutral-200">
              {coords.latitude.toFixed(6)}
            </p>
          </div>
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/50">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Longitude</span>
            <p className="text-xs font-mono font-semibold text-neutral-800 dark:text-neutral-200">
              {coords.longitude.toFixed(6)}
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Foto Lokasi */}
      <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <Upload className="w-5 h-5 text-primary-dark" />
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            4. Unggah Foto Tempat Magang
          </h3>
        </div>

        <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl p-6 text-center hover:border-primary transition bg-neutral-50/50 dark:bg-neutral-800/30">
          <input
            type="file"
            id="images-input"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="images-input" className="cursor-pointer flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 text-neutral-900 dark:text-primary-300 flex items-center justify-center mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
              Pilih Foto atau Seret ke Sini
            </span>
            <span className="text-[11px] text-neutral-400 mt-1">
              Mendukung PNG, JPG, JPEG (dapat memilih lebih dari 1 foto)
            </span>
          </label>
        </div>

        {previewUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {previewUrls.map((url, idx) => (
              <div
                key={idx}
                className="relative group rounded-xl overflow-hidden aspect-video bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs"
              >
                <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1.5 right-1.5 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 px-6 bg-primary text-neutral-900 font-extrabold rounded-2xl text-sm hover:bg-primary-dark transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Kirim Formulir Pengajuan Lokasi</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}

