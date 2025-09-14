// app/map/_components/card/card-section.js
'use client'

import React, { useMemo, useState, useCallback } from 'react'

import PetPlaceCardUI from '../card/map-place-card-ui'
import CardsSectionUI from '../card/place-cards-section-ui'
// ❌ 移除 SortOptions 的導入，因為 CardsSectionUI 內部已經有排序功能
import { getDefaultSort } from '@/app/map/_components/common/sort-config'

// 取數字型 id（沒有或非數字給 -Infinity，方便做升冪）
function getIdNum(p) {
  const id = p?.id ?? p?.rawData?.id ?? p?.place_id ?? p?._id
  const n = Number(id)
  return Number.isFinite(n) ? n : -Infinity
}

// 距離計算（公尺）
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toNum = (v) => (v == null ? null : Number(v))
  const a = [lat1, lon1, lat2, lon2].map(toNum)
  if (a.some((v) => v == null || Number.isNaN(v))) return Number.POSITIVE_INFINITY

  const toRad = (deg) => (deg * Math.PI) / 180
  const R = 6371000
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// 從 place 取得 (lat,lng)
const getPlaceLatLng = (p) => {
  const lat =
    Number(p?.latitude) ??
    Number(p?.lat) ??
    (Array.isArray(p?.position) ? Number(p.position[0]) : NaN)
  const lng =
    Number(p?.longitude) ??
    Number(p?.lng) ??
    (Array.isArray(p?.position) ? Number(p.position[1]) : NaN)
  return { lat, lng }
}

// 從 userLocation 取得 (lat,lng)（支援 {lat,lng} 或 {latitude,longitude}）
const getUserLatLng = (u) => {
  if (!u) return { lat: NaN, lng: NaN }
  const lat = Number(u.lat ?? u.latitude)
  const lng = Number(u.lng ?? u.longitude)
  return { lat, lng }
}

