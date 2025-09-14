// hooks/use-navigationdata.js
'use client'

import { useState, useCallback } from 'react'

// 將 profile 正規化成 OSRM/內部一致的值
function normalizeProfile(p = 'driving') {
  const s = String(p || '').toLowerCase()
  if (s === 'walking' || s === 'walk' || s === 'foot') return 'walking'
  if (s === 'cycling' || s === 'bike' || s === 'bicycle') return 'cycling'
  return 'driving'
}

// 導航資料 Hook
export function useNavigationData() {
  const [routeInfo, setRouteInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // 直線距離（km）
  const calculateDistance = useCallback((from, to) => {
    if (!from || !to) return 0
    const R = 6371
    const dLat = ((Number(to.lat) - Number(from.lat)) * Math.PI) / 180
    const dLng = ((Number(to.lng) - Number(from.lng)) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((Number(from.lat) * Math.PI) / 180) *
        Math.cos((Number(to.lat) * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }, [])

  // 估算時間（分鐘）
  const estimateDuration = useCallback((distanceKm, profile) => {
    const speedsKmh = { driving: 40, walking: 5, cycling: 15 }
    const p = normalizeProfile(profile)
    const speed = speedsKmh[p] ?? speedsKmh.driving
    return (Number(distanceKm || 0) / speed) * 60
  }, [])

  // 解碼 OSRM polyline（precision 5）
  const decodePolyline = useCallback((encoded) => {
    if (!encoded || typeof encoded !== 'string') return []
    const coords = []
    let index = 0, lat = 0, lng = 0
    try {
      while (index < encoded.length) {
        let b, shift = 0, result = 0
        do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20 && index < encoded.length)
        const dlat = (result & 1) ? ~(result >> 1) : (result >> 1)
        lat += dlat

        shift = 0; result = 0
        do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20 && index < encoded.length)
        const dlng = (result & 1) ? ~(result >> 1) : (result >> 1)
        lng += dlng

        const decodedLat = lat / 1e5
        const decodedLng = lng / 1e5
        if (decodedLat >= -90 && decodedLat <= 90 && decodedLng >= -180 && decodedLng <= 180) {
          coords.push([decodedLat, decodedLng]) // [lat, lng]
        }
      }
    } catch (e) {
      console.error('decodePolyline error:', e)
      return []
    }
    return coords
  }, [])

  // fetch with timeout
  const fetchWithTimeout = useCallback(async (url, ms = 15000) => {
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), ms)
    try {
      const res = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } })
      return res
    } finally {
      clearTimeout(t)
    }
  }, [])

  // 取 OSRM 路線（含幾何）
  const fetchOSRMRoute = useCallback(async (from, to, profile) => {
    const p = normalizeProfile(profile)
    const url =
      `https://router.project-osrm.org/route/v1/${p}/` +
      `${Number(from.lng)},${Number(from.lat)};${Number(to.lng)},${Number(to.lat)}` +
      `?overview=full&alternatives=false&steps=false&geometries=polyline`

    try {
      const response = await fetchWithTimeout(url, 15000)
      if (!response.ok) throw new Error(`OSRM ${response.status} ${response.statusText}`)
      const data = await response.json()
      if (data.code !== 'Ok' || !Array.isArray(data.routes) || data.routes.length === 0) return null

      const r = data.routes[0]
      const distanceKm = (r.distance ?? 0) / 1000
      const durationMin = (r.duration ?? 0) / 60

      // 幾何
      let coordinates = []
      if (r.geometry) {
        coordinates = decodePolyline(r.geometry)
        if (coordinates.length < 2) coordinates = [[from.lat, from.lng], [to.lat, to.lng]]
      } else {
        coordinates = [[from.lat, from.lng], [to.lat, to.lng]]
      }

      // 主 profile（用正規化後的 key）
      const result = {
        [p]: {
          distance: distanceKm,
          duration: durationMin,
          coordinates,
          geometry: r.geometry,
        },
      }

      // 其他 profile：用同距離 + 不同速度估時；座標用直線
      ;['driving', 'walking', 'cycling'].forEach((other) => {
        if (other === p) return
        result[other] = {
          distance: distanceKm,
          duration: estimateDuration(distanceKm, other),
          coordinates: [[from.lat, from.lng], [to.lat, to.lng]],
        }
      })

      return result
    } catch (e) {
      console.warn('OSRM fetch failed:', e?.message || e)
      return null
    }
  }, [decodePolyline, estimateDuration, fetchWithTimeout])

  // 失敗 fallback（直線）
  const calculateFallbackRoute = useCallback((from, to) => {
    const distance = calculateDistance(from, to)
    const line = [[from.lat, from.lng], [to.lat, to.lng]]
    return {
      driving: { distance, duration: estimateDuration(distance, 'driving'), coordinates: line },
      walking: { distance, duration: estimateDuration(distance, 'walking'), coordinates: line },
      cycling: { distance, duration: estimateDuration(distance, 'cycling'), coordinates: line },
    }
  }, [calculateDistance, estimateDuration])

  // 主要 API：抓路線並更新狀態
  const fetchRoute = useCallback(async ({ from, to, profile = 'driving' }) => {
    if (!from?.lat || !from?.lng || !to?.lat || !to?.lng) {
      console.warn('fetchRoute: invalid coordinates', { from, to })
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetchOSRMRoute(from, to, profile)
      if (res) {
        setRouteInfo(res)
        return res
      }
      const fb = calculateFallbackRoute(from, to)
      setRouteInfo(fb)
      return fb
    } catch (err) {
      setError(err?.message || '路線取得失敗')
      const fb = calculateFallbackRoute(from, to)
      setRouteInfo(fb)
      return fb
    } finally {
      setIsLoading(false)
    }
  }, [fetchOSRMRoute, calculateFallbackRoute])

  // 清除
  const clearRoute = useCallback(() => {
    setRouteInfo(null)
    setError(null)
  }, [])

  return {
    routeInfo,     // { driving, walking, cycling }
    isLoading,
    error,
    fetchRoute,    // async ({ from:{lat,lng}, to:{lat,lng}, profile:'driving'|'walking'|'cycling' })
    clearRoute,
  }
}

// 使用者位置 Hook
export function useUserLocation() {
  const [location, setLocation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('此瀏覽器不支援定位功能')
      return
    }
    setIsLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        })
        setIsLoading(false)
      },
      (err) => {
        let msg = '無法取得位置'
        if (err?.code === 1) msg = '位置存取被拒絕'
        else if (err?.code === 2) msg = '位置資訊無法取得'
        else if (err?.code === 3) msg = '位置請求逾時'
        setError(msg)
        setIsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }, [])

  return { location, isLoading, error, getCurrentLocation }
}
