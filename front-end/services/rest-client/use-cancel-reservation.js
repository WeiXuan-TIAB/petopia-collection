import { apiURL } from '@/config'

export async function cancelReservation(id) {
  const res = await fetch(`${apiURL}/reservations/${id}/cancel`, {
    method: 'PATCH',
    credentials: 'include',
  })
  const data = await res.json()
  if (data.status !== 'success') {
    throw new Error(data.detail || data.message || '取消訂位失敗')
  }
  return data
}