export default function CardsSection({
  placesData = [],
  isLoading = false,
  isLoadingMore = false,
  error = null,
  totalCount = 0,
  hasMore = false,
  selectedCategories = [],
  // ✅ 接收的是「config value」，例如 'rating_desc' | 'distance' | 'created_desc'
  sortBy: sortByProp = getDefaultSort('places'),
  selectedPlace = null,
  favoriteStates = {},
  onRetry = () => {},
  onLoadMore = () => {},
  onSortChange = () => {},
  onPlaceSelect = () => {},
  onFavoriteToggle = () => {},
  userLocation = null,
  className = '',
}) {
  // UI 狀態
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState(sortByProp)
  const [userHasSorted, setUserHasSorted] = useState(false)

  // 用 config 組成 Sort 下拉選單（保留這個，給 CardsSectionUI 使用）

  const handleSearchChange = useCallback((v) => setSearchTerm(v), [])
  const handleClearSearch = useCallback(() => setSearchTerm(''), [])
  const handleSortChange = useCallback(
    (value) => {
      setSortBy(value)
      setUserHasSorted(true)
      onSortChange?.(value) // ✅ 往上回報「config value」
    },
    [onSortChange]
  )

  const handlePlaceClick = useCallback(
    (p) => onPlaceSelect?.(p),
    [onPlaceSelect]
  )
  const handleFavToggle = useCallback(
    (p) => onFavoriteToggle?.(p),
    [onFavoriteToggle]
  )

  // 篩選（類別 + 搜尋）
  const filteredPlaces = useMemo(() => {
    if (!placesData?.length) return []
    let result = [...placesData]

    // 🔧 移除前端類別篩選，因為後端已經處理了
    // if (selectedCategories?.length) { ... }

    if (searchTerm.trim()) {
      const kw = searchTerm.toLowerCase()
      result = result.filter((p) => {
        const name = (p.title || p.name || '').toLowerCase()
        const addr = (p.address || '').toLowerCase()
        const cat = (p.category || p.categoryName || '').toLowerCase()
        return name.includes(kw) || addr.includes(kw) || cat.includes(kw)
      })
    }
    return result
  }, [placesData, searchTerm])

  // ✅ 基礎排序：永遠先用 id 升冪（穩定排序基準）
  const baseSorted = useMemo(
    () => [...filteredPlaces].sort((a, b) => getIdNum(a) - getIdNum(b)),
    [filteredPlaces]
  )

  // ✅ 顯示排序：只在「使用者操作過排序」時 client 端套用「距離」；其他交給後端（維持 baseSorted）
  const displayPlaces = useMemo(() => {
    if (!userHasSorted) return baseSorted

    if (sortBy === 'distance') {
      const { lat: uLat, lng: uLng } = getUserLatLng(userLocation)
      if (!Number.isFinite(uLat) || !Number.isFinite(uLng)) return baseSorted
      return [...baseSorted].sort((a, b) => {
        const { lat: aLat, lng: aLng } = getPlaceLatLng(a)
        const { lat: bLat, lng: bLng } = getPlaceLatLng(b)
        const dA = haversineDistance(uLat, uLng, aLat, aLng)
        const dB = haversineDistance(uLat, uLng, bLat, bLng)
        return dA - dB
      })
    }

    // 'rating_desc' | 'created_desc' 等都交給後端 → 這裡不再重排，保持 baseSorted
    return baseSorted
  }, [baseSorted, sortBy, userHasSorted, userLocation])

  const renderPlaceCard = useCallback(
    (place, index) => {
      const placeId = place.id || place.rawData?.id || index
      const isSelected = String(selectedPlace?.id ?? '') === String(placeId)
      const isFavorited = !!favoriteStates[placeId]
      const categories = place.categories || (place.category ? [place.category] : [])

      return (
        <PetPlaceCardUI
          key={placeId}
          placeId={placeId}
          title={place.title || place.name}
          imageUrl={place.imageUrl || place.mainPhoto?.url}
          imageAlt={`${place.title || place.name}的照片`}
          rating={place.rating}
          district={place.district}
          category={place.category || place.categoryName}
          categories={categories}
          address={place.address}
          isSelected={isSelected}
          isLoading={false}
          maxTagsToShow={2}
          showAllTags={false}
          onClick={() => handlePlaceClick(place)}
          onFavoriteToggle={() => handleFavToggle(place)}
          isFavorited={isFavorited}
        />
      )
    },
    [selectedPlace?.id, favoriteStates, handlePlaceClick, handleFavToggle]
  )

  const titleInfo = useMemo(() => {

    return {
      title: `結果`,  // ✅ 移除計數顯示，如你之前要求的
      filters: [
        // 🔧 顯示選中的類別名稱而不是 ID
        selectedCategories.length ? `類別: ${selectedCategories.join(', ')}` : '',
        searchTerm.trim() ? `搜尋: ${searchTerm}` : '',
      ].filter(Boolean),
    }
  }, [selectedCategories, searchTerm])

  const emptyStateMessage = useMemo(() => {
    if (searchTerm.trim()) {
      return {
        icon: '🔍',
        title: `找不到符合「${searchTerm}」的地點`,
        subtitle: '請嘗試其他關鍵字',
        action: { text: '清除搜尋', handler: handleClearSearch },
      }
    }
    if (selectedCategories.length) {
      return {
        icon: '📂',
        title: '所選類別中沒有地點',
        subtitle: `類別：${selectedCategories.join(', ')}`,
        action: null,
      }
    }
    return {
      icon: '🏪',
      title: '沒有地點資料',
      subtitle: '請檢查網路連線',
      action: onRetry ? { text: '重新載入', handler: onRetry } : null,
    }
  }, [searchTerm, selectedCategories, handleClearSearch, onRetry])

  return (
    <div className={className}>
      {/* ❌ 移除頂部的排序區塊，因為 CardsSectionUI 內部已經有排序功能 */}

      <CardsSectionUI
        places={displayPlaces}
        titleInfo={titleInfo}
        totalCount={totalCount}
        emptyStateMessage={emptyStateMessage}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        error={error}
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange} // ✅ 確保排序變更事件正確傳遞
        onLoadMore={onLoadMore}
        onRetry={onRetry}
        renderPlaceCard={renderPlaceCard}
      />
    </div>
  )
}