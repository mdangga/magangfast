'use client'

import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { CategoryType } from '@/types'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-xl flex items-center justify-center text-xs text-neutral-400">
      Memuat Grafik...
    </div>
  ),
})

export default function CategoryChart({
  categories,
}: {
  categories: CategoryType[]
}) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const categoriesFiltered = categories.filter((c) => (c.locations_count || 0) > 0)
  const displayData = categoriesFiltered.length > 0 ? categoriesFiltered : categories.slice(0, 8)

  const series = [
    {
      name: 'Jumlah Lokasi Magang',
      data: displayData.map((c) => c.locations_count || 0),
    },
  ]

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'inherit',
      background: 'transparent',
    },
    colors: ['#FCDA37'],
    theme: {
      mode: isDark ? 'dark' : 'light',
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '45%',
        distributed: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: displayData.map((c) => c.name_category),
      labels: {
        style: {
          colors: isDark ? '#a3a3a3' : '#525252',
          fontSize: '11px',
        },
        rotate: -20,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark ? '#a3a3a3' : '#525252',
          fontSize: '11px',
        },
      },
    },
    grid: {
      borderColor: isDark ? '#262626' : '#f5f5f5',
      strokeDashArray: 4,
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      y: {
        formatter: (val) => `${val} Lokasi`,
      },
    },
  }

  return (
    <div className="w-full">
      <ReactApexChart options={options} series={series} type="bar" height={300} />
    </div>
  )
}

