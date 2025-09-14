// services/rest-client/use-restaurant-hours.js
import useSWR from 'swr'
import { apiURL } from '@/config'

const fetcher = (url) => fetch(url).then(r => r.json())

export function useRestaurantBusinessHours(id) {
  const { data, error, isLoading } = useSWR(
    id ? `${apiURL}/restaurants/${id}/business-hours` : null,
    fetcher
  )
  return {
    byWeekday: data?.data?.byWeekday ?? null,
    isLoading,
    error,
  }
}
