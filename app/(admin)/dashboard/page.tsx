import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCategories } from '@/lib/actions/categories'
import CategoryChart from '@/components/charts/CategoryChart'
import {
  MapPin,
  Clock,
  FolderKanban,
  GraduationCap,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react'

export const revalidate = 0

export default async function DashboardPage() {
  const [
    totalApproved,
    totalPending,
    totalCategories,
    totalDepartments,
    categories,
    recentLocations,
  ] = await Promise.all([
    prisma.location.count({ where: { approved_at: { not: null } } }),
    prisma.location.count({ where: { approved_at: null } }),
    prisma.category.count(),
    prisma.department.count(),
    getCategories(),
    prisma.location.findMany({
      take: 6,
      orderBy: { created_at: 'desc' },
      include: {
        category: true,
        department: true,
      },
    }),
  ])

  const stats = [
    {
      title: 'Lokasi Disetujui',
      value: totalApproved,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
    },
    {
      title: 'Menunggu Persetujuan',
      value: totalPending,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
    },
    {
      title: 'Total Kategori',
      value: totalCategories,
      icon: FolderKanban,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
    },
    {
      title: 'Total Jurusan',
      value: totalDepartments,
      icon: GraduationCap,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Ringkasan Dashboard
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Pantau statistik persebaran lokasi magang mahasiswa dan aktivitas terkini.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div
              key={i}
              className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  {stat.title}
                </span>
                <p className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts & Recent Submissions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                Distribusi Kategori Magang
              </h2>
              <p className="text-xs text-neutral-400">
                Jumlah titik magang yang terdaftar berdasarkan bidang kategori
              </p>
            </div>
          </div>
          <CategoryChart categories={categories} />
        </div>

        {/* Recent Locations List */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">
              Pengajuan Terbaru
            </h2>
            <Link
              href="/locations"
              className="text-xs font-semibold text-primary-dark hover:underline flex items-center gap-1"
            >
              Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {recentLocations.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-xs text-neutral-400">
                Belum ada pengajuan lokasi.
              </div>
            ) : (
              recentLocations.map((loc) => {
                const isApproved = loc.approved_at !== null
                return (
                  <div
                    key={Number(loc.id_location)}
                    className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-100 dark:border-neutral-700/50 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 truncate">
                      <p className="font-bold text-neutral-900 dark:text-white truncate">
                        {loc.name_location}
                      </p>
                      <p className="text-neutral-500 dark:text-neutral-400 text-[11px] truncate">
                        {loc.student_name} &bull; {loc.nim}
                      </p>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-[10px] text-neutral-700 dark:text-neutral-300 font-medium">
                        {loc.category?.name_category || 'Umum'}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                      }`}
                    >
                      {isApproved ? 'Disetujui' : 'Menunggu'}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

