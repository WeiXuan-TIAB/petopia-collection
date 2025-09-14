'use client'
import { useQuery, fetcher } from './use-fetcher'
import { useAuth } from '@/hooks/use-auth'
import { serverURL } from '@/config'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useState, useEffect } from 'react'

// 預設商品資料(單筆)
const defaultProduct = {
  id: 0,
  product_name: '',
  product_desc: '',
  price: 0,
  specs: {
    colors: [],
    sizes: [],
    flavors: [],
  },
  images: {
    main: null,
    minor: [],
    desc: [],
  },
}

// 預設搜尋條件
const defaultCriteria = {
  page: 1,
  perpage: 20,
  nameLike: '',
  mainCategoryId: null,
  subCategoryId: null,
  mainCategoryName: '',
  subCategoryName: '',
  priceGte: 1,
  priceLte: 100000,
  sort: 'id',
  order: 'asc',
}

// #region 使用CONTEXT記錄搜尋條件用，勾子名稱為useProductState
const ProductContext = createContext(null)
ProductContext.displayName = 'ProductStateContext'

export function ProductProvider({ children }) {
  const { user } = useAuth()
  const memberId = user?.id ?? null

  const [criteria, setCriteria] = useState(defaultCriteria) // 搜尋條件
  const [likedProducts, setLikedProducts] = useState([])  // 收藏的完整商品資料
  const [likedIds, setLikedIds] = useState([])            // 收藏商品的 id 陣列

  useEffect(() => {
    if (!memberId) {
      setLikedProducts([])
      setLikedIds([])
      return
    }
  }, [memberId])

  // 用 SWR 管理喜愛商品
  const { data } = useQuery(
    memberId ? `${serverURL}/api/products/liked/list` : null
  )

  useEffect(() => {
    if (data?.status === 'success') {
      setLikedProducts(data.data.products)
      setLikedIds(data.data.products.map(p => p.id))
    }
  }, [data])

  return (
    <ProductContext.Provider
      value={{
        criteria,
        setCriteria,
        defaultCriteria,
        likedProducts,
        setLikedProducts,
        likedIds,
        setLikedIds,
        memberId,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

// 包裝useContext的useProductState
export const useProductState = () => useContext(ProductContext)
// #endregion


// 獲得所有資料，包含總筆數、總頁數…
// queryString: page=1&perpage=10&nameLike=...
export const useGetProductList = (queryString) => {
  const { data, isLoading, error, mutate } = useQuery(
    `${serverURL}/api/products?${queryString}`
  )
  return {
    products: data?.status === 'success' ? data.data.products : [],
    total: data?.data?.total ?? 0,
    pageCount: data?.data?.pageCount ?? 0,
    isLoading,
    error,
    mutate,
  }
}

// 取得分類
export const useGetProductCategories = () => {
  const { data, isLoading, error } = useQuery(`${serverURL}/api/products/categories`)

  return {
    mainCategories: data?.status === 'success' ? data.data.mainCategories : [],
    subCategories: data?.status === 'success' ? data.data.subCategories : [],
    isLoading,
    error
  }
}

// 獲得總筆數、總頁數資料(不含商品資料)
export const useGetProductListCount = (queryString = '') => {
  const searchParams = new URLSearchParams(queryString)
  searchParams.delete('page')
  searchParams.delete('perPage')

  const { data } = useQuery(
    `${serverURL}/api/products?type=count&${searchParams.toString()}`
  )

  return {
    total: data?.data?.total ?? 0,
    pageCount: data?.data?.pageCount ?? 0,
  }
}

// 商品單筆資料
export const useGetProduct = (id) => {
  const { data, isLoading, error, mutate } = useQuery(`${serverURL}/api/products/${id}`)
  return {
    product: data?.status === 'success' ? data.data.product : defaultProduct,
    isLoading,
    error,
    mutate
  }
}

// 商品評論資料
export const useGetProductReviews = (id) => {
  const queryResult = useQuery(`${serverURL}/api/products/${id}/reviews`)

  const mappedReviews =
    queryResult?.data?.status === 'success'
      ? queryResult.data.data.reviews.map(r => ({
        name: r.members?.nickname ?? '匿名用戶',
        avatar: serverURL + r.members?.avatar ?? '/default-avatar.png',
        rating: r.rating ?? 0,
        content: r.review ?? ''
      }))
      : []
  console.log(mappedReviews)
  return {
    reviews: mappedReviews,
    isLoading: queryResult?.isLoading,
    error: queryResult?.error
  }
}


// 熱銷商品
export const useGetHotProducts = () => {
  const { data, isLoading, error } = useQuery(`${serverURL}/api/products/hot`)
  return {
    hotProducts: data?.status === 'success' ? data.data : [],
    isLoading,
    error
  }
}

// 推薦商品
export const useGetRecommendProducts = () => {
  const { data, isLoading, error } = useQuery(`${serverURL}/api/products/recommend`)
  return {
    recommendProducts: data?.status === 'success' ? data.data : [],
    isLoading,
    error
  }
}


// ---------------- 喜愛商品功能 (全站同步)----------------

// 我的收藏清單
export const useGetLikedProducts = () => {
  const { data, error } = useQuery({
    queryKey: ["likedProducts"],
    queryFn: async () => {
      const res = await fetcher(`${serverURL}/api/products/liked/list`)
      console.log(res)
      return res

    },
    retry: false, // 避免無限 retry
  })

  return {
    likedProducts: data?.status === 'success' ? data.data.products : [],
    // isLoading,
    error
  }
}


// 加到最愛
export const addProductLike = async (memberId, productId) => {
  const res = await fetch(`${serverURL}/api/products/${productId}/liked`, {
    method: 'POST',
    body: JSON.stringify({ memberId }),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  return res.json()
}

// 取消最愛
export const removeProductLike = async (memberId, productId) => {
  const res = await fetch(`${serverURL}/api/products/${productId}/liked`, {
    method: 'DELETE',
    body: JSON.stringify({ memberId }),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  return res.json()
}


// 取得單品是否喜愛
export const useIsProductLiked = (productId) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ["isLiked", productId, user?.id],
    queryFn: async () => {
      if (!user?.id) return false
      const data = await fetcher(
        `${serverURL}/api/products/${productId}/liked?member_id=${user.id}`
      )
      return data?.liked ?? false
    },
    enabled: !!user?.id && !!productId,
  })
}


// 切換喜愛狀態（同步全站緩存，並回傳切換前狀態）

export const useToggleProductLike = (productId, productData = null) => {
  const { user, isAuth } = useAuth()
  const { likedIds, setLikedIds, setLikedProducts } = useProductState()
  const router = useRouter()

  // 判斷當前商品是否已經收藏
  const liked = likedIds.includes(productId)

  const toggleLike = async () => {
    if (!isAuth || !user?.id) {
      const currentPath = window.location.pathname + window.location.search
      router.push(`/member/login?redirect=${encodeURIComponent(currentPath)}`)
      return { success: false, prevLiked: liked, needLogin: true }
    }

    const prevLiked = liked
    try {
      if (liked) {
        // 取消收藏
        await removeProductLike(user.id, productId)
        setLikedIds(prev => prev.filter(id => id !== productId))
        setLikedProducts(prev => prev.filter(p => p.id !== productId))
      } else {
        // 加入收藏
        await addProductLike(user.id, productId)
        setLikedIds(prev => [...prev, productId])

        // 如果有傳 productData，就直接塞到 likedProducts
        if (productData) {
          setLikedProducts(prev => [...prev, productData])
        }
      }
      return { success: true, prevLiked, needLogin: false }
    } catch (err) {
      console.error("切換喜愛狀態失敗:", err)
      return { success: false, prevLiked, needLogin: false }
    }
  }

  return { liked, toggleLike }
}

