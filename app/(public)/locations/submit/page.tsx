import Link from 'next/link'
import { verifySignedSubmission } from '@/lib/signed-url'
import { getCategories } from '@/lib/actions/categories'
import { getFaculties } from '@/lib/actions/faculties'
import { LocationSubmissionForm } from '@/components/public/LocationSubmissionForm'
import { AlertOctagon, ArrowLeft } from 'lucide-react'

interface SubmitPageProps {
  searchParams: Promise<{
    action?: string
    expires?: string
    signature?: string
  }>
}

export default async function SubmitLocationPage(props: SubmitPageProps) {
  const searchParams = await props.searchParams
  const { action, expires, signature } = searchParams

  const verification = verifySignedSubmission(action, expires, signature)

  if (!verification.valid) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-neutral-900 rounded-3xl shadow-xl border border-neutral-200 dark:border-neutral-800 text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
          <AlertOctagon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
          Akses Tautan Tidak Sah
        </h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
          {verification.reason ||
            'Tautan pengajuan data lokasi ini tidak valid atau telah melewati batas waktu 24 jam.'}
        </p>
        <div className="space-y-2">
          <p className="text-[11px] text-neutral-400">
            Silakan hubungi administrator kampus Anda untuk meminta tautan pengajuan yang baru.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold rounded-xl text-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Halaman Utama</span>
          </Link>
        </div>
      </div>
    )
  }

  const [categories, faculties] = await Promise.all([
    getCategories(),
    getFaculties(),
  ])

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 w-full">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-medium mb-3 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Peta</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Formulir Pendataan Lokasi Magang
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
          Lengkapi data tempat magang Anda secara akurat agar dapat diverifikasi oleh pihak kampus dan ditampilkan di peta titik magang.
        </p>
      </div>

      <LocationSubmissionForm categories={categories} faculties={faculties} />
    </div>
  )
}

