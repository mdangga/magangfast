'use client'

import { useState, useMemo } from 'react'
import { LocationType, CategoryType } from '@/types'
import { DynamicInteractiveMap } from '@/components/map/MapWrapper'
import { LocationDetailSidebar } from './LocationDetailSidebar'
import { Search, Filter, MapPin, X } from 'lucide-react'

interface WebGisViewProps {
  initialLocations: LocationType[]
  categories: CategoryType[]
}

export function WebGisView({
  initialLocations,
  categories,
}: WebGisViewProps) {
  const [locations] = useState<LocationType[]>(initialLocations)
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
  const [filterOpen, setFilterOpen] = useState(false)

  // Category toggle
  const toggleCategory = (id: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    )
  }

  // Filtered locations
  const filteredLocations = useMemo(() => {
    let result = locations

    if (selectedCategoryIds.length > 0) {
      result = result.filter(
        (loc) => loc.id_category && selectedCategoryIds.includes(loc.id_category)
      )
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (loc) =>
          loc.name_location.toLowerCase().includes(q) ||
          loc.description.toLowerCase().includes(q) ||
          loc.category?.name_category.toLowerCase().includes(q) ||
          loc.student_name.toLowerCase().includes(q)
      )
    }

    return result
  }, [locations, selectedCategoryIds, searchQuery])

  // Autocomplete suggestions
  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return []
    const q = searchQuery.toLowerCase().trim()
    return locations
      .filter((loc) => loc.name_location.toLowerCase().includes(q))
      .slice(0, 5)
  }, [locations, searchQuery])

  return (
    <div className="relative w-full flex-1 h-[calc(100vh-4rem)] overflow-hidden">
      {/* Map */}
      <DynamicInteractiveMap
        locations={filteredLocations}
        selectedLocation={selectedLocation}
        onSelectLocation={(loc) => setSelectedLocation(loc)}
      />

      {/* Top Search & Filter Floating Bar */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2 max-w-sm sm:max-w-md w-full pointer-events-none">
        <div className="w-full flex items-center gap-2 pointer-events-auto">
          {/* Search box */}
          <div className="relative flex-1 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-1 flex items-center">
            <Search className="w-4 h-4 text-neutral-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tempat, perusahaan, nama..."
              className="w-full bg-transparent px-3 py-1.5 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 mr-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter button */}
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`p-2.5 rounded-2xl shadow-xl border backdrop-blur-md transition flex items-center gap-1.5 text-xs font-semibold shrink-0 pointer-events-auto ${
              selectedCategoryIds.length > 0
                ? 'bg-primary text-neutral-900 border-primary-dark'
                : 'bg-white/90 dark:bg-neutral-900/90 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-800'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Kategori</span>
            {selectedCategoryIds.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center font-bold">
                {selectedCategoryIds.length}
              </span>
            )}
          </button>
        </div>

        {/* Autocomplete Dropdown */}
        {suggestions.length > 0 && (
          <div className="w-full bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 py-1 z-30 pointer-events-auto animate-fadeIn">
            {suggestions.map((loc) => (
              <button
                key={loc.id_location}
                onClick={() => {
                  setSelectedLocation(loc)
                  setSearchQuery(loc.name_location)
                }}
                className="w-full px-3 py-2 text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 transition"
              >
                <MapPin className="w-3.5 h-3.5 text-primary-dark shrink-0" />
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {loc.name_location}
                </span>
                <span className="text-neutral-400 text-[10px] truncate ml-auto">
                  {loc.category?.name_category}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Filter categories popup / popover */}
        {filterOpen && (
          <div className="w-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-4 z-30 pointer-events-auto animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                Filter Berdasarkan Kategori
              </span>
              {selectedCategoryIds.length > 0 && (
                <button
                  onClick={() => setSelectedCategoryIds([])}
                  className="text-[11px] text-red-500 hover:underline font-semibold"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
              {categories.map((c) => {
                const isSelected = selectedCategoryIds.includes(c.id_category)
                return (
                  <button
                    key={c.id_category}
                    onClick={() => toggleCategory(c.id_category)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition ${
                      isSelected
                        ? 'bg-primary text-neutral-900 font-bold shadow-xs'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {c.name_category}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Counter summary badge */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
        <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-md text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            {filteredLocations.length} titik magang ditampilkan
          </span>
        </div>
      </div>

      {/* Selected Location Details Sidebar */}
      <LocationDetailSidebar
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />
    </div>
  )
}

