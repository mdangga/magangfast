'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { Crosshair, MapPin } from 'lucide-react'

interface LocationPickerMapProps {
  latitude: number
  longitude: number
  onChange: (coords: { latitude: number; longitude: number }) => void
}

export default function LocationPickerMap({
  latitude,
  longitude,
  onChange,
}: LocationPickerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [gettingLocation, setGettingLocation] = useState(false)

  const defaultCenter: [number, number] = [
    latitude || -8.65,
    longitude || 115.22,
  ]

  const markerIcon = L.divIcon({
    className: 'custom-picker-pin',
    html: `
      <div class="relative flex items-center justify-center transform -translate-x-1/2 -translate-y-full">
        <div class="w-9 h-9 rounded-full bg-red-600 ring-4 ring-white shadow-xl flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div class="absolute -bottom-1 w-2.5 h-2.5 rotate-45 bg-red-600"></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  })

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
    }).setView(defaultCenter, 14)

    L.control.zoom({ position: 'topright' }).addTo(map)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)

    const marker = L.marker(defaultCenter, {
      draggable: true,
      icon: markerIcon,
    }).addTo(map)

    marker.on('dragend', () => {
      const pos = marker.getLatLng()
      onChange({ latitude: pos.lat, longitude: pos.lng })
    })

    map.on('click', (e) => {
      marker.setLatLng(e.latlng)
      onChange({ latitude: e.latlng.lat, longitude: e.latlng.lng })
    })

    mapInstanceRef.current = map
    markerRef.current = marker

    return () => {
      map.remove()
      mapInstanceRef.current = null
      markerRef.current = null
    }
  }, [])

  // Sync external coordinates changes
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      const currentPos = markerRef.current.getLatLng()
      if (currentPos.lat !== latitude || currentPos.lng !== longitude) {
        markerRef.current.setLatLng([latitude, longitude])
        mapInstanceRef.current.panTo([latitude, longitude])
      }
    }
  }, [latitude, longitude])

  // Get User's Geolocation
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung geolokasi.')
      return
    }

    setGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        onChange({ latitude: lat, longitude: lng })
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lng], 16)
          markerRef.current.setLatLng([lat, lng])
        }
        setGettingLocation(false)
      },
      (err) => {
        alert('Gagal mengambil lokasi: ' + err.message)
        setGettingLocation(false)
      },
      { enableHighAccuracy: true }
    )
  }

  return (
    <div className="relative w-full h-[360px] rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-700 shadow-sm">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Action Button for Current Location */}
      <div className="absolute bottom-4 right-4 z-20">
        <button
          type="button"
          onClick={handleCurrentLocation}
          disabled={gettingLocation}
          className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-lg shadow-md hover:bg-neutral-50 dark:hover:bg-neutral-700 text-xs font-semibold border border-neutral-200 dark:border-neutral-700 transition"
        >
          <Crosshair className={`w-4 h-4 text-primary-dark ${gettingLocation ? 'animate-spin' : ''}`} />
          {gettingLocation ? 'Mencari...' : 'Gunakan Lokasi Saya'}
        </button>
      </div>

      <div className="absolute top-3 left-3 z-20 pointer-events-none bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5 shadow-sm">
        <MapPin className="w-3.5 h-3.5 text-red-500" />
        Klik peta atau geser pin untuk menentukan titik
      </div>
    </div>
  )
}

