'use client'

import { useState, useCallback } from 'react'
import { useMapEvents } from 'react-leaflet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBan,                    // 清除 / 禁止
  faMagnifyingGlassLocation // 在此區域搜尋
} from '@fortawesome/free-solid-svg-icons'

// 清除路線按鈕
export function ClearRouteControl({ isNavigating = false }) {
  if (isNavigating) return null
  return (
    <div className="absolute bottom-36 right-4 z-[1000]">
      <button
        type="button"
        onClick={() => window.leafletMapInstance?.clearRoute?.()}
        className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors bg-red-500 text-white hover:bg-red-600"
        title="清除路線"
        aria-label="清除路線"
      >
        <FontAwesomeIcon icon={faBan} className="w-5 h-5" />
      </button>
    </div>
  )
}

// 地圖移動事件處理 + 「在此區域搜尋」按鈕
export function MapEventsControl({ onMapMove, onSearchHere, isNavigating = false }) {
  const [showBtn, setShowBtn] = useState(false)

  useMapEvents({
    moveend: (ev) => {
      const c = ev.target.getCenter()
      onMapMove?.([c.lat, c.lng])
      setShowBtn(true)
    },
  })

  const handleSearchHere = useCallback(() => {
    const map = window.leafletMapInstance?.map
    if (!map) return
    const c = map.getCenter()
    onSearchHere?.([c.lat, c.lng])
    setShowBtn(false)
  }, [onSearchHere])

  if (isNavigating || !showBtn) return null

  return (
    <div className="absolute bottom-4 right-4 z-[1000]">
      <button
        type="button"
        onClick={handleSearchHere}
        className="bg-[#EE5A36] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#d54a2e] transition-colors font-medium flex items-center gap-2"
        aria-label="在此區域搜尋"
      >
        <FontAwesomeIcon icon={faMagnifyingGlassLocation} className="w-4 h-4" />
        在此區域搜尋
      </button>
    </div>
  )
}

// 組合
export default function MapControls({ onMapMove, onSearchHere, isNavigating = false }) {
  return (
    <>
      <ClearRouteControl isNavigating={isNavigating} />
      <MapEventsControl
        onMapMove={onMapMove}
        onSearchHere={onSearchHere}
        isNavigating={isNavigating}
      />
    </>
  )
}