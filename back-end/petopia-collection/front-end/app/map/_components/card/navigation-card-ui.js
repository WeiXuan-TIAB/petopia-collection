'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMapMarkerAlt,
  faCar,
  faWalking,
  faSpinner,
  faPlay,
  faStop,
} from '@fortawesome/free-solid-svg-icons'
import CategoryTag from '../common/category-tag'
import RatingStars from '../common/rating-stars'
import { useBusinessStatus } from '../hooks/use-businesshours'

// 營業時間顯示（使用寫死版 hook）
const BusinessHoursDisplay = ({ placeId, categoryName }) => {
  const { isOpen, statusText, hoursText, isLoading } = useBusinessStatus(
    placeId,
    'petPlaces',
    categoryName
  )

  if (isLoading) return '載入中...'

  return (
    <>
      <span className={isOpen ? 'text-[#1A9562]' : 'text-[#EE5A36]'}>
        {isOpen ? '營業中' : '已打烊'}
      </span>
      {(hoursText || statusText) && (
        <span className="text-[#3E2E2E]">・{hoursText || statusText}</span>
      )}
    </>
  )
}

export default function NavigationCardUI({
  // 地點資料
  title,
  imageUrl,
  imageAlt = '地點圖片',
  // 舊版：單一分類
  category,
  // 新版：多分類 + 主要分類（容器會給）
  categories = [], // ['寵物友善餐廳', '毛孩店長'] 之類
  primaryCategory = null, // 顯示/計算用的第一類別
  rating,
  address,
  placeId,

  // 導航狀態
  selectedProfile = 'driving', // 'driving' | 'walking'
  routeInfo = null, // { driving: { distance, duration }, walking: {...} }
  isLoadingRoute = false,
  isClosing = false,
  isNavigationActive = false,

  // 事件
  onClose,
  onStartNavigation, // (profile) => void
  onNavigationModeChange, // (profile) => void
  onEndNavigation, // () => void  (目前沒顯示按鈕，但保留)

  // UI
  className = '',
  ...props
}) {
  // 取營業時間要用的分類名稱
  const categoryForHours = useMemo(
    () => primaryCategory || category || null,
    [primaryCategory, category]
  )

  const formatDistance = (km) => {
    if (km === undefined || km === null) return '--'
    if (km < 1) return `${Math.round(km * 1000)} 公尺`
    return `${km.toFixed(1)} 公里`
  }

  const formatDuration = (minutes) => {
    if (minutes === undefined || minutes === null) return '--'
    if (minutes < 60) return `${Math.round(minutes)} 分鐘`
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return `${hours} 小時 ${mins} 分鐘`
  }

  return (
    <div
      data-navigation-card="true"
      className={`bg-[#FDEFE6] rounded-[20px] md:rounded-[30px] lg:rounded-[35px] xl:rounded-[40px] 
               w-[280px] md:w-[350px] lg:w-[400px] xl:w-[450px] 
               max-w-[90vw] 
               min-h-[650px] md:min-h-[700px] lg:min-h-[750px] xl:min-h-[800px]
               max-h-[90vh] 
               overflow-auto scrollbar-hide
               flex flex-col relative shadow-lg
               ${isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'}
               transition-opacity duration-300
               ${className}`}
      {...props}
    >
      {/* 關閉按鈕 */}
      <button
        type="button"
        onClick={onClose}
        disabled={isClosing || !onClose}
        className="absolute top-2 right-2 z-[1001] bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ee5a36] transition-colors"
        aria-label="關閉導航"
      >
        <span aria-hidden="true" className="text-gray-600 text-lg">
          ✕
        </span>
      </button>

      <div className="p-[12px] md:p-[16px] lg:p-[18px] xl:p-[20px] flex flex-col gap-[8px] md:gap-[10px] lg:gap-[12px] xl:gap-[14px] flex-1">
        {/* 圖片 */}
        <div className="w-full aspect-[495/388] rounded-t-[20px] md:rounded-t-[30px] lg:rounded-t-[35px] xl:rounded-t-[40px] overflow-hidden relative">
          <Image
            src={
              imageUrl ||
              'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop&auto=format'
            }
            alt={imageAlt}
            fill
            className="object-cover"
          />
        </div>

        {/* 分類標籤：優先使用 categories，其次單一 category */}
        {Array.isArray(categories) && categories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {categories.map((c, i) => (
              <CategoryTag key={`${c}-${i}`} category={c} />
            ))}
          </div>
        ) : category ? (
          <div className="flex flex-wrap gap-2">
            <CategoryTag category={category} />
          </div>
        ) : null}

        {/* 標題/評分 */}
        <h1 className="text-[16px] md:text-[18px] lg:text-[19px] xl:text-xl font-bold text-[#3E2E2E]">
          {title}
        </h1>

        <div className="flex items-center gap-2">
          <RatingStars rating={rating} />
          <span className="text-[14px] md:text-[15px] lg:text-[15px] xl:text-[16px] text-[#3E2E2E]">
            {Number(rating || 0).toFixed(1)}
          </span>
        </div>

        {/* 位置資訊 */}
        <div className="w-full flex flex-col pb-2 gap-[6px]">
          <div className="flex items-center gap-2 text-[14px] md:text-[15px] lg:text-[15px] xl:text-[16px] text-[#3E2E2E]">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="w-[14px] h-[14px]"
            />
            <span>{address}</span>
          </div>

          {/* 營業狀態（寫死版 hook） */}
          <div className="text-[14px] md:text-[15px] lg:text-[15px] xl:text-[16px]">
            <BusinessHoursDisplay
              placeId={placeId}
              categoryName={categoryForHours}
            />
          </div>
        </div>

        {/* 導航控制區域 */}
        <div className="w-full space-y-4 pb-6">
          {!isNavigationActive ? (
            <>
              <h3 className="text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] font-semibold text-[#3E2E2E]">
                開始導航
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {/* 開車導航 */}
                <StartNavigationButton
                  profile="driving"
                  icon={faCar}
                  label="開車導航"
                  onClick={() => onStartNavigation?.('driving')}
                  disabled={isClosing || !onStartNavigation}
                />

                {/* 步行導航 */}
                <StartNavigationButton
                  profile="walking"
                  icon={faWalking}
                  label="步行導航"
                  onClick={() => onStartNavigation?.('walking')}
                  disabled={isClosing || !onStartNavigation}
                />
              </div>
            </>
          ) : (
            <>
              <h3 className="text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] font-semibold text-[#3E2E2E]">
                導航模式切換
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {/* 開車模式切換 */}
                <NavigationModeButton
                  icon={faCar}
                  label="開車"
                  distance={routeInfo?.driving?.distance}
                  duration={routeInfo?.driving?.duration}
                  isSelected={selectedProfile === 'driving'}
                  isLoading={isLoadingRoute && selectedProfile === 'driving'}
                  onClick={() => onNavigationModeChange?.('driving')}
                  disabled={
                    isLoadingRoute || isClosing || !onNavigationModeChange
                  }
                />

                {/* 步行模式切換 */}
                <NavigationModeButton
                  icon={faWalking}
                  label="步行"
                  distance={routeInfo?.walking?.distance}
                  duration={routeInfo?.walking?.duration}
                  isSelected={selectedProfile === 'walking'}
                  isLoading={isLoadingRoute && selectedProfile === 'walking'}
                  onClick={() => onNavigationModeChange?.('walking')}
                  disabled={
                    isLoadingRoute || isClosing || !onNavigationModeChange
                  }
                />
              </div>

              {/* 路線資訊顯示 —— 就放在這裡 */}
              {routeInfo && selectedProfile && routeInfo[selectedProfile] && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    {selectedProfile === 'driving' ? '開車' : '步行'} 路線資訊
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>
                      距離：
                      {formatDistance(routeInfo[selectedProfile].distance)}
                    </div>
                    <div>
                      預計時間：
                      {formatDuration(routeInfo[selectedProfile].duration)}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      路線已顯示在地圖上
                    </div>
                  </div>
                </div>
              )}

              {/* 結束導航按鈕（可選） */}
              <div className="mt-4">
                <EndNavigationButton
                  onClick={() => onEndNavigation?.()}
                  disabled={isClosing || !onEndNavigation}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// 啟動導航按鈕
function StartNavigationButton({ icon, label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center p-6 rounded-[12px] transition-all border-2 bg-[#F5AB54] border-[#F5AB54] text-white shadow-lg hover:bg-[#e09644] hover:border-[#e09644] hover:scale-105 ${
        disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <FontAwesomeIcon icon={faPlay} className="w-4 h-4" />
        <FontAwesomeIcon icon={icon} className="w-5 h-5" />
      </div>
      <span className="text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] font-medium">
        {label}
      </span>
    </button>
  )
}

// 結束導航按鈕
function EndNavigationButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 rounded-[12px] transition-all font-medium
        bg-[#EE5A36] text-white border-2 border-[#EE5A36]
        hover:bg-[#d54a2a] hover:border-[#d54a2a] hover:scale-[1.02]
        ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
      aria-label="結束導航"
    >
      <div className="flex items-center justify-center gap-2">
        <FontAwesomeIcon icon={faStop} className="w-4 h-4" />
        <span>結束導航</span>
      </div>
    </button>
  )
}

// 導航模式切換按鈕
function NavigationModeButton({
  icon,
  label,
  distance,
  duration,
  isSelected,
  isLoading,
  onClick,
  disabled,
}) {
  const formatDistance = (km) => {
    if (km === undefined || km === null) return '--'
    if (km < 1) return `${Math.round(km * 1000)} 公尺`
    return `${km.toFixed(1)} 公里`
  }

  const formatDuration = (minutes) => {
    if (minutes === undefined || minutes === null) return ''
    if (minutes < 60) return `${Math.round(minutes)} 分鐘`
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return `${hours}h ${mins}m`
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative flex flex-col items-center justify-center p-4 rounded-[12px] transition-all border-2 ${
        isSelected
          ? 'bg-[#F5AB54] border-[#F5AB54] text-white shadow-lg'
          : 'bg-white border-[#E5E5E5] text-[#3E2E2E] hover:border-[#F5AB54] hover:bg-[#FFF8F0]'
      } ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <FontAwesomeIcon
          icon={isLoading ? faSpinner : icon}
          className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
        />
        <span className="text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] font-medium">
          {label}
        </span>
      </div>

      <div className="text-center space-y-1">
        <div className="text-[12px] md:text-[13px] lg:text-[14px] xl:text-[15px]">
          {formatDistance(distance)}
        </div>
        {duration !== undefined && duration !== null && (
          <div className="text-[11px] md:text-[12px] lg:text-[13px] xl:text-[14px] opacity-80">
            {formatDuration(duration)}
          </div>
        )}
      </div>
    </button>
  )
}
