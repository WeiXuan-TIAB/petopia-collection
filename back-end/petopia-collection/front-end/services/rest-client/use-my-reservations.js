import useSWR from 'swr'
import { apiURL } from '@/config'

const fetcher = (url) =>
  fetch(url, { credentials: 'include' })
    .then((r) => r.json())
    .then((j) => {
      if (j.status !== 'success') throw new Error(j.message || 'fetch failed')
      return j
    })

export function useMyReservations({ page = 1, pageSize = 10, status } = {}) {
  const qs = new URLSearchParams()
  qs.set('page', String(page))
  qs.set('pageSize', String(pageSize))
  if (status) qs.set('status', status)

  const key = `${apiURL}/reservations/me?${qs.toString()}`
  const { data, error, isLoading, mutate } = useSWR(key, fetcher)

  return {
    data: data?.data || [],
    pagination: data?.pagination || { page, pageSize, total: 0, totalPages: 0 },
    error,
    isLoading,
    mutate,
  }
}
