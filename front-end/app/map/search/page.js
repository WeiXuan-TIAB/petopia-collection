'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation' // 新增 Next.js 路由功能
import LocationControl from '@/app/map/_components/map/location-control'

/** 正確匯入 CardsSection（card/ 而不是 map/） */
import CardsSection from '@/app/map/_components/map/place-cards-section'
/** 只需要 getDefaultSort；不需要 sortConfig 也不需要 SortOptions 元件 */
import { getDefaultSort } from '@/app/map/_components/common/sort-config'

import PlaceDetailCard from '@/app/map/_components/map/placedetail-card'
import NavigationCard from '@/app/map/_components/map/navigation-card'
import CategoryFilterButtons from '@/app/map/_components/btn/category-button'
import IconButton from '@/app/map/_components/btn/icon-button'
import MapHamburgerButton from '@/app/map/_components/btn/maphamburger-button'

import { usePlacesData } from '@/app/map/_components/hooks/use-placesdata'
import { usePlaceCategories } from '@/app/map/_components/hooks/use-place-categories'
import { useRightbar } from '@/app/AppShell'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHeart,
  faMapMarkerAlt,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons'

const PetMapComponent = dynamic(
  () => import('@/app/map/_components/map/petmap-component'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F5AB54]" />
          <span className="text-gray-600">載入地圖中...</span>
        </div>
      </div>
    ),
  }
)

/* ---------- 小工具 ---------- */
function computeSidebarWidth() {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1280
  if (w >= 1536) return 575
  if (w >= 1280) return 480
  if (w >= 1024) return 420
  if (w >= 768) return 380
  return 320
}

function haversineKm(a, b) {
  if (!a || !b) return Infinity
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}

function toPoint(p) {
  const lat = Number(p?.latitude ?? p?.lat)
  const lng = Number(p?.longitude ?? p?.lng)
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null
}

function isRestaurant(place) {
  const name =
    place?.category ||
    place?.categoryName ||
    (Array.isArray(place?.categories) &&
      (typeof place.categories[0] === 'string'
        ? place.categories[0]
        : place.categories[0]?.name)) ||
    ''
  return String(name).includes('餐廳') || String(name).includes('寵物友善餐廳')
}

// 🔧 強化版：提取地點的所有可能類別名稱
function extractCategoryNames(p) {
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

// 🔧 檢查地點是否匹配任何選中的類別（OR 邏輯）
function matchesAnySelected(p, selected) {
  if (!selected?.length) return true
  const set = new Set(selected.map(String))
  const names = extractCategoryNames(p)
  return names.some(n => set.has(n))
}

/* ---------- 通知 ---------- */
function Notification({ message, type = 'info', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])
  const bg =
    {
      error: 'bg-red-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500',
    }[type] || 'bg-blue-500'
  return (
    <div
      className={`fixed top-20 right-4 z-[2000] ${bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-sm`}
    >
      <span>{message}</span>
      <button type="button" onClick={onClose} className="ml-auto">
        ✕
      </button>
    </div>
  )
}

