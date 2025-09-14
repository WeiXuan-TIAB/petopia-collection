'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useMap } from 'react-leaflet'
import { showRouteInfo, showFallback } from './route-info'

// OSRM 節流控制
let lastPlanAt = 0
function allowPlanNow(minIntervalMs = 800) {
  const now = Date.now()
  if (now - lastPlanAt < minIntervalMs) return false
  lastPlanAt = now
  return true
}

// 把外部可能傳進來的 profile 做映射（walking -> foot）
function normalizeProfile(p) {
  if (!p) return 'driving'
  const s = String(p).toLowerCase()
  if (s === 'walking' || s === 'foot' || s === 'walk') return 'foot'
  return 'driving'
}

/** 導航處理組件（OSRM） */
export default function NavigationHandler({ routeProfile = 'driving' }) {
  const map = useMap()
  const routingRef = useRef(null)
  const profileRef = useRef(normalizeProfile(routeProfile))
  const handlerRef = useRef(null)

  useEffect(() => {
    profileRef.current = normalizeProfile(routeProfile)
  }, [routeProfile])

  // 清除路線
  const clearRoute = useCallback(() => {
    try {
      if (routingRef.current) {
        map.removeControl(routingRef.current)
        routingRef.current = null
      }
      map.eachLayer((layer) => {
        if (layer && layer._routing) map.removeLayer(layer)
      })
    } catch (e) {
      console.debug('清除路線失敗:', e)
    }
  }, [map])

  // 建立路線
  const makeRoute = useCallback(
    async (from, to, placeName, address) => {
      try {
        if (!allowPlanNow()) return

        const { default: Leaf } = await import('leaflet')
        await import('leaflet-routing-machine')
        const L2 = Leaf

        // 移除既有路線
        if (routingRef.current) {
          try {
            map.removeControl(routingRef.current)
            routingRef.current = null
          } catch (e) {
            console.debug('移除舊路線失敗：', e)
          }
        }

        const rc = L2.Routing.control({
          waypoints: [L2.latLng(from.lat, from.lng), L2.latLng(to.lat, to.lng)],
          router: L2.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1',
            profile: profileRef.current, // 已被 normalize 成 'driving' or 'foot'
            timeout: 15000,
          }),
          addWaypoints: false,
          draggableWaypoints: false,
          routeWhileDragging: false,
          showAlternatives: false,
          fitSelectedRoutes: false,
          show: false,
          createMarker: (i, wp, n) => {
            if (i === 0) {
              return L2.marker(wp.latLng, { draggable: false, title: '您的位置' })
            }
            if (i === n - 1) {
              const m = L2.marker(wp.latLng, { draggable: false, title: placeName })
              m.bindPopup(`<b>${placeName ?? ''}</b><br>${address ?? ''}`)
              return m
            }
            return null
          },
          lineOptions: {
            styles: [
              { color: '#4285F4', weight: 8, opacity: 0.8 },
              { color: '#1A73E8', weight: 4, opacity: 1 },
            ],
          },
        })

        // 路線找到時
        rc.on('routesfound', (e) => {
          const route = e.routes?.[0]
          if (route) {
            const b = L2.latLngBounds([])
            route.coordinates.forEach((c) => b.extend([c.lat, c.lng]))
            map.fitBounds(b, {
              // 這邊的 padding 可視你的側欄寬度微調
              paddingTopLeft: [300, 80],
              paddingBottomRight: [80, 80],
              maxZoom: 16,
            })
            if (route.summary) showRouteInfo(route.summary, placeName)
          }
        })

        // 路線錯誤時
        rc.on('routingerror', (e) => {
          console.error('routingerror:', e)
          try {
            map.removeControl(rc)
          } catch (removeErr) {
            console.debug('removeControl() already removed or failed:', removeErr)
          }
          const dest = L2.marker([to.lat, to.lng]).addTo(map)
          dest.bindPopup(`<b>${placeName ?? ''}</b><br>${address ?? ''}`).openPopup()
          map.setView([to.lat, to.lng], 15)
          showFallback(placeName)
        })

        rc.addTo(map)
        routingRef.current = rc
      } catch (err) {
        console.error('建立路線失敗:', err)
        showFallback(placeName)
      }
    },
    [map]
  )

  // 事件處理（CustomEvent 入口）
  const onLeafletNavigation = useCallback(
    (event) => {
      const { destination } = event.detail || {}
      const { lat, lng, name, address, profile } = destination || {}
      if (typeof lat !== 'number' || typeof lng !== 'number') {
        console.error('無效座標:', destination)
        return
      }
      // 若外部帶了 profile，也做一次 normalize
      if (profile) profileRef.current = normalizeProfile(profile)

      const to = { lat, lng }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const from = { lat: pos.coords.latitude, lng: pos.coords.longitude }
            makeRoute(from, to, name, address)
          },
          () => {
            const c = map.getCenter()
            makeRoute({ lat: c.lat, lng: c.lng }, to, name, address)
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        )
      } else {
        const c = map.getCenter()
        makeRoute({ lat: c.lat, lng: c.lng }, to, name, address)
      }
    },
    [makeRoute, map]
  )

  // 更新 handler reference
  useEffect(() => {
    handlerRef.current = onLeafletNavigation
  }, [onLeafletNavigation])

  // 綁定全域 & 相容舊方法
  useEffect(() => {
    const bound = (e) => handlerRef.current?.(e)
    window.addEventListener('leafletNavigation', bound)

    // 新版 API
    const api = {
      map,
      navigateTo: (destination) => {
        // destination 可帶 { lat, lng, name, address, profile }
        bound({ detail: { destination } })
      },
      clearRoute,
    }
    window.leafletMapInstance = api

    // ✅ 舊版相容：calculateRouteToPlace / clearCurrentRoute
    window.calculateRouteToPlace = (placeWithProfile = {}) => {
      const {
        latitude, longitude, lat, lng, name, address, currentProfile,
      } = placeWithProfile

      // 支援 latitude/longitude 或 lat/lng
      const dest = {
        lat: Number(latitude ?? lat),
        lng: Number(longitude ?? lng),
        name,
        address,
        profile: currentProfile, // 可能是 'walking'，normalize 會處理
      }
      api.navigateTo(dest)
    }
    window.clearCurrentRoute = clearRoute

    return () => {
      window.removeEventListener('leafletNavigation', bound)
      clearRoute() // 卸載時清除
    }
  }, [map, clearRoute])

  return null
}