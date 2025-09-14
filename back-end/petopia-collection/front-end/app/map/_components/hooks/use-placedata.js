'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { serverURL } from '@/config'

/**
 * 讀地點詳情 + 內嵌評論（單一請求）
 * - reviewPerPage: 每次顯示幾筆（前端分頁）
 * - reviewSort: 'created_desc' | 'rating_desc' | 'rating_asc'
 */
export function usePlaceData(
  placeId,
  { reviewPerPage = 6, reviewSort = 'created_desc' } = {}
) {
  const [place, setPlace] = useState(null)
  const [reviewsAll, setReviewsAll] = useState([])
  const [page, setPage] = useState(1)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const fetchPlace = useCallback(async () => {
    if (!placeId) return
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      setIsLoading(true)
      setError(null)

      const url = new URL(`/api/map/${placeId}`, serverURL)
      const res = await fetch(url.toString(), { signal: controller.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const json = await res.json()
      
      // 🔧 修正：根據你的 API 格式，data 是在 json.data
      const payload = json?.data ?? json

      setPlace(payload)

      // 🔧 修正：你的 API 把 reviews 直接放在 data.reviews
      // 根據你的 API 回傳格式，reviews 就在 payload.reviews
      const embeddedReviews = Array.isArray(payload?.reviews) ? payload.reviews : []

      setReviewsAll(embeddedReviews)
      setPage(1)
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error('=== fetchPlace 錯誤 ===', e)
        setError(e.message || '載入地點失敗')
        setPlace(null)
        setReviewsAll([])
      }
    } finally {
      setIsLoading(false)
      abortRef.current = null
    }
  }, [placeId])

  useEffect(() => {
    fetchPlace()
    return () => abortRef.current?.abort()
  }, [fetchPlace])

  // 前端排序
  const sortedReviews = useMemo(() => {
    const arr = [...reviewsAll] // 複製一份，避免直接改到原陣列

    switch (reviewSort) {
      case 'rating_desc': {
        return arr.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      }
      case 'rating_asc': {
        return arr.sort((a, b) => (a.rating || 0) - (b.rating || 0))
      }
      case 'created_desc':
      default: {
        const toTime = (r) =>
          new Date(r.created_at || r.createdAt || 0).getTime()
        return arr.sort((a, b) => toTime(b) - toTime(a))
      }
    }
  }, [reviewsAll, reviewSort])

  // 前端分頁（顯示用）
  const reviews = useMemo(
    () => sortedReviews.slice(0, page * reviewPerPage),
    [sortedReviews, page, reviewPerPage]
  )

  const hasMoreReviews = reviews.length < sortedReviews.length
  const isLoadingReviews = isLoading
  const isLoadingMoreReviews = false

  const loadMoreReviews = useCallback(() => {
    if (hasMoreReviews) setPage((p) => p + 1)
  }, [hasMoreReviews])

  const refetch = useCallback(() => fetchPlace(), [fetchPlace])

  return {
    place,
    isLoading,
    error,

    // 評論相關（給 ReviewSection）
    reviews,
    isLoadingReviews,
    isLoadingMoreReviews,
    hasMoreReviews,
    loadMoreReviews,

    // 若其它地方需要重抓（例如按重新整理）
    refetch,
  }
}