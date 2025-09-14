// app/map/_components/map/petmap-component.js
'use client'
import { useEffect, useRef , useCallback} from 'react'
import L from 'leaflet'
import { DEFAULT_MAP_STYLE } from '@/app/map/_components/map/maptile-styles'
import { createCustomIcon, createUserLocationIcon } from '@/app/map/_components/map/map-markers'
import { usePlaceCategories } from '@/app/map/_components/hooks/use-place-categories'

const EPS = 1e-6
const eq = (a, b) => Math.abs(a - b) < EPS
const isSameLL = (a, b) => !!a && !!b && eq(a.lat, b.lat) && eq(a.lng, b.lng)

export default function PetMapComponent({
  places = [],
  selectedPlace = null,
  userLocation = null,
  routeProfile = 'driving',
  onPlaceSelect,
  onMapMove,
  onLocationUpdate,
  selectedCategories = [],
}) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersLayerRef = useRef(null)
  const routeLayerRef = useRef(null)
  const userMarkerRef = useRef(null)
  const firstFitDoneRef = useRef(false)

  // 🔧 獲取類別資料來做 ID/名稱轉換
  const { getCategoryById } = usePlaceCategories()

  // 最新回呼存 ref，避免 effect re-bind
  const onMapMoveRef = useRef(onMapMove)
  const onLocationUpdateRef = useRef(onLocationUpdate)
  useEffect(() => { onMapMoveRef.current = onMapMove }, [onMapMove])
  useEffect(() => { onLocationUpdateRef.current = onLocationUpdate }, [onLocationUpdate])

  // 🔧 提取地點的所有類別名稱（與 MapSearchPage 保持一致）
  const extractCategoryNames = (p) => {
    const names = []
    
    // 基本類別欄位
    if (p?.category) {
      const cat = typeof p.category === 'string' ? p.category : p.category?.name
      if (cat) names.push(String(cat))
    }
    if (p?.categoryName) names.push(String(p.categoryName))
    
    // categories 陣列
    if (Array.isArray(p?.categories)) {
      p.categories.forEach(c => {
        if (typeof c === 'string' && c) {
          names.push(c)
        } else if (c?.name) {
          names.push(String(c.name))
        } else if (c?.label) {
          names.push(String(c.label))
        }
      })
    }
    
    // 其他可能的類別欄位
    if (p?.place_category?.name) names.push(String(p.place_category.name))
    if (Array.isArray(p?.place_categories)) {
      p.place_categories.forEach(c => {
        const name = typeof c === 'string' ? c : c?.name
        if (name) names.push(String(name))
      })
    }
    
    // 關聯表資料
    if (Array.isArray(p?.place_category_relations)) {
      p.place_category_relations.forEach(rel => {
        if (rel?.categories?.name) names.push(String(rel.categories.name))
        if (rel?.category?.name) names.push(String(rel.category.name))
      })
    }
    
    // 去重並過濾空值
    return [...new Set(names.filter(Boolean))]
  }

  // 🔧 根據選中的類別來決定標記顏色