export default function MapSearchPage() {
  const router = useRouter() // 新增 Next.js Router 實例

  // 🔧 取得類別對照
  const { getCategoryById } = usePlaceCategories()

  /* 篩選與排序（使用 sort-config 的 value，如 'rating_desc' | 'distance' | 'created_desc'） */
  const [selectedCategories, setSelectedCategories] = useState([])
  const [sortBy, setSortBy] = useState(getDefaultSort('places')) // 預設 'rating_desc'

  // 🔧 把 selectedCategories (可能是 ID/名稱混用) → 正規化為「名稱陣列」
  const selectedCategoryNames = useMemo(() => {
    return (selectedCategories || [])
      .map((c) => {
        // number 或數字字串 → 查表拿名稱
        const num = Number(c)
        if (Number.isFinite(num)) {
          const category = getCategoryById(num)
          if (category) {
            console.log('🔄 ID轉名稱:', num, '→', category.name)
            return category.name
          } else {
            console.warn('⚠️ 找不到ID對應的類別:', num)
            return null
          }
        }
        // 其餘當作名稱
        return String(c)
      })
      .filter(Boolean)
  }, [selectedCategories, getCategoryById])

  // 🔧 DEBUG: 監控篩選狀態
  useEffect(() => {
    console.log('🏷️ 選中的類別 (原始):', selectedCategories)
    console.log('🏷️ 選中的類別 (名稱):', selectedCategoryNames)
  }, [selectedCategories, selectedCategoryNames])

  /* 初始「附近餐廳 3km」模式 */
  const [initialNearbyMode, setInitialNearbyMode] = useState(true)
  const [radiusKm, setRadiusKm] = useState(3)

  /* 地圖中心（用來擴大搜尋時的基準）、最新地圖中心（moveend） */
  const [searchCenter, setSearchCenter] = useState(null)
  const [latestMapCenter, setLatestMapCenter] = useState(null)

  /* 選地點 / UI 控制 */
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [showCardsSection, setShowCardsSection] = useState(true)
  const [showDetailCard, setShowDetailCard] = useState(false)
  const [showNavigationCard, setShowNavigationCard] = useState(false)
  const [showCategoryButtons, setShowCategoryButtons] = useState(true)
  const [showAllPins, setShowAllPins] = useState(true)

  const [isNavigating, setIsNavigating] = useState(false)
  const [routeProfile, setRouteProfile] = useState('driving')

  const [favoriteStates, setFavoriteStates] = useState({})
  const [mapLeftOffset, setMapLeftOffset] = useState(0)
  const [userLocation, setUserLocation] = useState(null)
  const [notification, setNotification] = useState(null)

  /* 抓資料（🔧 調試後端請求） */
  const {
    places: placesData = [],
    isLoading: isLoadingPlaces,
    isLoadingMore,
    error: placesError,
    refetch: refetchPlaces,
    loadMore,
    hasMore,
    totalCount,
  } = usePlacesData({
    categories: selectedCategories, // 🔧 傳原始值（ID或名稱），讓hook自己處理
    search: '',
    district: '',
    sortBy, // 直接傳 config value
    perPage: 30,
  })

  // 🔧 DEBUG: 監控後端請求參數和回應
  useEffect(() => {
    console.log('📡 usePlacesData 參數:', {
      categories: selectedCategories,
      search: '',
      district: '',
      sortBy,
      perPage: 30
    })
    console.log('📡 usePlacesData 回應:', {
      placesCount: placesData.length,
      isLoading: isLoadingPlaces,
      error: placesError,
      totalCount,
      hasMore
    })
    
    if (placesData.length > 0) {
      console.log('📡 後端回傳地點範例 (詳細):', placesData.slice(0, 5).map(p => ({
        id: p.id,
        name: p.name,
        title: p.title,
        category: p.category,
        categoryName: p.categoryName,
        categories: p.categories,
        // 🔧 檢查所有可能的類別相關欄位
        place_category: p.place_category,
        place_categories: p.place_categories,
        categoryId: p.categoryId,
        category_id: p.category_id,
        allKeys: Object.keys(p),
        // 🔧 重點：檢查類別不一致的情況
        possibleCategoryMismatch: {
          displayedCategory: p.category || p.categoryName,
          selectedIds: selectedCategories,
          shouldMatch: selectedCategories.includes(p.category_id || p.categoryId)
        }
      })))
      
      // 🔧 專門檢查類別不一致的地點
      const mismatchedPlaces = placesData.filter(p => {
        const displayCategory = p.category || p.categoryName || '未知'
        const placeId = p.category_id || p.categoryId
        const shouldAppear = selectedCategories.includes(placeId)
        return !shouldAppear && displayCategory
      })
      
      if (mismatchedPlaces.length > 0) {
        console.warn('⚠️ 發現類別不匹配的地點:', mismatchedPlaces.map(p => ({
          name: p.name,
          displayCategory: p.category || p.categoryName,
          actualCategoryId: p.category_id || p.categoryId,
          selectedCategories,
          shouldNotAppear: true
        })))
      }
      
      // 🔧 檢查地點是否有多重類別身份
      console.log('🔍 檢查前5個地點的完整類別資訊:', placesData.slice(0, 5).map(p => ({
        name: p.name,
        // 所有可能的類別相關資訊
        allCategoryInfo: {
          category: p.category,
          categoryName: p.categoryName,
          categories: p.categories,
          category_id: p.category_id,
          categoryId: p.categoryId,
          place_category: p.place_category,
          place_categories: p.place_categories,
          place_category_relations: p.place_category_relations
        },
        // 使用我們的函數提取的類別名稱
        extractedNames: extractCategoryNames(p),
        // 檢查是否匹配選中的類別
        matchesSelected: matchesAnySelected(p, selectedCategoryNames)
      })))
    }
  }, [selectedCategories, placesData, isLoadingPlaces, placesError, totalCount, hasMore, sortBy, selectedCategoryNames])

  /* 側欄寬度 */
  useEffect(() => {
    const update = () =>
      setMapLeftOffset(showCardsSection ? computeSidebarWidth() : 0)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [showCardsSection])

  /* 初始定位：設定 userLocation、searchCenter */
  useEffect(() => {
    if (!navigator.geolocation) {
      const fallback = { lat: 25.033, lng: 121.5654 }
      setUserLocation(fallback)
      setSearchCenter(fallback)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserLocation(loc)
        setSearchCenter(loc)
      },
      () => {
        const fallback = { lat: 25.033, lng: 121.5654 }
        setUserLocation(fallback)
        setSearchCenter(fallback)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }, [])

  /* 顯示資料（先以半徑 + 初始餐廳限制過濾，再做必要排序） */
  const processedPlaces = useMemo(() => {
    console.log('🔍 處理地點資料:', {
      totalPlaces: Array.isArray(placesData) ? placesData.length : 0,
      selectedCategories,
      selectedCategoryNames,
      initialNearbyMode,
      searchCenter: !!searchCenter,
      radiusKm,
      sortBy
    })
    
    let list = Array.isArray(placesData) ? placesData : []
    console.log('🔍 初始地點數:', list.length)

    // 🔧 DEBUG: 檢查原始地點資料的詳細結構
    if (list.length > 0) {
      const samplePlace = list[0]
      console.log('🔍 原始地點資料結構 (第一筆) - 完整物件:', samplePlace)
      console.log('🔍 原始地點資料結構 - 解構分析:', {
        id: samplePlace.id,
        name: samplePlace.name,
        title: samplePlace.title,
        // 檢查所有可能的類別欄位
        category: samplePlace.category,
        categoryName: samplePlace.categoryName,
        categories: samplePlace.categories,
        place_category: samplePlace.place_category,
        place_categories: samplePlace.place_categories,
        category_id: samplePlace.category_id,
        categoryId: samplePlace.categoryId,
        // 如果是關聯資料
        place_category_relations: samplePlace.place_category_relations,
        // 檢查可能的嵌套結構
        place: samplePlace.place,
        // 完整的鍵列表
        allKeys: Object.keys(samplePlace),
        // 檢查是否有數字索引（如果是陣列格式）
        hasNumericKeys: Object.keys(samplePlace).filter(key => !isNaN(key))
      })
      
      // 🔧 檢查前3個地點的類別資訊
      console.log('🔍 前3個地點的類別資訊:', list.slice(0, 3).map((place, index) => ({
        index,
        id: place.id,
        name: place.name,
        hasCategory: !!place.category,
        hasCategories: !!place.categories,
        categoryValue: place.category,
        categoriesValue: place.categories,
        // 檢查所有包含 'category' 或 'categ' 的鍵
        categoryRelatedKeys: Object.keys(place).filter(key => 
          key.toLowerCase().includes('categ') || key.toLowerCase().includes('type')
        )
      })))
    }

    // 初始模式：只顯示餐廳
    if (initialNearbyMode) {
      list = list.filter(isRestaurant)
      console.log('🔍 餐廳過濾後:', list.length)
    }

    // 以 searchCenter + radius 過濾（沒有中心就先不過濾）
    if (searchCenter) {
      list = list.filter((p) => {
        const pt = toPoint(p)
        if (!pt) return false
        return haversineKm(searchCenter, pt) <= radiusKm
      })
      console.log('🔍 半徑過濾後:', list.length)
    }

    // 🔧 修復：使用轉換後的名稱進行聯集過濾
    if (selectedCategoryNames.length > 0) {
      const beforeCategoryFilter = list.length
      list = list.filter(p => matchesAnySelected(p, selectedCategoryNames))
      console.log('🔍 類別聯集過濾:', {
        selectedCategories: selectedCategoryNames,
        beforeFilter: beforeCategoryFilter,
        afterFilter: list.length,
        filteredOut: beforeCategoryFilter - list.length
      })
    }

    // 🔧 保留並合併所有類別（名稱陣列），同時給一個主要類別作為顯示用
    list = list.map((place, index) => {
      // 先把「所有可能欄位」的類別名稱都抓出來
      const fromAllFields = extractCategoryNames(place) // 已存在於檔案上方

      // 另外再推斷一個主要類別（沒抓到時作為 fallback）
      let mainCat = null
      if (place.place_category_relations?.length) {
        mainCat = place.place_category_relations[0]?.categories?.name
      } else if (place.place_categories?.length) {
        mainCat = place.place_categories[0]?.name ?? place.place_categories[0]
      } else if (place.categories?.length) {
        mainCat = place.categories[0]?.name ?? place.categories[0]
      } else {
        mainCat = place.category?.name ?? place.category ?? place.categoryName ?? null
      }

      // 合併 + 去重
      const set = new Set(fromAllFields.filter(Boolean))
      if (mainCat) set.add(String(mainCat))
      const mergedNames = Array.from(set)

      // 最終輸出：保留原物件，其它程式用到 category 作為「主要類別」時也能運作
      const processedPlace = {
        ...place,
        category: mainCat || mergedNames[0] || '未分類',
        categories: mergedNames.length ? mergedNames : ['未分類'],
      }

      if (index < 3) {
        console.log('🔍 類別合併結果:', {
          name: processedPlace.name,
          category: processedPlace.category,
          categories: processedPlace.categories
        })
      }
      return processedPlace
    })

    console.log('🔍 處理類別後的地點範例:', list.slice(0, 3).map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      categories: p.categories
    })))

    // 「距離最近」且有 userLocation → 以距離排序（其他排序交給後端）
    if (sortBy === 'distance' && userLocation) {
      list = list.slice().sort((a, b) => {
        const da = haversineKm(userLocation, toPoint(a))
        const db = haversineKm(userLocation, toPoint(b))
        return da - db
      })
      console.log('🔍 距離排序完成')
    }

    console.log('🔍 最終處理結果:', list.length, '個地點')
    return list
  }, [
    placesData,
    initialNearbyMode,
    searchCenter,
    radiusKm,
    sortBy,
    userLocation,
    selectedCategories,
    selectedCategoryNames, // 🔧 改用轉換後的名稱
  ])

  /* 通知 */
  const showNotification = useCallback(
    (message, type = 'info') => setNotification({ message, type }),
    []
  )
  const hideNotification = useCallback(() => setNotification(null), [])

  /* 點選卡片 */
  const handlePlaceSelect = useCallback(
    (place) => {
      if (isNavigating) return
      const normalized = {
        ...place,
        id: place.id || place.rawData?.id,
        name: place.name || place.title,
        title: place.title || place.name,
        imageUrl: place.imageUrl || place.mainPhoto?.url,
      }
      setSelectedPlace(normalized)
      setShowDetailCard(true)
    },
    [isNavigating]
  )

  const handleDetailCardClose = useCallback(() => {
    setShowDetailCard(false)
    setSelectedPlace(null)
  }, [])

  /* 類別變更：離開初始模式 */
  const handleCategoryToggle = useCallback(
    (newCats) => {
      console.log('🏷️ CategoryFilterButtons 類別變更:', {
        from: selectedCategories,
        to: newCats,
        isNavigating
      })
      if (isNavigating) return
      setSelectedCategories(newCats)
      setInitialNearbyMode(false)
    },
    [isNavigating, selectedCategories]
  )

  /* 導航 */
  const handleNavigationStart = useCallback(
    (place, profile = 'driving') => {
      const pt = toPoint(place)
      if (!pt) return showNotification('地點座標資料無效，無法導航', 'error')

      const navigationPlace = {
        ...place,
        latitude: pt.lat,
        longitude: pt.lng,
        title: place.title || place.name || '未知地點',
        address: place.address || '地址未提供',
      }

      setSelectedPlace(navigationPlace)
      setRouteProfile(profile)
      setIsNavigating(true)
      setShowCardsSection(false)
      setShowDetailCard(false)
      setShowCategoryButtons(false)
      setShowAllPins(false)
      setShowNavigationCard(true)
    },
    [showNotification]
  )

  const handleNavigationEnd = useCallback(() => {
    setIsNavigating(false)
    setShowNavigationCard(false)
    setShowCardsSection(true)
    setShowCategoryButtons(true)
    setShowAllPins(true)
    window.clearCurrentRoute?.()
  }, [])

  /* 收藏 */
  const handleFavoriteToggle = useCallback(
    (place) => {
      const id = place.id || place.rawData?.id
      if (!id) return showNotification('無法識別地點，收藏失敗', 'error')
      setFavoriteStates((prev) => {
        const next = !prev[id]
        showNotification(
          next
            ? `已加入收藏 ${place.name || place.title || ''}`
            : `已取消收藏 ${place.name || place.title || ''}`,
          'success'
        )
        return { ...prev, [id]: next }
      })
    },
    [showNotification]
  )

  /* 右欄 */
  const { isRightbarVisible, toggleRightbar } = useRightbar()

  /* 卡片排序：CardsSection 直接回傳 config value（'distance'/'rating_desc'/'created_desc'） */
  const handleCardsSortChange = useCallback((value) => {
    setSortBy(value)
  }, [])

  /* 地圖移動回報：只記最新中心，按「顯示更多」時採用 */
  const handleMapMove = useCallback((center) => {
    if (center?.lat && center?.lng) setLatestMapCenter(center)
  }, [])

  /* 顯示更多（擴大半徑 / 用目前地圖中心） */
  const handleExpandSearch = useCallback(() => {
    if (latestMapCenter) setSearchCenter(latestMapCenter)
    setRadiusKm((r) => (r < 5 ? 5 : Math.min(r + 2, 15)))
  }, [latestMapCenter])

  // 新增愛心按鈕點擊處理函數
  const handleHeartClick = useCallback(() => {
    console.log('❤️ 愛心按鈕點擊，跳轉到我的寵物檔案頁面')
    router.push('/map/friend/mypetsprofile')
  }, [router])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-50">
      {notification && (
        <Notification {...notification} onClose={hideNotification} />
      )}

      {/* 地圖 */}
      <main
        id="main-content"
        className="fixed top-[55px] right-0 bottom-0 w-full transition-all duration-300 ease-in-out"
        style={{ left: `${mapLeftOffset}px` }}
        role="application"
        aria-label="互動式寵物友善地點地圖"
      >
        <PetMapComponent
          places={
            showAllPins ? processedPlaces : selectedPlace ? [selectedPlace] : []
          }
          selectedCategories={selectedCategories}
          onPlaceSelect={handlePlaceSelect}
          onLocationUpdate={setUserLocation}
          onMapMove={handleMapMove}
          routeProfile={routeProfile}
          selectedPlace={selectedPlace}
          userLocation={userLocation}
        />

        <LocationControl
          onLocationUpdate={(locObj /* {lat,lng} */) => setUserLocation(locObj)}
          isNavigating={isNavigating}
        />
      </main>

      {/* 左側列表 */}
      {showCardsSection && (
        <aside className="fixed top-[55px] left-0 bottom-0 z-[100]">
          <div className="h-full overflow-y-auto no-scrollbar pr-1">
            <CardsSection
              placesData={processedPlaces}
              selectedCategories={selectedCategories}
              sortBy={sortBy}
              onSortChange={handleCardsSortChange}
              selectedPlace={selectedPlace}
              onPlaceSelect={handlePlaceSelect}
              favoriteStates={favoriteStates}
              onFavoriteToggle={handleFavoriteToggle}
              userLocation={userLocation}
              isLoading={isLoadingPlaces}
              isLoadingMore={isLoadingMore}
              error={placesError && String(placesError)}
              onRetry={refetchPlaces}
              totalCount={totalCount}
              hasMore={hasMore}
              onLoadMore={loadMore}
              isEmpty={processedPlaces.length === 0}
            />
          </div>
        </aside>
      )}

      {/* 詳細卡片 */}
      {showDetailCard && selectedPlace && (
        <div
          className="fixed inset-0 z-[1000] bg-black/50"
          role="dialog"
          aria-modal="true"
        >
          {/* 這層負責整個 modal 的垂直置中 + 外層滾動（當卡片>視窗高時可上下捲） */}
          <div className="absolute inset-0 p-4 overflow-y-auto no-scrollbar grid place-items-center overscroll-contain">
            {/* 🔧 移除白色容器，直接渲染卡片 */}
              <PlaceDetailCard
                key={String(selectedPlace.id)} // 確保切換地點會重掛 Hook
                placeId={selectedPlace.id}
                onClose={handleDetailCardClose}
                onNavigate={(place) => handleNavigationStart(place, 'driving')}
                className="w-full" // 卡片內部自己排版，外層已處理高與滾動
              />
            </div>
          </div>
      )}

      {/* 導航卡片 */}
      {showNavigationCard && selectedPlace && (
        <div className="fixed left-4 top-[70px] z-[999]">
          <NavigationCard
            placeId={selectedPlace.id}
            place={selectedPlace}
            fallbackData={{
              ...selectedPlace,
              imageUrl: selectedPlace.imageUrl || selectedPlace.mainPhoto?.url,
              photos: selectedPlace.photos || [],
            }}
            userLocation={userLocation}
            routeProfile={routeProfile}
            onClose={handleNavigationEnd}
          />
        </div>
      )}

      {/* 類別/功能按鈕列 */}
      {showCategoryButtons && !showDetailCard && !showNavigationCard && (
        <nav
          className="fixed z-[100001] top-[70px] pr-4 flex items-start gap-2 transition-all duration-300"
          style={{ left: `${mapLeftOffset + 20}px` }}
          aria-label="地點分類篩選和功能按鈕"
        >
          <CategoryFilterButtons
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
            className="p-2"
          />
          <div className="flex justify-end gap-2">
            <IconButton
              initialPressed={true} // 🔧 強制設為已按下狀態
              pressed={showAllPins} 
              isPressed={showAllPins} 
              icon={faMapMarkerAlt}
              onClick={() => setShowAllPins((v) => !v)}
              className={showAllPins ? 'pressed' : ''}
            />
            <IconButton 
              icon={faHeart} 
              onClick={handleHeartClick}
            />
            <MapHamburgerButton
              onClick={toggleRightbar}
              isOpen={isRightbarVisible}
            />
          </div>
        </nav>
      )}

      {/* 右下角：顯示更多（擴大範圍） */}
      {!isLoadingPlaces && !showDetailCard && !isNavigating && (
        <div className="fixed bottom-4 right-4 z-[1000] flex flex-col gap-2">
          <button
            onClick={handleExpandSearch}
            className="bg-[#F5AB54] text-white px-4 py-3 rounded-lg shadow-lg hover:bg-[#e09643] transition-colors text-sm font-medium"
          >
            <FontAwesomeIcon icon={faSpinner} className="mr-2" />
            顯示更多 {radiusKm < 5 ? '（擴至 5km）' : '（以目前地圖位置擴大）'}
          </button>
        </div>
      )}
    </div>
  )
}