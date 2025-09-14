// components/map/DistanceCalculation.js
// 地圖距離/篩選工具（強化版）
// - 內部一律以「公尺」運算與排序，比較穩定
// - 同時提供 Km 包裝函式與漂亮的格式化
// - 兼容多種資料結構：{ latitude, longitude }、{ lat, lng }、position: [lat, lng]
// - 分類篩選同時支援 place.category 與 place.categories（字串或物件）

/**
 * @typedef {Object} LatLngObj
 * @property {number} latitude
 * @property {number} longitude
 */

/** 安全數字轉換 */
const toNum = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

/** 從地點物件撈出座標（支援多種寫法） */
export function extractLatLng(source) {
  if (!source) return null
  // 1) position: [lat, lng]
  if (Array.isArray(source.position) && source.position.length >= 2) {
    const lat = toNum(source.position[0])
    const lng = toNum(source.position[1])
    return lat != null && lng != null ? { latitude: lat, longitude: lng } : null
  }
  // 2) { lat, lng }
  if (toNum(source.lat) != null && toNum(source.lng) != null) {
    return { latitude: toNum(source.lat), longitude: toNum(source.lng) }
  }
  // 3) { latitude, longitude }
  if (toNum(source.latitude) != null && toNum(source.longitude) != null) {
    return { latitude: toNum(source.latitude), longitude: toNum(source.longitude) }
  }
  return null
}

/**
 * 使用 Haversine 公式計算地球表面兩點間距離（單位：公尺）
 * @returns {number} meters
 */
export function haversineDistanceMeters(lat1, lon1, lat2, lon2) {
  const a1 = toNum(lat1), o1 = toNum(lon1), a2 = toNum(lat2), o2 = toNum(lon2)
  if ([a1, o1, a2, o2].some((v) => v == null)) return Number.POSITIVE_INFINITY

  const toRad = (deg) => (deg * Math.PI) / 180
  const R = 6371000 // 地球半徑（公尺）
  const dLat = toRad(a2 - a1)
  const dLon = toRad(o2 - o1)
  const s1 = Math.sin(dLat / 2)
  const s2 = Math.sin(dLon / 2)
  const a =
    s1 * s1 +
    Math.cos(toRad(a1)) * Math.cos(toRad(a2)) * s2 * s2

  return 2 * R * Math.asin(Math.sqrt(a))
}

/** Km 包裝（回傳公里數） */
export const calculateDistance = (lat1, lon1, lat2, lon2) =>
  haversineDistanceMeters(lat1, lon1, lat2, lon2) / 1000

/**
 * 距離格式化（自動切換 m / km）
 * @param {number} distanceInKm 距離（公里）
 * @returns {string}
 */
export function formatDistance(distanceInKm) {
  if (!Number.isFinite(distanceInKm)) return '--'
  if (distanceInKm < 1) return `${Math.round(distanceInKm * 1000)}m`
  return `${distanceInKm.toFixed(1)}km`
}

/**
 * 依使用者位置與最大距離篩選地點（支援多種資料結構）
 * @param {Array<Object>} places
 * @param {LatLngObj|number[]} userLocation  - {latitude, longitude} 或 [lat, lng]
 * @param {number} maxDistanceKm
 * @param {Array<string|number>} selectedCategories  類別（可空）
 * @returns {Array<Object>}  含 distance(公里) 欄位
 */
export function filterPlacesByDistance(
  places,
  userLocation,
  maxDistanceKm,
  selectedCategories = []
) {
  if (!Array.isArray(places) || places.length === 0) return []
  if (!userLocation) return []

  // 解析使用者位置
  let uLat, uLng
  if (Array.isArray(userLocation)) {
    uLat = toNum(userLocation[0])
    uLng = toNum(userLocation[1])
  } else {
    uLat = toNum(userLocation.latitude ?? userLocation.lat)
    uLng = toNum(userLocation.longitude ?? userLocation.lng)
  }
  if (uLat == null || uLng == null) return []

  const maxM = Number.isFinite(maxDistanceKm) ? maxDistanceKm * 1000 : Infinity
  const hasCategoryFilter = Array.isArray(selectedCategories) && selectedCategories.length > 0
  const catSet = hasCategoryFilter ? new Set(selectedCategories.map(String)) : null

  const withDistance = places.map((p) => {
    const c = extractLatLng(p)
    const meters = c
      ? haversineDistanceMeters(uLat, uLng, c.latitude, c.longitude)
      : Number.POSITIVE_INFINITY

    // 把 distance 以「公里」放進回傳（顯示方便），排序用 meters 才精準
    return { ...p, distance: meters / 1000, _meters: meters }
  })

  return withDistance
    .filter((p) => p._meters <= maxM)
    .filter((p) => {
      if (!hasCategoryFilter) return true
      // 支援 category（字串）或 categories（陣列/物件）
      const single = p.category ?? p.categoryName
      const list = Array.isArray(p.categories) ? p.categories : []
      const names = list.map((c) => (typeof c === 'string' ? c : c?.name ?? c)).filter(Boolean)
      const ids = list
        .map((c) => (typeof c === 'object' && c?.id != null ? String(c.id) : null))
        .filter(Boolean)

      const candidates = [
        ...names,
        ...ids,
        single && String(single),
      ].filter(Boolean)

      return candidates.some((v) => catSet.has(String(v)))
    })
    .sort((a, b) => a._meters - b._meters)
    .map((rest) => rest) // 清掉內部欄位
}

/** 距離篩選選項 */
export const DISTANCE_OPTIONS = [
  { value: 0.5, label: '500m 以內' },
  { value: 1,   label: '1km 以內'   },
  { value: 2,   label: '2km 以內'   },
  { value: 5,   label: '5km 以內'   },
  { value: 10,  label: '10km 以內'  },
]

/**
 * 取得目前位置（Promise 版）
 * @returns {Promise<[number, number]>} [lat, lng]
 */
export function getCurrentLocationAsync() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      return reject(new Error('瀏覽器不支援地理定位'))
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve([pos.coords.latitude, pos.coords.longitude]),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  })
}

/**
 * 取得目前位置（相容你原本的 callback 版）
 */
export function getCurrentLocation(onSuccess, onError) {
  getCurrentLocationAsync().then(onSuccess).catch((e) => {
    console.error('無法獲取位置:', e)
    onError?.(e)
  })
}

/** 預設位置（台北車站） */
export const DEFAULT_LOCATION = [25.0478, 121.5170]