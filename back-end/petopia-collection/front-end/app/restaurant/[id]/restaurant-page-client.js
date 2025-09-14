'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect, useMemo, useCallback, forwardRef } from 'react'
import { useAuthGet } from '@/services/rest-client/use-user'
import { useLoading } from '@/app/AppShell'
import DatePicker from 'react-datepicker'
import zhTW from 'date-fns/locale/zh-TW'
import Link from 'next/link'

import clsx from 'clsx'
import Breadcrumb from '@/app/_components/breadcrumb'
import { useRestaurantInfo } from '@/services/rest-client/use-restaurants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/ui/select'
import {
  FaLocationDot,
  FaArrowUpRightFromSquare,
  FaPaw,
  FaClock,
  FaX,
} from 'react-icons/fa6'
import { FaCalendarAlt, FaUser } from 'react-icons/fa'
import RestaurantRating from '@/app/restaurant/_components/restaurant-rating'
import PhotoGallery from '../_components/photo-gallery'
import CommentGrid from '../_components/comment-grid'
import MapEmbed from '../_components/map-embed'
import StickyNav from '../_components/sticky-nav'
import { serverURL } from '@/config'

import { useRestaurantBusinessHours } from '@/services/rest-client/use-restaurant-hours'
import {
  generateTimeOptionsForDate,
  addDays,
} from '@/utils/hours'

import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'

// ---- 小工具：本地時區的 YYYY-MM-DD（避免 toISOString() 變成前一天） ----
const fmtYMD = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// === 與 Thumbnail 一致的處理：絕對網址原樣、相對路徑保持相對（補前導斜線） ===
const FALLBACK_BANNER = '/images/restaurant/banner-placeholder.jpg'
function normalizeSrc(src, fallback = FALLBACK_BANNER) {
  if (!src) return fallback
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  return `${serverURL}${src.startsWith('/') ? src : `/${src}`}`
}

