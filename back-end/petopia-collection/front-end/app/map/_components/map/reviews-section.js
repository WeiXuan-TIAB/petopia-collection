// components/map/ReviewsSection.js - 調試版本
'use client'

import React, { useMemo, useState, useCallback } from 'react'
import ReviewsSectionUI from '../card/reviews-section-ui'
import { transformReviews } from '@/utils/reviewdata-transformer'

// 從各種可能欄位萃取數字型 id；拿不到就給 -Infinity 以便升冪
function getIdNum(r) {
  const cand = r?.id ?? r?.review_id ?? r?.reviewId ?? r?._id ?? r?.rawId
  const n = Number(cand)
  return Number.isFinite(n) ? n : -Infinity
}

// 安全把 YYYY/MM/DD 或其他可解析字串轉 Date（失敗回 0）
function parseDateSafe(str) {
  if (!str) return 0
  const t = new Date(str).getTime()
  return Number.isFinite(t) ? t : 0
}

export default function ReviewsSection({
  place,
  sortBy: sortByProp = '最新',
  onSortChange,
  onAddReview,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false,
  className = '',
}) {
  const [sortBy, setSortBy] = useState(sortByProp)
  const [userHasSorted, setUserHasSorted] = useState(false)

  const handleSortChange = useCallback(
    (v) => {
      setSortBy(v)
      setUserHasSorted(true)
      onSortChange?.(v)
    },
    [onSortChange]
  )

  // 原始評論
  const rawReviews = useMemo(() => {
    return place?.reviews || []
  }, [place?.reviews])

  // 先做「基礎排序：id 升冪」
  const baseSortedRaw = useMemo(() => {
    return [...rawReviews].sort((a, b) => getIdNum(a) - getIdNum(b))
  }, [rawReviews])

  // 轉成前端顯示格式（保持基礎排序）
  const baseTransformed = useMemo(() => {
    return transformReviews(baseSortedRaw)
  }, [baseSortedRaw])

  // 顯示用排序：只有使用者動過排序才依下拉選項重排
  const displayReviews = useMemo(() => {
    if (!userHasSorted) return baseTransformed

    const arr = [...baseTransformed]
    switch (sortBy) {
      case '評分最高':
        return arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      case '評分最低':
        return arr.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0))
      case '最新':
      default:
        return arr.sort((a, b) => parseDateSafe(b.date) - parseDateSafe(a.date))
    }
  }, [baseTransformed, sortBy, userHasSorted])

  // 🔍 調試用的載入更多處理函數
  const handleLoadMore = useCallback(() => {
    console.log('🔍 ReviewsSection handleLoadMore 被觸發')
    console.log('🔍 onLoadMore 函數存在:', !!onLoadMore)
    console.log('🔍 hasMore 狀態:', hasMore)
    
    if (onLoadMore) {
      onLoadMore()
    } else {
      console.log('⚠️ onLoadMore 函數不存在')
    }
  }, [onLoadMore, hasMore])

  if (!place) return null

  const rating = place?.rating ?? 0
  const reviewCount = place?.reviewCount ?? displayReviews.length
  const ratingDistribution = place?.ratingDistribution ?? {}

  // 🔍 調試信息
  console.log('🔍 ReviewsSection 渲染狀態:', {
    displayReviews: displayReviews.length,
    totalCount: reviewCount,
    hasMore,
    isLoadingMore,
    onLoadMore: !!onLoadMore,
    sortBy,
    userHasSorted
  })

  return (
    <>

      <ReviewsSectionUI
        // 資料
        reviews={displayReviews}
        totalCount={reviewCount}
        averageRating={rating}
        ratingDistribution={ratingDistribution}
        
        // 狀態
        isLoading={false}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        error={null}
        
        // 排序（UI 顯示 & 事件）
        sortBy={sortBy}
        onSortChange={handleSortChange}
        
        // 其他事件
        onAddReview={onAddReview}
        onLoadMore={handleLoadMore} // 使用調試版本的處理函數
        onRetry={null}
        
        // UI
        className={className}
        isStatic={false}
      />
    </>
  )
}