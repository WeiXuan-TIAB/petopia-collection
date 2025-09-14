// hooks/use-placesdata.js
'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { serverURL } from '@/config'
import { usePlaceCategories } from './use-place-categories'

export function usePlacesData({
  categoryId = '',
  categories = [],
  district = '',
  search = '',
  features = {},
  sortBy = 'id',
  perPage = 20,
} = {}) {
  const [places, setPlaces] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  const abortControllerRef = useRef(null)
  const lastParamsRef = useRef('')
  const isInitialMount = useRef(true)

  // 🔧 使用類別 hook 來取得類別資料
  const { categories: allCategories, getCategoryByName } = usePlaceCategories()

  // 🔧 修復：支援 ID 或名稱的混合輸入
  const convertCategoriesToIds = useCallback((input) => {
    if (!Array.isArray(input) || input.length === 0) return []
    
    // 🔧 等待類別資料載入完成
    if (!allCategories || allCategories.length === 0) {
      return []
    }
    
    const ids = input.map((v) => {
      // 已是 number
      if (typeof v === 'number' && Number.isFinite(v)) {
        return v
      }
      // 是數字字串
      const n = Number(v)
      if (Number.isFinite(n)) {
        return n
      }
      // 是名稱
      const cat = getCategoryByName(String(v))
      if (cat) {
        return cat.id
      } else {
        console.warn('⚠️ 找不到類別:', v, '可用類別:', allCategories.map(c => c.name))
        return null
      }
    }).filter((x) => x != null)

    return ids
  }, [getCategoryByName, allCategories])

  // 穩定化參數（排序 + 去除 falsy）
  const stableParams = useMemo(() => {
    const normalizedCategories = Array.isArray(categories)
      ? [...categories].filter((v) => v !== '' && v != null).sort()
      : []

    // 🔧 修復：確保類別資料已載入才進行轉換
    const categoryIds = allCategories.length > 0 
      ? convertCategoriesToIds(normalizedCategories)
      : []

    const normalizedFeatures =
      features && typeof features === 'object'
        ? Object.keys(features)
            .sort()
            .reduce((acc, key) => {
              if (features[key]) acc[key] = true
              return acc
            }, {})
        : {}

    return {
      categoryId: String(categoryId || ''),
      categories: normalizedCategories, // 保留原始輸入用於顯示
      categoryIds, // 🔧 轉換後的 ID 用於 API 請求
      district: String(district || ''),
      search: String(search || '').trim(),
      features: normalizedFeatures,
      sortBy: String(sortBy || 'id'),
      perPage: Number(perPage) || 20,
    }
  }, [categoryId, categories, district, search, features, sortBy, perPage, convertCategoriesToIds, allCategories.length])

  const resetState = useCallback(() => {
    setPlaces([])
    setCurrentPage(1)
    setTotalPages(1)
    setTotalCount(0)
    setError(null)
  }, [])

  const fetchPlaces = useCallback(async (page = 1, append = false, params) => {
    if (!params) return

    // 🔧 如果有選中類別但還沒轉換完成，就暫停請求
    if (params.categories.length > 0 && params.categoryIds.length === 0) {
      return
    }

    // 取消上一個請求
    if (abortControllerRef.current) abortControllerRef.current.abort()

    try {
      if (page === 1) setIsLoading(true)
      else setIsLoadingMore(true)

      abortControllerRef.current = new AbortController()

      const url = new URL('/api/map/places', serverURL)
      const urlParams = new URLSearchParams()

      // ✅ 正確的 set(key, value)
      urlParams.set('page', String(page))
      urlParams.set('perPage', String(params.perPage))
      if (params.categoryId) urlParams.set('category_id', params.categoryId)
      
      // 🔧 使用轉換後的類別 ID - 支援多種格式
      if (params.categoryIds && params.categoryIds.length > 0) {
        const csv = params.categoryIds.join(',')
        // 常見四種寫法，同時都丟，後端吃得到其中任一種即可
        urlParams.set('category_ids', csv)            // CSV
        urlParams.set('categories', csv)              // CSV（備援）
        params.categoryIds.forEach((id) => {
          urlParams.append('category_ids[]', String(id)) // array 1
          urlParams.append('categories[]', String(id))   // array 2（舊習慣）
        })
      }
      
      if (params.district) urlParams.set('district', params.district)
      if (params.search) urlParams.set('search', params.search)
      if (params.sortBy) urlParams.set('sortBy', params.sortBy)

      // features 布林參數
      Object.entries(params.features).forEach(([key, value]) => {
        if (value) urlParams.set(`features[${key}]`, 'true')
      })

      // 加上 cache buster，避免 CDN/瀏覽器快取
      urlParams.set('_ts', String(Date.now()))

      url.search = urlParams.toString()

      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      const result = await res.json()

      // 通用解析：支援 {data:[...]} 或 {data:{items:[], pagination:{...}}}
      const rawData = result.data
      const placesArray = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.items)
        ? rawData.items
        : []

      setPlaces((prev) => (append ? [...prev, ...placesArray] : placesArray))

      const pg = result.pagination || rawData?.pagination || {}
      setCurrentPage(pg.page ?? page)
      setTotalPages(pg.totalPages ?? 1)
      setTotalCount(pg.total ?? pg.totalCount ?? placesArray.length)
      setError(null)
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('❌ fetchPlaces 錯誤:', err)
        setError(err.message || '載入地點失敗')
        if (!append || page === 1) setPlaces([])
      }
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
      abortControllerRef.current = null
    }
  }, [])

  const paramsString = useMemo(
    () => JSON.stringify(stableParams),
    [stableParams]
  )

  // 🔧 修復：更精確的條件判斷
  const shouldFetch = useMemo(() => {
    // 如果沒有選中任何類別，可以直接發送請求
    if (stableParams.categories.length === 0) {
      return true
    }
    
    // 如果有選中類別，需要等待類別資料載入完成且轉換成功
    if (allCategories.length === 0) {
      return false // 類別資料尚未載入
    }
    
    // 類別資料已載入，檢查轉換是否成功
    return stableParams.categoryIds.length > 0
  }, [stableParams.categories.length, stableParams.categoryIds.length, allCategories.length])

  useEffect(() => {
    if (!shouldFetch) {
      console.log('⏳ 等待類別資料載入或轉換完成...', {
        selectedCategories: stableParams.categories,
        allCategoriesLoaded: allCategories.length > 0,
        convertedIds: stableParams.categoryIds
      })
      return
    }
    
    if (lastParamsRef.current === paramsString && !isInitialMount.current)
      return
    lastParamsRef.current = paramsString
    isInitialMount.current = false
    resetState()
    // 用字串化後的參數，避免拿到舊引用
    const parsed = JSON.parse(paramsString || '{}')
    fetchPlaces(1, false, parsed)
    return () => abortControllerRef.current?.abort()
  }, [paramsString, fetchPlaces, resetState, shouldFetch, allCategories.length, stableParams.categories, stableParams.categoryIds])

  const loadMore = useCallback(() => {
    if (isLoading || isLoadingMore || currentPage >= totalPages) return
    const currentParams = JSON.parse(lastParamsRef.current || '{}')
    fetchPlaces(currentPage + 1, true, currentParams)
  }, [currentPage, totalPages, isLoading, isLoadingMore, fetchPlaces])

  const refetch = useCallback(
    (newParams = {}) => {
      const currentParams = JSON.parse(lastParamsRef.current || '{}')
      const updatedParams = { ...currentParams, ...newParams }
      lastParamsRef.current = JSON.stringify(updatedParams)
      resetState()
      fetchPlaces(1, false, updatedParams)
    },
    [fetchPlaces, resetState]
  )

  const hasMore = useMemo(
    () => currentPage < totalPages && !isLoading,
    [currentPage, totalPages, isLoading]
  )
  const isEmpty = useMemo(
    () => !isLoading && places.length === 0 && !error,
    [isLoading, places.length, error]
  )

  return {
    places,
    isLoading,
    isLoadingMore,
    error,
    refetch,
    loadMore,
    hasMore,
    isEmpty,
    totalCount,
    currentPage,
    totalPages,
  }
}