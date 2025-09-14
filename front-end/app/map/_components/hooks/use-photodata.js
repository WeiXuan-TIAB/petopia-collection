'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { serverURL } from '@/config'

// -------- utils --------
function normalizePhotoUrl(url) {
  if (!url || typeof url !== 'string') return ''
  const u = url.trim()
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u              // http(s)
  if (/^\/\//.test(u)) return `https:${u}`            // //example.com/xxx
  if (u.startsWith('/')) return `${serverURL}${u}`    // 絕對路徑補網域
  return `${serverURL}/${u}`                          // 其他相對字串
}

function byMainFirst(a, b) {
  // true > false
  return (b.isMain === true) - (a.isMain === true)
}

function uniqueByIdOrUrl(list) {
  const seen = new Set()
  return list.filter(p => {
    const key = String(p.id ?? '') + '|' + String(p.url ?? '')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// 修正版 usePlacePhotos Hook - 直接使用地點 API
export function usePlacePhotos(placeId, options = {}) {
  const {
    photoType = 'all',        // 'all' | 'place' | 'review'（盡力辨識）
    pageSize = 20,
    includeReviewPhotos = true,
    sortBy = 'main_first',    // 目前支援 'main_first'
  } = options

  const [photos, setPhotos] = useState([])
  const [mainPhoto, setMainPhoto] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(false) // 以地點 API 來看通常 false
  const [currentPage, setCurrentPage] = useState(1)

  // 取消舊請求 / 只採用最後一次請求
  const abortRef = useRef(null)
  const reqIdRef = useRef(0)

  const fetchPhotos = useCallback(async (page = 1, append = false) => {
    // 沒有 placeId 直接清空
    if (!placeId) {
      setPhotos([])
      setMainPhoto(null)
      setError(null)
      setIsLoading(false)
      return
    }

    // 取消上一個請求
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    const myReqId = ++reqIdRef.current

    setIsLoading(true)
    setError(null)

    try {
      // 加 cache-buster，避免快取
      const url = `${serverURL}/api/map/${placeId}?_ts=${Date.now()}`
      const res = await fetch(url, { signal: controller.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)

      const result = await res.json()
      if (reqIdRef.current !== myReqId) return // 已有更新的請求在路上，丟棄舊結果

      if (result && result.status === 'success' && result.data) {
        const data = result.data

        // 來源：優先 data.place.photos，其次 data.photos
        let photosArray = []
        if (Array.isArray(data?.place?.photos)) {
          photosArray = data.place.photos
        } else if (Array.isArray(data?.photos)) {
          photosArray = data.photos
        } else {
          photosArray = []
        }

        // 篩掉無效/空 URL
        let processed = photosArray
          .filter((p) => p && typeof p === 'object')
          .map((p, index) => {
            const url = normalizePhotoUrl(p.url)
            const isMain =
              Boolean(p.isMain || p.is_main || p.main) ||
              false

            return {
              id: p.id ?? `photo-${placeId}-${index}`,
              url,
              caption: p.caption || '',
              isMain,
              type: p.type || p.source || null, // 可能是 'place' | 'review' | ...
              _raw: p,
            }
          })
          .filter(p => !!p.url)

        // 依 options.photoType / includeReviewPhotos 盡力過濾
        processed = processed.filter((p) => {
          const t = (p.type || '').toString().toLowerCase()
          if (!includeReviewPhotos && t === 'review') return false
          if (photoType === 'place') return t !== 'review'
          if (photoType === 'review') return t === 'review'
          return true // 'all'
        })

        // 去重
        processed = uniqueByIdOrUrl(processed)

        // 找主要照
        let main = processed.find(p => p.isMain === true)
        // 如果沒有 isMain，且後端有 main 標記在原始陣列上（id 對起來）
        if (!main) {
          const rawMain = photosArray.find(p => p?.isMain || p?.is_main || p?.main)
          if (rawMain?.id) {
            main = processed.find(p => p.id === rawMain.id)
          }
        }
        // 再沒有就用第一張
        if (!main && processed.length > 0) {
          processed[0].isMain = true
          main = processed[0]
        }

        // 排序（目前只支援 main_first）
        if (sortBy === 'main_first') {
          processed.sort(byMainFirst)
        }

        // pageSize：非 append 模式時才裁切
        let finalList = processed
        if (!append && Number.isFinite(pageSize) && pageSize > 0) {
          finalList = processed.slice(0, pageSize)
        }

        // 更新狀態
        if (append && page > 1) {
          setPhotos(prev => uniqueByIdOrUrl([...prev, ...finalList]))
        } else {
          setPhotos(finalList)
        }
        setMainPhoto(main || null)
        setCurrentPage(page)
        setHasMore(false) // 單點 API 一般沒有分頁
      } else {
        setPhotos([])
        setMainPhoto(null)
        setHasMore(false)
        setError(result?.message || '無法取得照片資料')
      }
    } catch (err) {
      if (err?.name === 'AbortError') return
      setError(err?.message || '載入照片失敗')
      setPhotos([])
      setMainPhoto(null)
      setHasMore(false)
    } finally {
      if (reqIdRef.current === myReqId) {
        setIsLoading(false)
      }
    }
  }, [placeId, photoType, pageSize, sortBy, includeReviewPhotos])

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchPhotos(currentPage + 1, true)
    }
  }, [fetchPhotos, currentPage, isLoading, hasMore])

  const refetch = useCallback(() => {
    setCurrentPage(1)
    fetchPhotos(1, false)
  }, [fetchPhotos])

  useEffect(() => {
    if (placeId) {
      fetchPhotos(1, false)
    } else {
      setPhotos([])
      setMainPhoto(null)
      setError(null)
      setHasMore(false)
    }
    return () => abortRef.current?.abort()
  }, [placeId, fetchPhotos])

  return {
    photos,
    mainPhoto,
    isLoading,
    error,
    hasMore,
    loadMore,
    refetch,
  }
}

// 其他 hook 保持不變
export function usePhotoUpload(placeId) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)

  const uploadPhotos = useCallback(async (photos, options = {}) => {
    if (!placeId || !photos?.length) throw new Error('缺少必要參數')

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('請先登入')

      const formData = new FormData()
      photos.forEach((p, i) => {
        formData.append('photos', p.file)
        if (p.caption) formData.append(`captions[${i}]`, p.caption)
        if (p.isMain) formData.append(`isMain[${i}]`, 'true')
      })
      if (options.photoType) formData.append('photo_type', options.photoType)
      if (options.reviewId) formData.append('review_id', options.reviewId)

      const res = await fetch(`${serverURL}/api/map/${placeId}/photos`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const result = await res.json()
      if (res.ok && result.status === 'success') {
        setUploadProgress(100)
        return result.data?.photos || result.data
      }
      throw new Error(result.message || '上傳照片失敗')
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }, [placeId])

  return { uploadPhotos, isUploading, uploadProgress, error }
}

export function usePhotoActions() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const authHeader = () => {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('請先登入')
    return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  }

  const deletePhoto = useCallback(async (photoId) => {
    setIsLoading(true); setError(null)
    try {
      const res = await fetch(`${serverURL}/api/map/photos/${photoId}`, {
        method: 'DELETE',
        headers: authHeader(),
      })
      const result = await res.json()
      if (res.ok && result.status === 'success') return true
      throw new Error(result.message || '刪除照片失敗')
    } catch (err) {
      setError(err.message); throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const setAsMain = useCallback(async (photoId) => {
    setIsLoading(true); setError(null)
    try {
      const res = await fetch(`${serverURL}/api/map/photos/${photoId}/set-main`, {
        method: 'PATCH',
        headers: authHeader(),
      })
      const result = await res.json()
      if (res.ok && result.status === 'success') return true
      throw new Error(result.message || '設定主要照片失敗')
    } catch (err) {
      setError(err.message); throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateCaption = useCallback(async (photoId, caption) => {
    setIsLoading(true); setError(null)
    try {
      const res = await fetch(`${serverURL}/api/map/photos/${photoId}`, {
        method: 'PATCH',
        headers: authHeader(),
        body: JSON.stringify({ caption }),
      })
      const result = await res.json()
      if (res.ok && result.status === 'success') return result.data
      throw new Error(result.message || '更新說明失敗')
    } catch (err) {
      setError(err.message); throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { deletePhoto, setAsMain, updateCaption, isLoading, error }
}

export function usePhotoStats(photoId) {
  const [stats, setStats] = useState({ viewCount: 0, likeCount: 0, isLiked: false })

  const recordView = useCallback(async () => {
    if (!photoId) return
    try {
      await fetch(`${serverURL}/api/photos/${photoId}/view`, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
    } catch (err) {
      console.error('Failed to record photo view:', err)
    }
  }, [photoId])

  const toggleLike = useCallback(async () => {
    if (!photoId) return
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('請先登入')
      const res = await fetch(`${serverURL}/api/photos/${photoId}/like`, {
        method: stats.isLiked ? 'DELETE' : 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      const result = await res.json()
      if (res.ok && result.status === 'success') {
        setStats(prev => ({ ...prev, isLiked: !prev.isLiked, likeCount: prev.likeCount + (prev.isLiked ? -1 : 1) }))
      }
    } catch (err) {
      console.error('Failed to toggle like:', err)
    }
  }, [photoId, stats.isLiked])

  return { stats, recordView, toggleLike }
}