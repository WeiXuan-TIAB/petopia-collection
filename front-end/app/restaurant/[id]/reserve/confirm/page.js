'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { useAuthGet } from '@/services/rest-client/use-user'
import { apiURL, serverURL } from '@/config'
import { useLoading } from '@/app/AppShell'

import Breadcrumb from '@/app/_components/breadcrumb'
import { useRestaurantInfo } from '@/services/rest-client/use-restaurants'
import MapEmbed from '@/app/restaurant/_components/map-embed'

import { FaLocationDot } from 'react-icons/fa6'
import { FaStopwatch } from 'react-icons/fa'

const FALLBACK_BANNER = '/images/restaurant/banner-placeholder.jpg'
function normalizeSrc(src, fallback = FALLBACK_BANNER) {
  if (!src) return fallback
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  return `${serverURL}${src.startsWith('/') ? src : `/${src}`}`
}
const pad = (n) => String(n).padStart(2, '0')

export default function ConfirmPage() {
  const { isAuth, user } = useAuthGet()
  const { safePush } = useLoading()
  const params = useParams()
  const sp = useSearchParams()
  const id = params?.id

  const date = sp.get('date') || ''
  const time = sp.get('time') || ''
  const party = Number(sp.get('party') || 2)
  const pet = sp.get('pet') === '1'

  const { data } = useRestaurantInfo({ id })

  const photos = useMemo(
    () => (data?.photos || []).map((p) => normalizeSrc(p.url)),
    [data?.photos]
  )
  const top10 = photos.slice(0, 10)

  const restaurant = {
    bannerSrc: normalizeSrc(data?.bannerSrc, top10[0] || FALLBACK_BANNER),
    name: data?.name ?? '載入中…',
    type: data?.type ?? '載入中…',
    rating:
      typeof data?.rating === 'number'
        ? Number(data.rating).toFixed(1)
        : data?.rating ?? '5.0',
    city: data?.city ?? '載入中…',
    area: data?.area ?? '…',
    street: data?.street ?? '…',
    lat: data?.lat ?? null,
    lng: data?.lng ?? null,
  }

  const items = [
    { label: '吃吃', href: '/restaurant' },
    { label: restaurant.name, href: `/restaurant/${id}` },
    { label: '確認訂位', href: `/restaurant/${id}/reserve/confirm` },
  ]

  // 倒數計時：基於開始時間，避免 tab 休眠誤差
  const [remainMs, setRemainMs] = useState(5 * 60 * 1000)
  useEffect(() => {
    const start = Date.now()
    const t = setInterval(() => {
      const diff = 5 * 60 * 1000 - (Date.now() - start)
      setRemainMs(diff > 0 ? diff : 0)
    }, 1000)
    return () => clearInterval(t)
  }, [])
  const mm = pad(Math.floor(remainMs / 1000 / 60))
  const ss = pad(Math.floor((remainMs / 1000) % 60))

  const [submitting, setSubmitting] = useState(false)

  async function handleConfirm() {
    try {
      if (!isAuth) {
        toast.info('請先登入')
        const qs = new URLSearchParams({
          date,
          time,
          party: String(party),
          pet: pet ? '1' : '0',
        }).toString()
        const redirect = `/restaurant/${id}/reserve/confirm?${qs}`
        safePush(`/member/login?redirect=${encodeURIComponent(redirect)}`)
        return
      }

      if (!date || !time || !party) {
        toast.error('參數不完整，請返回上一頁重新選擇')
        return
      }
      if (remainMs <= 0) {
        toast.error('保留時間已到，請返回重新選擇時段')
        return
      }
      if (!user?.mobile) {
        toast.error('請先到會員中心填寫手機號碼')
        return
      }

      const payload = {
        member_id: user.id,
        party_size: party,
        has_pet: pet,
        contact_phone: user.mobile,
        date,
        time,
      }

      setSubmitting(true)

      const res = await fetch(`${apiURL}/reservations/${id}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => {
        throw new Error('伺服器回應錯誤')
      })
      if (!res.ok) throw new Error(json.message || '建立訂位失敗')

      toast.success('訂位成功！')
      safePush(`/reservations/${json.data.id}`)
    } catch (e) {
      toast.error(e.message || '建立訂位失敗')
    } finally {
      setSubmitting(false)
    }
  }

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
            {/* 左半部：訂位資訊 */}
            <div className="flex flex-col flex-shrink-0 w-full lg:w-3/5 gap-8">
              <div className="flex flex-col gap-3">
                <div className="text-lg md:text-3xl">{restaurant.name}</div>
                <div className="flex">
                  <div className="bg-support-success text-white rounded-full px-4 py-2 flex gap-2 items-center">
                    <FaStopwatch />
                    <div>
                      我們會為您保留這組座位 {mm}:{ss} 分鐘
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="text-lg md:text-3xl">訂位詳細資料</div>
                <DetailRow label="訂位人姓名" value={user?.name ?? '—'} />
                <DetailRow label="訂位人手機" value={user?.mobile ?? '—'} />
                <DetailRow label="訂位人 Email" value={user?.email ?? '—'} />
                <DetailRow label="餐廳名稱" value={restaurant.name} />
                <DetailRow label="訂位日期" value={date || '—'} />
                <DetailRow label="訂位時間" value={time || '—'} />
                <DetailRow label="用餐人數" value={`${party} 位`} />
                <DetailRow label="是否攜帶寵物" value={pet ? '是' : '否'} />
              </div>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={submitting || !date || !time}
                className="bg-primary text-white rounded-full px-4 py-2 w-full xl:w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '送出中…' : '完成訂位'}
              </button>

              <div className="text-sm text-text-secondary">
                點擊「完成訂位」即表示你同意{' '}
                <span className="underline cursor-pointer">
                  Petopia 使用條款
                </span>{' '}
                和<span className="underline cursor-pointer"> 隱私權政策</span>
                。
              </div>
            </div>

            {/* 右半部：地圖與資訊 */}
            <div className="flex flex-col w-full lg:w-2/5 gap-16 grow">
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

              <div className="flex flex-col gap-4">
                <div className="text-lg md:text-3xl">其他資訊</div>
                <div className="text-sm text-text-secondary">
                  完成訂位後將寄送確認信至你的
                  Email，並可於「我的訂位」查看與取消。
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="flex text-base">
      <div className="w-1/3 text-primary">{label}</div>
      <div className="flex-1">{value}</div>
    </div>
  )
}