const getMarkerCategoryForDisplay = useCallback((place) => {
  const placeCategories = extractCategoryNames(place)

  if (selectedCategories.length === 0) {
    return placeCategories[0] || '未分類'
  }

  const selectedCategoryNames = selectedCategories.map((c) => {
    const num = Number(c)
    if (Number.isFinite(num)) {
      const category = getCategoryById(num)
      return category?.name || String(c)
    }
    return String(c)
  }).filter(Boolean)

  for (const selectedName of selectedCategoryNames) {
    if (placeCategories.some(placeCat => String(placeCat) === String(selectedName))) {
      return selectedName
    }
  }
  
  return placeCategories[0] || '未分類'
}, [selectedCategories, getCategoryById])


  // 初始化地圖
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return
    
    const map = L.map(containerRef.current, {
      center: [25.033, 121.5654],
      zoom: 13,
      zoomControl: false,
      attributionControl: true,
    })

    // 白色底圖（CartoDB Positron）
    const base = DEFAULT_MAP_STYLE
    L.tileLayer(base.url, { maxZoom: 19, attribution: base.attribution }).addTo(map)

    // 兩個 LayerGroup：一個放 pins、一個放路線
    const markers = L.layerGroup().addTo(map)
    const route = L.layerGroup().addTo(map)

    // 地圖移動事件：只在中心改變時回報
    let lastCenter = null
    const handleMoveEnd = () => {
      const c = map.getCenter()
      const now = { lat: c.lat, lng: c.lng }
      if (!lastCenter || !isSameLL(lastCenter, now)) {
        lastCenter = now
        onMapMoveRef.current?.(now)
      }
    }
    map.on('moveend', handleMoveEnd)

    // 對外提供清除路線
    window.clearCurrentRoute = () => {
      route.clearLayers()
    }

    mapRef.current = map
    markersLayerRef.current = markers
    routeLayerRef.current = route

    return () => {
      map.off('moveend', handleMoveEnd)
      map.remove()
      mapRef.current = null
      markersLayerRef.current = null
      routeLayerRef.current = null
      window.clearCurrentRoute = undefined
    }
  }, [])

  // 使用者定位：生成/更新小藍點
  const lastUserRef = useRef(null)
  useEffect(() => {
    const map = mapRef.current
    if (!map || !userLocation) {
      return
    }

    const loc = userLocation
    const icon = createUserLocationIcon()

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker([loc.lat, loc.lng], { icon }).addTo(map)
    } else {
      userMarkerRef.current.setLatLng([loc.lat, loc.lng])
    }

    if (!lastUserRef.current || !isSameLL(lastUserRef.current, loc)) {
      lastUserRef.current = loc
      onLocationUpdateRef.current?.(loc)
      if (!firstFitDoneRef.current) {
        firstFitDoneRef.current = true
        map.setView([loc.lat, loc.lng], Math.max(map.getZoom(), 13), { animate: false })
      }
    }
  }, [userLocation])

  // 🔧 pins：根據選中類別決定標記顏色，並且依賴 selectedCategories
  useEffect(() => {
    const map = mapRef.current
    const layer = markersLayerRef.current
    if (!map || !layer) return
    layer.clearLayers()

    places.forEach((p) => {
      const lat = Number(p.latitude ?? p.lat)
      const lng = Number(p.longitude ?? p.lng)
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return
      }

      // 🔧 使用新的邏輯決定標記顏色
      const categoryForIcon = getMarkerCategoryForDisplay(p)
      const icon = createCustomIcon(categoryForIcon)
      const m = L.marker([lat, lng], { icon })
      m.on('click', () => {
        onPlaceSelect?.(p)
      })
      m.addTo(layer)
    })
    
  }, [places, onPlaceSelect, selectedCategories, getCategoryById,getMarkerCategoryForDisplay]) // 🔧 新增 selectedCategories 依賴

  // 選中的地點：聚焦
  const lastSelectedRef = useRef(null)
  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedPlace) {
      return
    }
    
    const lat = Number(selectedPlace.latitude ?? selectedPlace.lat)
    const lng = Number(selectedPlace.longitude ?? selectedPlace.lng)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return
    }

    const loc = { lat, lng }
    if (!isSameLL(lastSelectedRef.current, loc)) {
      lastSelectedRef.current = loc
      map.setView([lat, lng], Math.max(map.getZoom(), 15), { animate: true })
    }
  }, [selectedPlace])

  // 🔍 路線繪製：加強調試
  const lastRouteKeyRef = useRef('')
  useEffect(() => {
    
    const map = mapRef.current
    const routeLayer = routeLayerRef.current
    if (!map || !routeLayer) {
      return
    }
    routeLayer.clearLayers()

    const u = userLocation
    const s = selectedPlace
    const lat = Number(s?.latitude ?? s?.lat)
    const lng = Number(s?.longitude ?? s?.lng)

    if (!u || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      return
    }

    const key = `${u.lat},${u.lng}->${lat},${lng}:${routeProfile}`
    
    if (lastRouteKeyRef.current === key) {
      return
    }
    
    lastRouteKeyRef.current = key

    const profile = routeProfile === 'walking' ? 'walking' : 'driving'
    const url = `https://router.project-osrm.org/route/v1/${profile}/${u.lng},${u.lat};${lng},${lat}?overview=full&geometries=geojson`


    ;(async () => {
      try {
        const res = await fetch(url)
        
        if (!res.ok) throw new Error(`OSRM ${res.status}`)
        
        const data = await res.json()
        
        const coords = data.routes?.[0]?.geometry?.coordinates
        
        if (Array.isArray(coords) && coords.length) {
          const latlngs = coords.map(([x, y]) => [y, x])
          const polyline = L.polyline(latlngs, { weight: 5, opacity: 0.9, color: '#EE5A36' })
          polyline.addTo(routeLayer)
          
          const bounds = L.latLngBounds(latlngs).pad(0.2)
          map.fitBounds(bounds)
          
          return
        }
        throw new Error('no geometry')
      } catch (e) {
        
        // 失敗就畫直線 fallback
        const line = L.polyline(
          [
            [u.lat, u.lng],
            [lat, lng],
          ],
          { weight: 5, dashArray: '6,6', color: '#FF6B6B' }
        )
        line.addTo(routeLayer)
        map.fitBounds(line.getBounds().pad(0.2))
        
      }
    })()
  }, [userLocation, selectedPlace, routeProfile])

  // 🌍 暴露全局導航函數
  useEffect(() => {
    window.triggerNavigation = (profile = 'driving') => {      
      const map = mapRef.current
      const routeLayer = routeLayerRef.current
      const u = userLocation
      const s = selectedPlace
      
      if (!map || !routeLayer || !u || !s) {
        return
      }
      
      const lat = Number(s.latitude ?? s.lat)
      const lng = Number(s.longitude ?? s.lng)
      
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return
      }
    
      routeLayer.clearLayers()
      
      const profileType = profile === 'walking' ? 'walking' : 'driving'
      const url = `https://router.project-osrm.org/route/v1/${profileType}/${u.lng},${u.lat};${lng},${lat}?overview=full&geometries=geojson`
      
      // 使用測試成功的邏輯
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`OSRM ${res.status}`)
          return res.json()
        })
        .then(data => {
          const coords = data.routes?.[0]?.geometry?.coordinates
          if (Array.isArray(coords) && coords.length) {
            const latlngs = coords.map(([x, y]) => [y, x])
            
            const polyline = L.polyline(latlngs, { 
              weight: 5, 
              opacity: 0.9, 
              color: profile === 'walking' ? '#4CAF50' : '#EE5A36',
              lineCap: 'round',
              lineJoin: 'round'
            })
            polyline.addTo(routeLayer)
            
            map.fitBounds(L.latLngBounds(latlngs).pad(0.1))
            
            // 添加路線信息
            // const route = data.routes[0]
            // const distance = (route.distance / 1000).toFixed(1)
            // const duration = Math.round(route.duration / 60)
          }
        })
        .catch(() => {
          // 顯示直線備用路線
          const line = L.polyline(
            [[u.lat, u.lng], [lat, lng]],
            { 
              weight: 5, 
              dashArray: '8,4', 
              color: '#FF6B6B',
              opacity: 0.8
            }
          )
          line.addTo(routeLayer)
          map.fitBounds(line.getBounds().pad(0.2))
        })
    }
    
    return () => {
      window.triggerNavigation = undefined
    }
  }, [userLocation, selectedPlace])

  return <div ref={containerRef} className="w-full h-full" />
}