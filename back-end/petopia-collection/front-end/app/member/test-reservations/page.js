'use client'

import useSWR from 'swr'
import { apiURL } from '@/config'

const fetcher = (url) =>
  fetch(url, { credentials: 'include' }).then((r) => r.json())

export default function TestMyReservations() {
  const { data, error, isLoading } = useSWR(`${apiURL}/reservations/me`, fetcher)

  if (isLoading) return <div>讀取中...</div>
  if (error) return <div>錯誤：{error.message}</div>

  return (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  )
}
