'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { LocationType } from '@/types'

interface InteractiveMapProps {
  locations: LocationType[]
  selectedLocation: LocationType | null
  onSelectLocation: (loc: LocationType) => void
  center?: [number, number]
  zoom?: number
}

export default function InteractiveMap({
  locations,
  selectedLocation,
  onSelectLocation,
  center = [-8.65, 115.22], // Default Bali / Indonesia
  zoom = 12,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [id: number]: L.Marker }>({})

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
    }).setView(center, zoom)

    L.control.zoom({ position: 'topright' }).addTo(map)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    mapInstanceRef.current = map

    // Memaksa Leaflet recalculate ukuran container agar peta muncul
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 100)

    return () => {
      clearTimeout(timer)
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // 2. Create custom marker icon
  const createCustomIcon = (isSelected: boolean) => {
    return L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div class="relative flex items-center justify-center transform -translate-x-1/2 -translate-y-full transition-transform hover:scale-110 ${
          isSelected ? 'scale-125 z-50' : ''
        }">
          <div class="w-8 h-8 rounded-full ${
            isSelected
              ? 'bg-amber-500 ring-4 ring-amber-300'
              : 'bg-primary ring-2 ring-neutral-900/20'
          } shadow-lg flex items-center justify-center text-neutral-900">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div class="absolute -bottom-1 w-2 h-2 rotate-45 ${
            isSelected ? 'bg-amber-500' : 'bg-primary'
          }"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    })
  }

  // 3. Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    Object.values(markersRef.current).forEach((marker) => marker.remove())
    markersRef.current = {}

    const bounds = L.latLngBounds([])

    locations.forEach((loc) => {
      if (typeof loc.latitude !== 'number' || typeof loc.longitude !== 'number')
        return

      const isSelected = selectedLocation?.id_location === loc.id_location
      const marker = L.marker([loc.latitude, loc.longitude], {
        icon: createCustomIcon(isSelected),
      }).addTo(map)

      marker.on('click', () => {
        onSelectLocation(loc)
      })

      marker.bindTooltip(loc.name_location, {
        direction: 'top',
        offset: [0, -28],
        opacity: 0.9,
      })

      markersRef.current[loc.id_location] = marker
      bounds.extend([loc.latitude, loc.longitude])
    })

    if (locations.length > 0 && !selectedLocation && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
    }
  }, [locations])

  // 4. Fly to selected location
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !selectedLocation) return

    map.flyTo([selectedLocation.latitude, selectedLocation.longitude], 16, {
      duration: 1.2,
    })

    Object.entries(markersRef.current).forEach(([idStr, marker]) => {
      const isSelected = Number(idStr) === selectedLocation.id_location
      marker.setIcon(createCustomIcon(isSelected))
    })
  }, [selectedLocation])

  return (
    <div className="absolute inset-0 w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  )
}