'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

import { apiURL, serverURL } from '@/config'
import { useRestaurantInfo } from '@/services/rest-client/use-restaurants'
import Breadcrumb from '@/app/_components/breadcrumb'
import MapEmbed from '@/app/restaurant/_components/map-embed'
import { FaLocationDot } from 'react-icons/fa6'
import { FaCheckCircle } from 'react-icons/fa'

// ===== 小工具 =====
const FALLBACK_BANNER = '/images/restaurant/banner-placeholder.jpg'
function normalizeSrc(src, fallback = FALLBACK_BANNER) {
  if (!src) return fallback
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  return `${serverURL}${src.startsWith('/') ? src : `/${src}`}`
}

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

export default function ReservationSuccessPage() {
  const params = useParams()
  const sp = useSearchParams()
  const reservationId = params?.reservationId

  // 後端資料
  const [, setLoading] = useState(true)
  const [reservation, setReservation] = useState(null)
  const [error, setError] = useState(null)

  // Fallback（URL query 備援）
  const fallback = {
    date: sp.get('date') || '',
    time: sp.get('time') || '',
    party: Number(sp.get('party') || 0) || null,
    pet: sp.get('pet') === '1',
    restaurant_id: Number(sp.get('restaurantId') || 0) || null,
  }

  useEffect(() => {
    let mounted = true
    async function fetchReservation() {
      try {
        setLoading(true)
        const res = await fetch(`${apiURL}/reservations/${reservationId}`, {
          credentials: 'include',
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.message || '取得訂位資料失敗')
        if (!mounted) return
        setReservation(json.data)
      } catch (e) {
        if (mounted) {
          setReservation({
            id: Number(reservationId),
            restaurant_id: fallback.restaurant_id,
            reservation_date: fallback.date,
            start_time: fallback.time,
            party_size: fallback.party,
            has_pet: fallback.pet,
          })
          setError(e.message)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (reservationId) fetchReservation()
    return () => {
      mounted = false
    }
  }, [reservationId, fallback.date, fallback.time, fallback.party, fallback.pet, fallback.restaurant_id])

  const restaurantId = reservation?.restaurant_id ?? null

  // ✅ 一律呼叫，但帶上 safeId 與 enabled
  const { data: rData } = useRestaurantInfo({
    id: restaurantId,
    enabled: !!restaurantId,
  })

  // ✅ 改用 bannerSrc
  const restaurant = {
    name: rData?.name || (restaurantId ? '載入中…' : '—'),
    bannerSrc: normalizeSrc(rData?.bannerSrc, FALLBACK_BANNER),
    city: rData?.city || '',
    area: rData?.area || '',
    street: rData?.street || '',
    lat: rData?.lat ?? null,
    lng: rData?.lng ?? null,
  }

  const date = reservation?.reservation_date
    ? toYMD(reservation.reservation_date)
    : fallback.date
  const time = reservation?.start_time
    ? toHHmm(reservation.start_time)
    : fallback.time
  const party = reservation?.party_size ?? fallback.party
  const pet =
    typeof reservation?.has_pet === 'boolean'
      ? reservation.has_pet
      : fallback.pet

  // ✅ 麵包屑：有 restaurantId 才放第二層
  const items = [
    { label: '吃吃', href: '/restaurant' },
    ...(restaurantId
      ? [{ label: restaurant.name, href: `/restaurant/${restaurantId}` }]
      : []),
    { label: '訂位成功', href: `/reservations/${reservationId}` },
  ]

  return (
    <>
      <section className="w-full px-4 py-4 lg:py-8">
        <div className="container max-w-7xl mx-auto">
          <Breadcrumb items={items} />
          <div
            className="flex flex-col gap-6 bg-brand-warm/80 bg-cover bg-center rounded-4xl p-6 md:p-12"
            style={{
              backgroundImage: `url("${restaurant.bannerSrc}"), url("${FALLBACK_BANNER}")`,
            }}
          >
            <h3 className="text-xl xl:text-3xl text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.66)]">
              {restaurant.name}
            </h3>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-4 lg:py-8">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col xl:flex-row gap-16">
            <div className="flex flex-col flex-shrink-0 w-full gap-8">
              {/* 訂位成功 */}
              <div className="flex flex-col gap-3">
                <FaCheckCircle className="w-12 h-12 text-green-600" />
                <div className="text-2xl">訂位成功</div>

                <div className="text-sm text-text-secondary">
                  訂位編號：{reservationId}
                  {error && (
                    <span className="ml-2 text-red-500">
                      (使用網址備援資料)
                    </span>
                  )}
                </div>

                <div className="mt-2 grid grid-cols-2 gap-y-2 text-lg">
                  <div className="text-primary/80">日期</div>
                  <div>{date || '—'}</div>

                  <div className="text-primary/80">時間</div>
                  <div className="text-2xl">{time || '—'}</div>

                  <div className="text-primary/80">人數</div>
                  <div>{party ? `${party} 位大人` : '—'}</div>

                  <div className="text-primary/80">是否攜寵</div>
                  <div>{pet ? '攜帶寵物' : '不攜帶寵物'}</div>
                </div>
              </div>

              {/* 導覽 */}
              <div className="flex flex-col gap-4">
                <div>
                  您可前往
                  <Link href="/member" className="underline text-primary ml-1">
                    會員中心
                  </Link>
                  查看或取消訂位。
                </div>
                <div className="flex gap-6">
                  <Link href="/" className="underline text-primary">
                    回首頁
                  </Link>
                  {restaurantId && (
                    <Link
                      href={`/restaurant/${restaurantId}`}
                      className="underline text-primary"
                    >
                      回餐廳頁
                    </Link>
                  )}
                  <Link
                    href="/member/reservations"
                    className="underline text-primary"
                  >
                    我的訂位
                  </Link>
                </div>
              </div>

              {/* 地點 */}
              {restaurant.lat && restaurant.lng && (
                <div className="flex flex-col gap-4">
                  <MapEmbed
                    lat={restaurant.lat}
                    lng={restaurant.lng}
                    address={`${restaurant.city}${restaurant.area}${restaurant.street}`}
                  />
                  <div className="flex items-center gap-2">
                    <FaLocationDot />
                    {`${restaurant.city}${restaurant.area}${restaurant.street}`}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
