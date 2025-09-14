'use client'

import React from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import RatingStars from '../common/rating-stars'
import CategoryTag from '@/app/map/_components/common/category-tag'
import { useBusinessHours } from '../hooks/use-businesshours'

// 只修正 .jpg1 → .jpg；保留 ?query/#hash
const cleanImageUrl = (url) => {
  if (!url || typeof url !== 'string') {
    if (process.env.NODE_ENV === 'development') {
      console.warn('❌ Invalid image URL:', url)
    }
    return '/images/map/places/default.png'
  }
  return url.trim().replace(/(\.[a-zA-Z]{3,4})(\d+)(?=($|[?#]))/, '$1')
}

function BusinessHoursSection({
  placeId,
  placeCategory,
  fallbackIsOpen,
  fallbackHours,
}) {
  // 若父層已經傳入就直接顯示；沒有才用 hook 算
  const shouldUseHook = !(
    typeof fallbackIsOpen === 'boolean' || fallbackHours?.todayHours
  )
  const { isOpen, statusText, hoursText } = useBusinessHours(
    shouldUseHook ? placeId : null,
    'petPlaces',
    shouldUseHook ? placeCategory : null
  )

  const open = shouldUseHook ? isOpen : fallbackIsOpen
  const text = shouldUseHook
    ? hoursText || statusText
    : fallbackHours?.todayHours
    ? `${fallbackHours.todayHours.open || '-'}-${
        fallbackHours.todayHours.close || '-'
      }`
    : ''

  if (typeof open !== 'boolean' && !text) return null

  return (
    <div className="text-[8px] md:text-[10px] lg:text-[12px] xl:text-[14px] truncate">
      {typeof open === 'boolean' && (
        <span className={open ? 'text-[#1A9562]' : 'text-[#ff4444]'}>
          {open ? '營業中' : '已打烊'}
        </span>
      )}
      {text && <span className="text-[#3E2E2E]">・{text}</span>}
    </div>
  )
}

export default function PetPlaceCardUI({
  // 顯示資料
  title,
  imageUrl,
  imageAlt,
  rating,
  district,
  category,
  categories = [],
  address,

  // 用來算營業時間（若父層不提供 isOpen/businessHours）
  placeId,
  placeCategory, // e.g. "寵物友善餐廳"

  // 若父層已經算好，也可以直接傳入
  isOpen,
  businessHours,

  // UI 狀態
  className = '',
  onClick,
  isSelected = false,
  isLoading = false,

  // Tag 顯示設定 - 可調整顯示數量
  maxTagsToShow = 3, // 🔧 改為預設顯示3個
  showAllTags = false,
}) {

  // 圖片 fallback 與清理
  const [currentSrc, setCurrentSrc] = React.useState(imageUrl)
  React.useEffect(() => {
    setCurrentSrc(imageUrl)
  }, [imageUrl])

  const cleanedImageUrl = React.useMemo(() => {
    const c = cleanImageUrl(currentSrc)
    if (process.env.NODE_ENV === 'development') {
      console.log('🎨 PetPlaceCardUI image URL:', {
        title,
        imageUrl,
        cleaned: c,
      })
    }
    return c
  }, [currentSrc, title, imageUrl])

  // 🔧 類別處理 - 增強版本
  const allCategories = React.useMemo(() => {
    let result = []
    
    if (Array.isArray(categories) && categories.length > 0) {
      result = categories
    } else if (category) {
      result = [category]
    }
    return result
  }, [categories, category])

  const primaryCategory = React.useMemo(() => {
    if (allCategories.length === 0) return category || null
    const first = allCategories[0]
    return typeof first === 'string'
      ? first
      : first?.name || first?.label || first
  }, [allCategories, category])

  // 🔧 類別標籤顯示邏輯：支援顯示更多標籤
  const displayTags = React.useMemo(() => {
    const effectiveMaxTags = showAllTags ? allCategories.length : maxTagsToShow
    const tagsToShow = allCategories.slice(0, effectiveMaxTags)
    const remainingCount = Math.max(0, allCategories.length - effectiveMaxTags)
    
    const result = {
      tags: tagsToShow,
      hasMore: remainingCount > 0,
      remainingCount,
    }
    return result
  }, [allCategories, maxTagsToShow, showAllTags])

  if (isLoading) {
    return (
      <div
        className={`
          w-full min-h-[160px] bg-gray-200 rounded-[12px]
          p-3 animate-pulse ${className}
        `}
      >
        <div className="flex gap-3">
          <div className="w-[100px] h-[100px] bg-gray-300 rounded-[12px]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4" />
            <div className="h-3 bg-gray-300 rounded w-1/2" />
            <div className="h-3 bg-gray-300 rounded w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`
        w-full min-h-[160px] bg-white rounded-[12px]
        p-3 flex gap-3 hover:shadow-lg transition-shadow duration-200
        overflow-hidden ${onClick ? 'cursor-pointer' : ''} 
        ${isSelected ? 'ring-2 ring-[#EE5A36]' : ''} ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      {/* 圖片 */}
      <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] lg:w-[140px] lg:h-[140px] rounded-[14px] overflow-hidden flex-shrink-0 bg-gray-100">
        {cleanedImageUrl ? (
          <Image
            src={cleanedImageUrl}
            alt={imageAlt || '店家圖片'}
            width={140}
            height={140}
            className="w-full h-full object-cover"
            onError={() => setCurrentSrc('/images/map/places/default.png')}
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      {/* 內容 - 重新設計的佈局 */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* 1. 標題（獨立一行） */}
        <div>
          <h4 className="text-[14px] md:text-[16px] lg:text-[18px] font-medium text-[#3E2E2E] line-clamp-2 leading-tight">
            {title || '—'}
          </h4>
        </div>

        {/* 2. 類別標籤（獨立一行，佔整行，可顯示多個） */}
        {allCategories.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {displayTags.tags.map((cat, i) => {
              const name =
                typeof cat === 'string' ? cat : cat?.name || cat?.label || cat
              return (
                <CategoryTag
                  key={`${name}-${i}`}
                  category={name}
                  size="small"
                />
              )
            })}
            {displayTags.hasMore && displayTags.remainingCount > 0 && (
              <span className="inline-flex items-center px-3 py-1 text-[10px] rounded-full bg-[#F5F5F5] text-[#666] font-medium">
                +{displayTags.remainingCount}
              </span>
            )}
          </div>
        )}

        {/* 3. 評分（獨立一行） */}
        {typeof rating === 'number' && (
          <div className="flex items-center gap-2">
            <RatingStars
              rating={Math.round(rating)}
              className="flex-shrink-0"
            />
            <span className="text-sm font-semibold text-[#3E2E2E]">
              {rating.toFixed(1)}
            </span>
            <span className="text-xs text-[#666] ml-1">
              (根據最近的評分)
            </span>
          </div>
        )}

        {/* 4. 大致地點（獨立一行） */}
        <div className="flex items-center gap-1 text-sm text-[#3E2E2E]">
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            className="w-3 h-3 text-[#3E2E2E] flex-shrink-0"
          />
          <span className="truncate">{district || address || '—'}</span>
        </div>

        {/* 5. 營業狀態（最後一行） */}
        <div>
          <BusinessHoursSection
            placeId={placeId}
            placeCategory={placeCategory || primaryCategory}
            fallbackIsOpen={isOpen}
            fallbackHours={businessHours}
          />
        </div>
      </div>
    </div>
  )
}

export { PetPlaceCardUI }