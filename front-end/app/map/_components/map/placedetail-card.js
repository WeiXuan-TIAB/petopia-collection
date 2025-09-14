'use client'

import React, { useMemo, useState } from 'react'
import PlaceDetailUI from '../card/placedetail-card-ui'
import ReviewsSection from './reviews-section'
import { usePlaceData } from '@/app/map/_components/hooks/use-placedata'
import useFavoriteData from '@/app/map/_components/hooks/use-favoritedata'
import { usePlacePhotos } from '../hooks/use-photodata'
import { useBusinessStatus } from '../hooks/use-businesshours'
import { useRouter } from 'next/navigation'

// icons ...
import {
  faMapMarkerAlt,
  faClock,
  faPhone,
  faCompass,
  faCalendarDays,
  faGlobe,
  faPaw,
  faImages,
  faHeart as faHeartSolid,
} from '@fortawesome/free-solid-svg-icons'
import {
  faHeart as faHeartRegular,
  faCommentDots,
} from '@fortawesome/free-regular-svg-icons'

export default function PlaceDetailCard({
  placeId,
  memberId,
  fallbackData,
  overrides = {},
  className,
  onClose,
  onNavigate,
  onFavoriteToggle,
}) {
  // 🔹 排序狀態（給 ReviewSection）
  const [reviewSort, setReviewSort] = useState('最新')

  // 🔹 評論分頁狀態 - 前端控制顯示數量
  const [displayedReviewCount, setDisplayedReviewCount] = useState(3) // 一開始只顯示3則

  // 🔹 詳情 + 內嵌評論（一次抓取所有評論）
  const {
    place: placeData,
    isLoading: isLoadingPlace,
    reviews: allReviews, // 所有評論
    isLoadingReviews,
  } = usePlaceData(placeId, {
    reviewPerPage: 50, // 後端一次抓取更多，前端控制顯示
    reviewSort,
  })

  // 🔹 照片
  const { isLoading: isLoadingPhotos } = usePlacePhotos(placeId, {
    photoType: 'all',
    pageSize: 50,
  })

  // 🔹 收藏清單
  const { favorites = [] } = useFavoriteData(memberId)

  // 🔹 合併顯示資料
  const displayData = useMemo(() => {
    return {
      ...fallbackData,
      ...(placeData && Object.keys(placeData).length ? placeData : {}),
      ...overrides,
    }
  }, [fallbackData, placeData, overrides])

  // 🔹 主要類別（顯示用）
  const primaryCategory = useMemo(() => {
    const list = displayData?.categories
    if (Array.isArray(list) && list.length > 0) {
      const first = list[0]
      return typeof first === 'string'
        ? first
        : first?.name || first?.label || first
    }
    return displayData?.category || null
  }, [displayData])

  // 🔹 營業狀態（用共用 hook 算）
  const {
    isOpen: openByHook,
    statusText,
    hoursText,
  } = useBusinessStatus(placeId, 'petPlaces', primaryCategory)

  // 🔹 主圖
  const displayImageUrl = useMemo(() => {
    if (displayData?.photos?.length) {
      const main = displayData.photos.find((p) => p.is_main || p.isMain)
      if (main?.url) return main.url
    }
    if (displayData?.imageUrl) return displayData.imageUrl
    return 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop&auto=format'
  }, [displayData])

  // 🔹 照片陣列（給 UI）
  const processedPhotos = useMemo(() => {
    const list = displayData?.photos?.length
      ? displayData.photos
      : [
          {
            url: displayImageUrl,
            id: 'main',
            isMain: true,
            caption: displayData?.name,
          },
        ]
    return list
      .map((p, i) => ({
        id: p.id || `p-${i}`,
        url: typeof p === 'string' ? p : p.url,
        caption: typeof p === 'object' ? p.caption : '',
        created_at: p.created_at || p.createdAt || undefined,
        rating: p.rating || p.score || undefined,
        isMain: p.isMain || p.is_main || false,
      }))
      .filter((p) => !!p.url)
  }, [displayData, displayImageUrl])

  // 🔹 前端控制顯示的評論數量
  const displayedReviews = useMemo(() => {
    if (!allReviews || !Array.isArray(allReviews)) return []
    return allReviews.slice(0, displayedReviewCount)
  }, [allReviews, displayedReviewCount])

  // 🔹 是否還有更多評論
  const hasMoreReviews = useMemo(() => {
    return allReviews && allReviews.length > displayedReviewCount
  }, [allReviews, displayedReviewCount])

  // 🔹 載入更多評論的處理函數
  const handleLoadMoreReviews = () => {
    setDisplayedReviewCount((prev) => prev + 3) // 每次增加3則
  }

  // 🔹 供 ReviewSection 的資料容器
  const placeForReviews = useMemo(() => {

    if (!displayedReviews || displayedReviews.length === 0) {
      return null
    }

    const result = {
      id: displayData?.id || placeId,
      name: displayData?.name,
      reviews: displayedReviews, // 📍 只傳入要顯示的評論
      rating: displayData?.rating || 0,
      reviewCount: allReviews?.length || 0, // 📍 總數量用所有評論的數量
      ratingDistribution: displayData?.ratingDistribution || {},
    }

    console.log('=== placeForReviews 最終結果 ===', result)

    return result
  }, [displayData, placeId, displayedReviews, allReviews])

  // 🔹 是否已收藏
  const isFavorited = useMemo(() => {
    const pid = String(placeId ?? displayData?.id ?? '')
    if (!pid) return false
    return favorites.some((f) => {
      const fpid = String(f.placeId ?? f.place_id ?? f.id ?? '')
      return fpid && fpid === pid
    })
  }, [favorites, placeId, displayData?.id])

  // 🔹 事件處理
  const handleNavigate = async () => {
    if (!displayData?.latitude || !displayData?.longitude) {
      alert('此地點沒有座標資訊')
      return
    }
    if (typeof onNavigate === 'function') await onNavigate(displayData)
  }

  const router = useRouter()
  // 修正後
  const handleReservation = () => {
    router.push('/restaurant/1')
  } 

  const handleFavoriteClick = () => {
    onFavoriteToggle?.({
      placeId: displayData?.id || placeId,
      next: !isFavorited,
      current: isFavorited,
    })
  }

  const isLoading = (isLoadingPlace || isLoadingPhotos) && !fallbackData

  return (
    <PlaceDetailUI
      // 基本資訊
      placeId={placeId}
      title={displayData?.name}
      imageUrl={displayImageUrl}
      rating={displayData?.rating}
      district={displayData?.district}
      category={primaryCategory}
      address={displayData?.address}
      phone={displayData?.phone}
      website={displayData?.website}
      isOpen={openByHook}
      businessHours={hoursText}
      description={displayData?.description}
      features={displayData?.features}
      photos={processedPhotos}
      businessStatus={statusText}
      // 狀態
      isLoading={isLoading}
      isFavorited={!!isFavorited}
      // 主要按鈕
      onNavigate={handleNavigate}
      onFavoriteToggle={handleFavoriteClick}
      onReservation={handleReservation}
      onClose={onClose}
      // 小按鈕
      onPublishReview={() => console.log('發表評論 clicked')}
      onPublishPhoto={() => console.log('發表相片 clicked')}
      // 圖標
      actionIcons={{
        navigate: faCompass,
        favoriteOn: faHeartSolid,
        favoriteOff: faHeartRegular,
        reserve: faCalendarDays,
        publishReview: faCommentDots,
        publishPhoto: faImages,
        address: faMapMarkerAlt,
        hours: faClock,
        phone: faPhone,
        website: faGlobe,
        pet: faPaw,
      }}
      // 📍 評論區域組件
      ReviewsSectionComponent={
        placeForReviews ? (
          <ReviewsSection
            place={placeForReviews}
            sortBy={reviewSort}
            onSortChange={setReviewSort}
            // 📍 傳入自定義的載入更多函數和狀態
            hasMore={hasMoreReviews}
            onLoadMore={handleLoadMoreReviews}
            isLoadingMore={false}
            className="w-full"
          />
        ) : (
          <div
            style={{
              background: '#fef3c7',
              padding: '12px',
              margin: '12px 0',
              fontSize: '12px',
              border: '1px solid #f59e0b',
              borderRadius: '6px',
            }}
          >
            <strong>⚠️ 無法顯示評論:</strong>
            <br />• 所有評論: {allReviews ? `${allReviews.length} 筆` : '無'}
            <br />• 顯示評論:{' '}
            {displayedReviews ? `${displayedReviews.length} 筆` : '無'}
            <br />• 地點ID: {displayData?.id || placeId || '無'}
            <br />• 載入狀態: {isLoadingReviews ? '載入中' : '已載入'}
          </div>
        )
      }
      className={className}
    />
  )
}