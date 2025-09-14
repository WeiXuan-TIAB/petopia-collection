// services/rest-client/use-restaurants.js
import useSWR from 'swr'

// 通用 fetcher（攜帶 cookie）
const fetcher = (url) =>
  fetch(url, { credentials: 'include' }).then(async (r) => {
    const data = await r.json()
    if (!r.ok) throw new Error(data?.message || 'Fetch failed')
    return data
  })

// 後端列表 API 期待 city/type 以逗號分隔（parseCsv）
// 這裡把陣列自動轉成 CSV，並做基本字串化
function normalizeListParams(params = {}) {
  const p = { ...params }
  const toCsv = (v) => (Array.isArray(v) ? v.filter(Boolean).join(',') : v)

  if (p.city !== undefined) p.city = toCsv(p.city)
  if (p.type !== undefined) p.type = toCsv(p.type)

  if (p.page !== undefined) p.page = String(p.page)
  if (p.pageSize !== undefined) p.pageSize = String(p.pageSize)
  if (p.sort !== undefined) p.sort = String(p.sort)
  if (p.q !== undefined) p.q = String(p.q)

  return p
}

// 用穩定的 key 排序來建 query，避免 key 順序造成 SWR 重抓
function buildQuery(params = {}) {
  const usp = new URLSearchParams()
  Object.keys(params)
    .sort()
    .forEach((k) => {
      const v = params[k]
      if (v === undefined || v === null || v === '') return
      usp.set(k, v)
    })
  return usp.toString()
}

export function useRestaurants(params = {}) {
  const p = normalizeListParams(params)
  const qs = buildQuery(p)
  // 走 Next 的 rewrite → /api 會代理到 3005
  const url = `/api/restaurants${qs ? `?${qs}` : ''}`

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })

  // 避免混用 ?? 和 ||：先計算 fallback，再用 ??
  const fallbackPage = p.page != null ? Number(p.page) : 1
  const fallbackPageSize = p.pageSize != null ? Number(p.pageSize) : 12

  return {
    restaurants: data?.data ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? fallbackPage,
    pageSize: data?.pageSize ?? fallbackPageSize,
    isLoading,
    isError: !!error,
    mutate,
  }
}

// 依 id 抓詳情（同樣走 Next 的 /api 重寫）
export function useRestaurantInfo({ id }) {
  const url = id ? `/api/restaurants/${id}` : null
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  })
  return { data: data?.data ?? null, error, isLoading, mutate }
}
