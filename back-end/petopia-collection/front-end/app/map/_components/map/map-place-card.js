// ===========================================
// components/map/map-place-card.js
// （完整類別顯示、支援多類別標籤）
// ===========================================

'use client'

import React, { memo, useMemo, useCallback } from 'react'
import PetPlaceCardUI from '../card/map-place-card-ui'
import { usePlaceData } from '@/app/map/_components/hooks/use-placedata'
import { usePlacePhotos } from '@/app/map/_components/hooks/use-photodata'

// 安全挑選主照片（相容 is_main / isMain / '1' / 1 / 'true'）
function pickMainPhoto(photos) {
  if (!Array.isArray(photos) || photos.length === 0) return null
  const isTrue = (v) => v === true || v === 1 || v === '1' || v === 'true'
  const main =
    photos.find(
      (p) => isTrue(p?.is_main) || isTrue(p?.isMain) || isTrue(p?.is_main_photo)
    ) || photos.find((p) => !!p?.url)
  return main || null
}

// 🔧 強化版：提取地點的所有可能類別名稱（與其他組件保持一致）
function extractAllCategories(displayData) {
  const names = []

  
  // 基本類別欄位
  if (displayData?.category) {
    const cat = typeof displayData.category === 'string' ? displayData.category : displayData.category?.name
    if (cat) names.push(String(cat))
  }
  if (displayData?.categoryName) names.push(String(displayData.categoryName))
  
  // categories 陣列
  if (Array.isArray(displayData?.categories)) {
    displayData.categories.forEach(c => {
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
  if (displayData?.place_category?.name) names.push(String(displayData.place_category.name))
  if (Array.isArray(displayData?.place_categories)) {
    displayData.place_categories.forEach(c => {
      const name = typeof c === 'string' ? c : c?.name
      if (name) names.push(String(name))
    })
  }
  
  // 關聯表資料
  if (Array.isArray(displayData?.place_category_relations)) {
    displayData.place_category_relations.forEach(rel => {
      if (rel?.categories?.name) names.push(String(rel.categories.name))
      if (rel?.category?.name) names.push(String(rel.category.name))
    })
  }
  
  // 🔧 也檢查 fallbackData 中可能的類別資訊
  if (displayData?.originalData) {
    const originalCategories = extractAllCategories(displayData.originalData)
    names.push(...originalCategories)
  }
  
  // 去重並過濾空值
  const uniqueCategories = [...new Set(names.filter(Boolean))]
  
  return uniqueCategories
}

const PetPlaceCard = memo(function PetPlaceCard({
  // 資料
  placeId,
  fallbackData, // SSR/快取預設資料（可為 null/undefined）

  // UI & 狀態
  className,
  onClick,
  onFavoriteToggle,
  isFavorited,
  isSelected,
  isOpen,
  businessHours,
}) {
  // 有 placeId 且沒有 fallback 才抓 API
  const shouldFetchPlace = placeId && !fallbackData
  const {
    place: placeData,
    isLoading: placeLoading,
    error: placeError,
  } = usePlaceData(shouldFetchPlace ? placeId : null)

  // 沒有 fallback 圖片時再抓照片
  const shouldFetchPhotos = placeId && !fallbackData?.imageUrl
  const {
    mainPhoto,
    isLoading: photosLoading,
    error: photosError,
  } = usePlacePhotos(shouldFetchPhotos ? placeId : null)

  // 最終展示資料（僅合併 fallback + API）
  const displayData = useMemo(
    () => ({
      ...fallbackData,
      ...placeData,
    }),
    [fallbackData, placeData]
  )

  // 主圖
  const displayImageUrl = useMemo(() => {
    const picked = pickMainPhoto(displayData?.photos)
    if (picked?.url) return picked.url
    if (mainPhoto?.url) return mainPhoto.url
    if (displayData?.imageUrl) return displayData.imageUrl
    return 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop&auto=format'
  }, [displayData?.photos, mainPhoto?.url, displayData?.imageUrl])

  // 🔧 使用強化版類別提取邏輯
  const categories = useMemo(() => {
    const extractedCategories = extractAllCategories(displayData)
    
    // 如果沒有提取到任何類別，嘗試備用邏輯
    if (extractedCategories.length === 0) {
      if (Array.isArray(displayData?.categories) && displayData.categories.length > 0) {
        return displayData.categories.map(c => typeof c === 'string' ? c : (c?.name || '未知類別'))
      }
      if (displayData?.category) {
        return [typeof displayData.category === 'string' ? displayData.category : (displayData.category?.name || '未知類別')]
      }
      return ['未分類']
    }
    
    return extractedCategories
  }, [displayData])

  // 事件
  const handleClick = useCallback(() => {
    onClick?.({
      id: displayData?.id || placeId,
      title: displayData?.name || displayData?.title,
      originalData: displayData,
      ...displayData,
    })
  }, [onClick, displayData, placeId])

  const handleFavoriteToggle = useCallback(
    (e) => {
      e?.stopPropagation?.()
      onFavoriteToggle?.(displayData)
    },
    [onFavoriteToggle, displayData]
  )

  // 錯誤狀態（無 fallback 時才顯示）
  if ((placeError || photosError) && !fallbackData) {
    return (
      <div
        className={`
          w-full min-h-[160px]
          bg-red-50 border border-red-200 rounded-xl
          p-4 flex items-center justify-center
          ${className}
        `}
      >
        <p className="text-red-600 text-sm">
          載入失敗：{placeError || photosError}
        </p>
      </div>
    )
  }

  // 載入狀態
  const isLoading = (placeLoading || photosLoading) && !fallbackData


  return (
    <PetPlaceCardUI
      // 資料
      title={displayData?.name}
      imageUrl={displayImageUrl}
      imageAlt={displayData?.imageAlt || `${displayData?.name || ''}的照片`}
      rating={displayData?.rating}
      district={displayData?.district}
      category={categories[0]} // 主要類別（用於顏色等）
      categories={categories} // 🔧 傳遞完整的類別陣列
      address={displayData?.address}
      features={displayData?.features}
      isOpen={isOpen}
      businessHours={businessHours}
      mainPhoto={mainPhoto}
      // 狀態 + 事件
      isFavorited={isFavorited}
      isSelected={isSelected}
      className={className}
      onClick={handleClick}
      onFavoriteToggle={handleFavoriteToggle}
      isLoading={isLoading}
      maxTagsToShow={3} // 🔧 顯示最多3個類別標籤
      showAllTags={false} // 🔧 可以設為 true 顯示所有類別
    />
  )
})

export const StaticPetPlaceCard = memo(function StaticPetPlaceCard(props) {
  // 🔧 使用相同的類別提取邏輯
  const categories = useMemo(() => {
    const extractedCategories = extractAllCategories(props)
    
    if (extractedCategories.length === 0) {
      if (Array.isArray(props?.categories) && props.categories.length > 0) {
        return props.categories.map(c => typeof c === 'string' ? c : (c?.name || '未知類別'))
      }
      if (props?.category) {
        return [typeof props.category === 'string' ? props.category : (props.category?.name || '未知類別')]
      }
      return ['未分類']
    }
    
    return extractedCategories
  }, [props])

  const imageUrl = useMemo(() => {
    const picked = pickMainPhoto(props?.photos)
    if (picked?.url) return picked.url
    if (props?.imageUrl) return props.imageUrl
    return 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop&auto=format'
  }, [props?.photos, props?.imageUrl])

  return (
    <PetPlaceCardUI
      {...props}
      imageUrl={imageUrl}
      category={categories[0]}
      categories={categories} // 🔧 完整類別陣列
      maxTagsToShow={props.maxTagsToShow || 3}
      showAllTags={props.showAllTags || false}
      isLoading={false}
    />
  )
})

export const PetPlaceCardList = memo(function PetPlaceCardList({
  places = [],
  className,
  onPlaceClick,
  renderCard,
  useStaticCards = false,
  selectedPlaceId,
  favoriteStates = {},
  onFavoriteToggle,
  maxTagsToShow = 3,
  showAllTags = false,
}) {
  const stablePlaces = useMemo(() => places || [], [places])

  const handlePlaceClick = useCallback(
    (payload) => onPlaceClick?.(payload),
    [onPlaceClick]
  )
  const handleFavoriteToggle = useCallback(
    (payload) => onFavoriteToggle?.(payload),
    [onFavoriteToggle]
  )

  if (stablePlaces.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-gray-400 text-4xl mb-4">🏪</div>
        <div className="text-gray-600 text-lg mb-2">沒有找到地點</div>
        <div className="text-gray-500 text-sm">請嘗試調整篩選條件</div>
      </div>
    )
  }

  return (
    <div className={`grid gap-4 ${className}`}>
      {stablePlaces.map((place) => {
        const placeId = place?.rawData?.id ?? place?.id
        const isSelected =
          String(selectedPlaceId ?? '') === String(placeId ?? '')
        const isFavorited = favoriteStates[String(placeId)]

        if (renderCard) {
          return renderCard(place, placeId)
        }

        if (useStaticCards) {
          return (
            <StaticPetPlaceCard
              key={placeId}
              {...place}
              isSelected={isSelected}
              isFavorited={isFavorited}
              onClick={handlePlaceClick}
              onFavoriteToggle={handleFavoriteToggle}
              maxTagsToShow={maxTagsToShow}
              showAllTags={showAllTags}
            />
          )
        }

        return (
          <PetPlaceCard
            key={placeId}
            placeId={placeId}
            fallbackData={{
              ...place,
              // 主要類別：第一個名稱
              category: (extractAllCategories(place)[0]) || place.category || place.categoryName,
              // 所有類別：名稱陣列（extractAllCategories 已處理物件/字串、去重）
              categories: extractAllCategories(place),
              // 原始欄位保留（讓卡片內的提取邏輯也能命中）
              place_category: place.place_category,
              place_categories: place.place_categories,
              place_category_relations: place.place_category_relations,
              category_id: place.category_id,
              categoryId: place.categoryId,
            }}
            isSelected={isSelected}
            isFavorited={isFavorited}
            onClick={handlePlaceClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
        )
      })}
    </div>
  )
})

export const SimplePlaceCardList = memo(function SimplePlaceCardList(props) {
  return <PetPlaceCardList {...props} useStaticCards={true} />
})

export const FullPlaceCardList = memo(function FullPlaceCardList(props) {
  return <PetPlaceCardList {...props} useStaticCards={false} />
})

export default PetPlaceCard