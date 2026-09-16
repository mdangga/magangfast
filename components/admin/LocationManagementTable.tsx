'use client'

import { useState, useMemo, useTransition } from 'react'
import { LocationType } from '@/types'
import {
  approveLocationAction,
  deleteLocationAction,
  generateSignedLinkAction,
} from '@/lib/actions/locations'
import { AdminLocationDetailModal } from './AdminLocationDetailModal'
import { QrCodeModal } from '@/components/shared/QrCodeModal'
import { ModalDelete } from '@/components/ui/modal-delete'
import {
  Search,
  QrCode,
  CheckCircle2,
  Trash2,
  Eye,
  Clock,
  Filter,
  MapPin,
} from 'lucide-react'
import { toast } from 'sonner'

interface LocationManagementTableProps {
  initialLocations: LocationType[]
}

export function LocationManagementTable({
  initialLocations,
}: LocationManagementTableProps) {
  const [locations, setLocations] = useState<LocationType[]>(initialLocations)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all')

  // Modals state
  const [detailLocation, setDetailLocation] = useState<LocationType | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [signedLink, setSignedLink] = useState<string>('')
  const [qrModalOpen, setQrModalOpen] = useState(false)

  const [isPending, startTransition] = useTransition()

  // Generate signed link
  const handleGenerateLink = async () => {
    startTransition(async () => {
      const res = await generateSignedLinkAction()
      if (res.success && res.link) {
        setSignedLink(res.link)
        setQrModalOpen(true)
      } else {
        toast.error('Gagal membuat tautan signed submission.')
      }
    })
  }

  // Approve action
  const handleApprove = (id: number) => {
    startTransition(async () => {
      const res = await approveLocationAction(id)
      if (res.success) {
        toast.success('Lokasi berhasil disetujui!')
        setLocations((prev) =>
          prev.map((loc) =>
            loc.id_location === id ? { ...loc, approved_at: new Date() } : loc
          )
        )
      } else {
        toast.error(res.error || 'Gagal menyetujui lokasi.')
      }
    })
  }

  // Delete action
  const handleDelete = () => {
    if (!deleteTargetId) return
    startTransition(async () => {
      const res = await deleteLocationAction(deleteTargetId)
      if (res.success) {
        toast.success('Lokasi berhasil dihapus.')
        setLocations((prev) => prev.filter((loc) => loc.id_location !== deleteTargetId))
        setDeleteTargetId(null)
      } else {
        toast.error(res.error || 'Gagal menghapus lokasi.')
      }
    })
  }

  // Filtered rows
  const filteredRows = useMemo(() => {
    return locations.filter((loc) => {
      const matchesSearch =
        loc.name_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.nim.includes(searchQuery) ||
        (loc.category?.name_category &&
          loc.category.name_category.toLowerCase().includes(searchQuery.toLowerCase()))

      const isApproved = loc.approved_at !== null
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'approved' && isApproved) ||
        (statusFilter === 'pending' && !isApproved)

      return matchesSearch && matchesStatus
    })
  }, [locations, searchQuery, statusFilter])

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tempat, mahasiswa, NIM..."
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 p-1 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                statusFilter === 'all'
                  ? 'bg-neutral-100 dark:bg-neutral-800 font-bold text-neutral-900 dark:text-white'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Semua ({locations.length})
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                statusFilter === 'approved'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Disetujui
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                statusFilter === 'pending'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Menunggu
            </button>
          </div>
        </div>

        {/* Generate Link / QR Button */}
        <button
          type="button"
          onClick={handleGenerateLink}
          disabled={isPending}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-neutral-900 font-bold text-xs rounded-xl hover:bg-primary-dark transition shadow-sm shrink-0 disabled:opacity-50 cursor-pointer"
        >
          <QrCode className="w-4 h-4" />
          <span>Buat Tautan & QR Pengajuan</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Tempat / Perusahaan</th>
                <th className="py-3 px-4">Mahasiswa & NIM</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Jurusan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    Tidak ada data lokasi magang yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, idx) => {
                  const isApproved = row.approved_at !== null
                  return (
                    <tr
                      key={row.id_location}
                      className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 transition"
                    >
                      <td className="py-3 px-4 text-center font-mono text-neutral-400">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary-dark shrink-0" />
                          <span>{row.name_location}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                        <div>{row.student_name}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">{row.nim}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px] font-medium">
                          {row.category?.name_category || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                        {row.department?.name_department || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isApproved
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                          }`}
                        >
                          {isApproved ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Disetujui
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" /> Menunggu
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Detail */}
                          <button
                            title="Lihat Detail"
                            onClick={() => setDetailLocation(row)}
                            className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Approve (if pending) */}
                          {!isApproved && (
                            <button
                              title="Setujui Lokasi"
                              onClick={() => handleApprove(row.id_location)}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            title="Hapus Lokasi"
                            onClick={() => setDeleteTargetId(row.id_location)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AdminLocationDetailModal
        location={detailLocation}
        onClose={() => setDetailLocation(null)}
      />

      {/* QR Code Modal */}
      <QrCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        link={signedLink}
      />

      {/* Delete Confirmation Modal */}
      <ModalDelete
        isOpen={deleteTargetId !== null}
        isLoading={isPending}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Hapus Lokasi Magang"
        message="Apakah Anda yakin ingin menghapus titik magang ini beserta semua berkas foto yang terkait? Tindakan ini permanen."
      />
    </div>
  )
}