export default function RestaurantPageClient() {
  const { isAuth, user } = useAuthGet()
  const { safePush } = useLoading() // ✅ Hook 在元件頂層呼叫
  const [open, setOpen] = useState(false)
  console.log(`user: ${JSON.stringify(user)}`)

  const params = useParams()
  const id = params?.id

  const { data} = useRestaurantInfo({ id })
  // console.log(`data: ${JSON.stringify(data)}`)

  // 麵包屑（改為 /restaurant/${id}）
  const items = [
    { label: '吃吃', href: '/restaurant' },
    { label: data?.name || '載入中…', href: `/restaurant/${id}` },
  ]

  // 從 API 取回的照片，做前端 normalize（相對路徑補 serverURL）
  const photos = (data?.photos || []).map((p) => normalizeSrc(p.url))
  // 最多顯示 10 張（維持你原本的 2x3 版位）
  const top10 = photos.slice(0, 10)

  // 後端資料 + dummy（照片/留言維持 dummy）
  const restaurant = {
    // ⬇⬇ 使用 API 的 banner，如果沒有就 fallback 到第一張照片，再不行才用預設
    bannerSrc: normalizeSrc(data?.bannerSrc, top10[0] || FALLBACK_BANNER),

    // ⬇⬇ 改用 API 的照片陣列（已 normalize）
    photoSrc: top10,

    name: data?.name || '載入中…',
    type: data?.type || '載入中…',
    rating:
      typeof data?.rating === 'number'
        ? data.rating.toFixed(1)
        : data?.rating || '5.0',
    city: data?.city || '載入中…',
    area: data?.area || '…',
    street: data?.street || '…',
    description: data?.description || '載入中…',
    lat: data?.lat ?? null,
    lng: data?.lng ?? null,
    websiteUrl: data?.websiteUrl || 'https://www.google.com',
  }

  // const today = new Date().toISOString().split('T')[0]
  // const maxDate = new Date()
  // maxDate.setDate(maxDate.getDate() + 30)
  // const maxDateStr = maxDate.toISOString().split('T')[0]

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { byWeekday } = useRestaurantBusinessHours(id)

  // 日期狀態改用 Date 物件（react-datepicker 需要）
  const [selectedDate, setSelectedDate] = useState(new Date())

  // 把非營業日灰掉
  const isOpenDay = useCallback(
    (date) => {
      if (!byWeekday) return false
      const wd = date.getDay() // 0..6
      return Array.isArray(byWeekday[wd]) && byWeekday[wd].length > 0
    },
    [byWeekday]
  )

  // 邊界：今天 ~ +30 天
  const minDate = new Date()
  const maxDate = addDays(minDate, 30)

  // 如果今天是公休，自動跳到下一個可營業日
  useEffect(() => {
    if (!byWeekday) return
    let d = new Date()
    for (let i = 0; i <= 30; i++) {
      const candidate = addDays(new Date(), i)
      if (isOpenDay(candidate)) {
        d = candidate
        break
      }
    }
    setSelectedDate(d)
  }, [byWeekday, isOpenDay])

  // 依日期產生時間選項（半小時）
  const timeOptions = useMemo(() => {
    if (!byWeekday || !selectedDate) return []
    return generateTimeOptionsForDate(selectedDate, byWeekday, 30)
  }, [byWeekday, selectedDate])

  const [selectedTime, setSelectedTime] = useState('')
  // 人數 / 寵物狀態
  const [partySize, setPartySize] = useState(2) // 預設 2 位
  const [petOption, setPetOption] = useState('pet0') // 預設不帶寵
  const hasPet = petOption !== 'pet0'
  // 送單 loading
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setSelectedTime(timeOptions[0] || '')
  }, [timeOptions])

  // 自訂 input（保持你的圓角樣式）
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className="w-full border border-primary bg-white rounded-full px-4 py-2 h-11 text-base text-center flex items-center justify-center gap-2"
    >
      <FaCalendarAlt className="text-text-primary/30 absolute top-3.5 left-4" />
      <span>{value || '選擇日期'}</span>
    </button>
  ))
  CustomInput.displayName = 'CustomInput'

  // Removed unused handleSubmitReservation function to fix the error

  function goConfirm() {
    if (!selectedDate || !selectedTime) {
      toast.error('請先選擇日期與時間')
      return
    }
    const qs = new URLSearchParams({
      date: fmtYMD(selectedDate), // YYYY-MM-DD
      time: selectedTime, // HH:mm
      party: String(partySize),
      pet: hasPet ? '1' : '0',
    }).toString()

    const confirmUrl = `/restaurant/${id}/reserve/confirm?${qs}`

    if (!isAuth) {
      toast.info('請先登入')
      const loginUrl = `/member/login?redirect=${encodeURIComponent(
        confirmUrl
      )}`
      safePush(loginUrl) // ✅ 使用全域 loading 導航
      return
    }
    safePush(confirmUrl) // ✅ 使用全域 loading 導航
    setSubmitting(true)
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
            <div className="flex flex-col flex-shrink-0 w-full lg:w-3/5 gap-4">
              <StickyNav
                sections={[
                  { id: 'intro', label: '簡介' },
                  { id: 'photo', label: '相片' },
                  { id: 'notice', label: '須知' },
                  { id: 'menu', label: '菜單' },
                  { id: 'comment', label: '評論' },
                ]}
                className="sticky top-16 xl:top-2.5 z-50 bg-background-primary/80 backdrop-blur xl:bg-transparent xl:backdrop-blur-none"
                rootMarginY={{ top: '20%', bottom: '80%' }}
              />

              <div className="flex flex-col gap-16">
                {/* 簡介 */}
                <div
                  id="intro"
                  className="flex flex-col gap-1 md:gap-4 scroll-mt-32"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    <div className="flex flex-shrink-0 text-sm bg-primary text-white px-2 py-1 rounded-full">
                      {restaurant.type}
                    </div>
                    <div className="text-lg md:text-3xl text-wrap">
                      {restaurant.name}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center text-sm">
                    <RestaurantRating rating={restaurant.rating} />
                  </div>
                  <div className="text-sm flex gap-1 items-center mb-4 md:mb-0">
                    <FaLocationDot />
                    {restaurant.city}
                    {restaurant.area}
                    {restaurant.street}
                  </div>
                  <div className="text-base">
                    {restaurant.description}
                  </div>
                </div>

                {/* 相片（來自 API） */}
                <div id="photo" className="flex flex-col gap-4 scroll-mt-32">
                  <div className="text-lg md:text-3xl">
                    <span className="me-1">{restaurant.photoSrc.length}</span>
                    張相片
                  </div>
                  <PhotoGallery
                    photos={photos}
                    maxPreview={5} // 想全顯示就設 0 或拿掉
                    emptyFallback={FALLBACK_BANNER}
                    altBase={restaurant.name}
                  />
                </div>

                {/* 須知 */}
                <div id="notice" className="flex flex-col gap-4 scroll-mt-32">
                  <div className="text-lg md:text-3xl">須知</div>
                  <div className="flex flex-col gap-1">
                    <div className="text-primary">寵物種類與體型限制</div>
                    <div>
                      目前僅開放 小型犬（體重 10
                      公斤以下）及溫和性格的貓咪入店。
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-primary">牽繩與安全措施</div>
                    <div>
                      入店時請替毛孩繫上牽繩，或使用寵物推車／提籠，避免驚嚇其他客人與毛孩。
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-primary">寵物禮儀</div>
                    <div>
                      請飼主確保毛孩已完成基本訓練，避免吠叫、亂跑或攻擊行為。
                    </div>
                    <div>
                      若毛孩不小心在店內大小便，請飼主立即清理並告知店員。
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-primary">健康狀況</div>
                    <div>
                      僅接待已完成疫苗注射、無傳染性疾病的毛孩，確保公共安全。
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-primary">座位與用餐</div>
                    <div>
                      飼主應與毛孩共用指定寵物座位區，請勿讓毛孩直接坐在人用餐桌或椅子上。
                    </div>
                    <div>
                      提供寵物鮮食餐點，禁止餵食店內提供的人類食物給毛孩（除非經店員允許）。
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-primary">店內規範</div>
                    <div>
                      為維護其他客人用餐品質，如毛孩過於吵鬧或不聽管教，店家有權婉拒繼續用餐。
                    </div>
                  </div>
                </div>

                {/* 菜單 */}
                <div id="menu" className="flex flex-col gap-4 scroll-mt-32">
                  <div className="text-lg md:text-3xl">菜單</div>
                  <Link
                    href={restaurant.websiteUrl}
                    className="flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaArrowUpRightFromSquare />
                    <span className="text-primary underline">
                      在餐廳網站查看菜單
                    </span>
                  </Link>
                </div>

                {/* 評論（dummy） */}
                <div id="comment" className="flex flex-col gap-4 scroll-mt-32">
                  <div className="text-lg md:text-3xl">其他2位顧客怎麼說</div>
                  <div className="text-sm">
                    毛起來嗑 CafeMochi 的評分，來自曾造訪用餐過的客人。
                  </div>
                  <div className="flex flex-col">
                    <div className="text-lg">整體評分和評論</div>
                    <div className="text-primary text-sm">
                      只有在這家餐廳用餐過的食客才能發表評論
                    </div>
                    <div className="flex justify-between py-4">
                      <div className="flex flex-col gap-2">
                        <RestaurantRating rating={restaurant.rating} />
                        <div className="flex gap-4">
                          <div className="flex flex-col"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>2則評論</div>
                    <Select>
                      <SelectTrigger className="border-none bg-white rounded-full overflow-hidden px-4 py-2 outline-none text-sm text-gray-400 w-40">
                        <SelectValue placeholder="排序方式" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-sm">
                        <SelectItem
                          value="rankingDescend"
                          className="hover:bg-primary/10"
                        >
                          日期最新
                        </SelectItem>
                        <SelectItem
                          value="rankingAscend"
                          className="hover:bg-primary/10"
                        >
                          評價最高
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-4 overflow-hidden">
                    <CommentGrid />
                  </div>
                </div>
              </div>
            </div>

            {/* 手機版：訂位 */}
            <div className="flex flex-col items-end lg:hidden w-full p-4 gap-2 fixed bottom-0 left-0 right-0 z-20">
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className={clsx(
                  'flex items-center justify-center rounded-full bg-primary text-white',
                  open ? 'w-14 h-14' : 'w-14 h-14'
                )}
              >
                {open ? (
                  <FaX />
                ) : (
                  <span className="text-sm leading-none">
                    立即
                    <br />
                    訂位
                  </span>
                )}
              </button>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 px-8 py-4 rounded-3xl w-full bg-white shadow-lg shadow-[#f0cdba]"
                  >
                    <div className="text-3xl text-center">訂位</div>

                    {/* 人數 */}
                    <Select
                      value={String(partySize)}
                      onValueChange={(v) => setPartySize(Number(v))}
                    >
                      <SelectTrigger className="w-full border-primary bg-white rounded-full overflow-hidden px-4 py-2 outline-none text-base h-11">
                        <FaUser className="text-text-primary/30" />
                        <SelectValue placeholder="選擇人數" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-base">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <SelectItem
                            key={n}
                            value={String(n)}
                            className="hover:bg-primary/10"
                          >
                            {n} 位大人
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* 寵物 */}
                    <Select value={petOption} onValueChange={setPetOption}>
                      <SelectTrigger className="w-full border-primary bg-white rounded-full overflow-hidden px-4 py-2 outline-none text-base h-11">
                        <FaPaw className="text-text-primary/30" />
                        <SelectValue placeholder="選擇是否攜寵" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-base">
                        <SelectItem
                          value="pet0"
                          className="hover:bg-primary/10"
                        >
                          不攜帶寵物
                        </SelectItem>
                        <SelectItem
                          value="pet1"
                          className="hover:bg-primary/10"
                        >
                          攜帶寵物
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {/* 日期（限制 30 天，若選到公休→提示並不變更） */}
                    <div className="flex flex-col relative">
                      {/* <FaCalendarAlt className="absolute ml-4 mt-3.5 text-text-primary/30" /> */}
                      <DatePicker
                        calendarClassName="my-datepicker"
                        selected={selectedDate}
                        onChange={(d) => setSelectedDate(d)}
                        minDate={minDate}
                        maxDate={maxDate}
                        filterDate={isOpenDay}
                        locale={zhTW}
                        dateFormat="yyyy-MM-dd"
                        // UI 體驗小強化：
                        placeholderText="選擇日期"
                        showPopperArrow={false}
                        todayButton="今天"
                        customInput={<CustomInput />}
                      />
                      <div className="mt-1 text-xs text-primary/100 text-center">
                        {byWeekday
                          ? '僅可選營業日（30 天內）'
                          : '讀取營業時間中…'}
                      </div>
                    </div>

                    {/* 時間（半小時粒度；今天只列「現在往後」） */}
                    <Select
                      value={selectedTime}
                      onValueChange={setSelectedTime}
                      disabled={!timeOptions.length}
                    >
                      <SelectTrigger className="w-full border-primary bg-white rounded-full overflow-hidden px-4 py-2 outline-none text-base h-11">
                        <FaClock className="text-text-primary/30" />
                        <SelectValue
                          placeholder={timeOptions[0] || '無可選時段'}
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-base max-h-64 overflow-auto">
                        {timeOptions.map((t) => (
                          <SelectItem
                            key={t}
                            value={t}
                            className="hover:bg-primary/10"
                          >
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <button
                      onClick={goConfirm}
                      disabled={!timeOptions.length || submitting}
                      className="text-white bg-button-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-button-secondary transition-all duration-300 active:translate-y-0.5 py-2 rounded-full"
                    >
                      {submitting ? '送出中…' : '下一步：確認訂位'}
                    </button>

                    {!isAuth && (
                      <div className="text-xs text-center text-primary/80">
                        請先
                        <Link href="/member/login" className="underline ml-1">
                          登入
                        </Link>
                        再進行訂位
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 右側：訂位 + 地圖 + 其他資訊 */}
            <div className="flex flex-col w-full lg:w-2/5 gap-16 grow">
              <div
                className={clsx(
                  'hidden lg:flex sticky top-16 z-10 flex-col gap-4 p-8 rounded-4xl bg-white hover:shadow-xl hover:shadow-[#f0cdba] transition-shadow duration-300',
                  scrolled && 'shadow-xl shadow-[#f0cdba]'
                )}
              >
                <div className="text-3xl text-center">訂位</div>

                {/* 人數 */}
                <Select
                  value={String(partySize)}
                  onValueChange={(v) => setPartySize(Number(v))}
                >
                  <SelectTrigger className="w-full border-primary bg-white rounded-full overflow-hidden px-4 py-2 outline-none text-base h-11">
                    <FaUser className="text-text-primary/30" />
                    <SelectValue placeholder="選擇人數" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-base">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <SelectItem
                        key={n}
                        value={String(n)}
                        className="hover:bg-primary/10"
                      >
                        {n} 位大人
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* 寵物 */}
                <Select value={petOption} onValueChange={setPetOption}>
                  <SelectTrigger className="w-full border-primary bg-white rounded-full overflow-hidden px-4 py-2 outline-none text-base h-11">
                    <FaPaw className="text-text-primary/30" />
                    <SelectValue placeholder="選擇是否攜寵" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-base">
                    <SelectItem value="pet0" className="hover:bg-primary/10">
                      不攜帶寵物
                    </SelectItem>
                    <SelectItem value="pet1" className="hover:bg-primary/10">
                      攜帶寵物
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* 日期（限制 30 天，若選到公休→提示並不變更） */}
                <div className="flex flex-col relative">
                  {/* <FaCalendarAlt className="absolute ml-4 mt-3.5 text-text-primary/30" /> */}
                  <DatePicker
                    calendarClassName="my-datepicker"
                    selected={selectedDate}
                    onChange={(d) => setSelectedDate(d)}
                    minDate={minDate}
                    maxDate={maxDate}
                    filterDate={isOpenDay}
                    locale={zhTW}
                    dateFormat="yyyy-MM-dd"
                    // UI 體驗小強化：
                    placeholderText="選擇日期"
                    showPopperArrow={false}
                    todayButton="今天"
                    customInput={<CustomInput />}
                  />
                  <div className="mt-1 text-xs text-primary/100 text-center">
                    {byWeekday ? '僅可選營業日（30 天內）' : '讀取營業時間中…'}
                  </div>
                </div>

                {/* 時間（半小時粒度；今天只列「現在往後」） */}
                <Select
                  value={selectedTime}
                  onValueChange={setSelectedTime}
                  disabled={!timeOptions.length}
                >
                  <SelectTrigger className="w-full border-primary bg-white rounded-full overflow-hidden px-4 py-2 outline-none text-base h-11">
                    <FaClock className="text-text-primary/30" />
                    <SelectValue placeholder={timeOptions[0] || '無可選時段'} />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-base max-h-64 overflow-auto">
                    {timeOptions.map((t) => (
                      <SelectItem
                        key={t}
                        value={t}
                        className="hover:bg-primary/10"
                      >
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <button
                  onClick={goConfirm}
                  disabled={!timeOptions.length || submitting}
                  className="text-white bg-button-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-button-secondary transition-all duration-300 active:translate-y-0.5 py-2 rounded-full"
                >
                  {submitting ? '送出中…' : '下一步：確認訂位'}
                </button>
                {!isAuth && (
                  <div className="text-xs text-center text-primary/80">
                    請先
                    <Link href="/member/login" className="underline ml-1">
                      登入
                    </Link>
                    再進行訂位
                  </div>
                )}
              </div>

              {/* 地圖 */}
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

              {/* 其他資訊 */}
              <div className="flex flex-col gap-4">
                <div className="text-lg md:text-3xl">其他資訊</div>
                <div className="flex flex-col gap-1">
                  <div className="text-primary">營業時間</div>
                  <div>
                    星期二, 星期三, 星期五 12:00–14:30 星期二, 星期三
                    18:00–21:30 星期五–星期日 17:30–21:30 星期六, 星期日
                    11:30–14:30
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-primary">價位</div>
                  <div>NT$200及以上</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-primary">料理</div>
                  <div>早午餐, 中式料理, 法式料理</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-primary">停車場</div>
                  <div>無提供</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
