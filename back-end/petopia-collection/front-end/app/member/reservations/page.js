'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useMyReservations } from '@/services/rest-client/use-my-reservations'
import { cancelReservation } from '@/services/rest-client/use-cancel-reservation'
import Breadcrumb from '@/app/_components/breadcrumb'
import { ReservationPagination } from '@/app/member/reservations/_components/reservation-pagination'
import Thumbnail from '@/app/restaurant/_components/thumbnail'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/ui/select'
import Link from 'next/link'

// ===== 工具函式 =====
const toYMD = (v) => {
  if (!v) return ''
  let d
  if (typeof v === 'string') {
    // 處理 "2025-08-20" -> Safari 相容
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
      d = new Date(`${v}T00:00:00`)
    } else {
      d = new Date(v)
    }
  } else {
    d = new Date(v)
  }
  if (isNaN(d)) return ''
  return new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

const toHHmm = (v) => {
  if (!v) return ''
  let d
  if (typeof v === 'string') {
    // "18:00" 或 "18:00:00" -> 補日期
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(v)) {
      d = new Date(`1970-01-01T${v}`)
    } else {
      d = new Date(v)
    }
  } else {
    d = new Date(v)
  }
  if (isNaN(d)) return ''
  return new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Taipei',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)
}

export default function MyReservationsPage() {
  const sp = useSearchParams()
  const page = Math.max(parseInt(sp.get('page') || '1', 10), 1)
  const [status, setStatus] = useState('')
  const { data, pagination, isLoading, mutate } = useMyReservations({
    page,
    pageSize: 6,
    status,
  })

  const handleCancel = async (reservationId) => {
    if (!window.confirm('確定要取消這筆訂位嗎？')) return

    try {
      await cancelReservation(reservationId)
      alert('訂位已取消')
      mutate() // 重新載入列表
    } catch (error) {
      console.error('取消訂位錯誤:', error)
      alert(error?.message || '取消失敗，請稍後再試')
    }
  }

  return (
    <div className="container max-w-3xl mx-auto p-6">
      <Breadcrumb />
      <h1 className="text-3xl text-center mb-4">我的訂位</h1>

      {/* 狀態篩選 */}
      <div className="flex justify-end mb-4">
        <Select
          value={status || 'all'}
          onValueChange={(val) => {
            setStatus(val === 'all' ? '' : val)
            const params = new URLSearchParams(sp.toString())
            params.set('page', '1')
            window.history.replaceState(null, '', `?${params.toString()}`)
          }}
        >
          <SelectTrigger className="border-none bg-white rounded-full overflow-hidden px-4 py-2 outline-none text-sm text-gray-400 w-40">
            <SelectValue placeholder="全部狀態" />
          </SelectTrigger>
          <SelectContent className="bg-white text-base">
            <SelectItem value="all" className="hover:bg-primary/10">
              全部狀態
            </SelectItem>
            <SelectItem value="pending" className="hover:bg-primary/10">
              已訂位
            </SelectItem>
            {/* <SelectItem value="confirmed" className="hover:bg-primary/10">
              已確認
            </SelectItem> */}
            <SelectItem value="cancelled" className="hover:bg-primary/10">
              已取消
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 卡片列表 */}
      {isLoading ? (
        <p>載入中...</p>
      ) : (
        <div className="grid md:grid-cols-1 gap-4">
          {data.map((resv) => (
            <div
              key={resv.id}
              className="flex items-start justify-start p-4 gap-4 bg-white/80 hover:bg-white/90 hover:shadow-xl hover:shadow-[#f0cdba] transition-shadow duration-300 rounded-4xl"
            >
              <div className="w-20 md:w-32 aspect-square rounded-2xl overflow-hidden flex-shrink-0 relative">
                <Thumbnail
                  src={resv.restaurants?.thumbnail_url}
                  alt={resv.restaurants?.name || '餐廳圖片'}
                  fill
                  className="w-full select-none hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl">{resv.restaurants?.name}</h2>
                <p>日期：{toYMD(resv.reservation_date)}</p>
                <p>時間：{toHHmm(resv.start_time)}</p>
                <p>人數：{resv.party_size} 位</p>
                <p>
                  狀態：
                  {resv.status === 'pending'
                    ? '已訂位'
                    : '已取消'}
                </p>
              </div>
              <div className="flex flex-col justify-end h-full">
                {/* 取消按鈕（只在 pending / confirmed 顯示） */}
                {['pending', 'confirmed'].includes(resv.status) && (
                  <button
                    onClick={() => handleCancel(resv.id)}
                    className="text-sm text-red-500 border border-red-500 hover:bg-red-600 hover:text-white transition-all duration-300 px-4 py-1 rounded-full"
                  >
                    取消訂位
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 分頁 */}
      <ReservationPagination
        className="justify-center mt-4"
        total={pagination?.total || 0}
        pageSize={pagination?.pageSize || 6}
      />

      <div className="flex justify-center mt-8">
        <Link
          href="/member"
          className="bg-primary hover:bg-brand-warm transition-all duration-300 text-white px-8 py-2 rounded-full inline-block text-center"
        >
          回會員中心
        </Link>
      </div>
    </div>
  )
}
