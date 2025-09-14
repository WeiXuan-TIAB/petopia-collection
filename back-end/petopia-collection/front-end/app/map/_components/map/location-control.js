'use client'

import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationCrosshairs, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { getCurrentLocation, DEFAULT_LOCATION } from '@/app/map/_components/map/distance-calculation'

export default function LocationControl({ onLocationUpdate, isNavigating = false }) {
  const [locLoading, setLocLoading] = useState(false)

  const reCenter = useCallback(() => {
    if (isNavigating) return
    setLocLoading(true)
    getCurrentLocation(
      (locArr) => {
        onLocationUpdate?.({ lat: locArr[0], lng: locArr[1] }, locArr)
        setLocLoading(false)
      },
      () => {
        onLocationUpdate?.(
          { lat: DEFAULT_LOCATION[0], lng: DEFAULT_LOCATION[1] },
          DEFAULT_LOCATION
        )
        setLocLoading(false)
      }
    )
  }, [isNavigating, onLocationUpdate])

  if (isNavigating) return null

  return (
    <div className="absolute bottom-20 right-4 z-[1000]">
      <button
        type="button"
        onClick={reCenter}
        disabled={locLoading}
        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors ${
          locLoading ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
        title="重新定位"
        aria-label="重新定位"
      >
        {locLoading
          ? <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin" />
          : <FontAwesomeIcon icon={faLocationCrosshairs} className="w-5 h-5" />
        }
      </button>
    </div>
  )
}