'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'

/**
 * PetProfile
 * - 若提供 dataSrc，會自動 fetch JSON 並覆蓋 props
 * - tags 可傳入 ReactNode（外部 Tag 元件）
 */
export default function PetProfile({
  // 直接給資料（不使用 fetch 時）
  images = [],
  avatarSrc = '',
  name = '',
  age = '',
  breed = '',
  distance = '',
  tags = null,               // e.g. <YourTagList tags={[...]} />
  intro = '',

  // 若想直接從 public 抓 JSON，給 dataSrc，如：/map-data/petprofile.json
  dataSrc = '',

  // 樣式
  className = '',
}) {
  const [loaded, setLoaded] = useState(false)
  const [data, setData] = useState(null)
  const [idx, setIdx] = useState(0)
  const [showMore, setShowMore] = useState(false)

  // 可選的 fetch
  useEffect(() => {
    if (!dataSrc) return
    let alive = true
    ;(async () => {
      try {
        const res = await fetch(dataSrc, { cache: 'no-store' })
        const json = await res.json()
        if (!alive) return
        setData(json)
        setLoaded(true)
      } catch (err) {
        console.error('PetProfile fetch error:', err)
        setLoaded(true)
      }
    })()
    return () => { alive = false }
  }, [dataSrc])

  // 資料來源：fetch > props
  const model = useMemo(() => {
    const raw = dataSrc && data ? data : {
      images, avatarSrc, name, age, breed, distance, tags, intro
    }
    return {
      images: raw.images || [],
      avatarSrc: raw.avatarSrc || '',
      name: raw.name || '',
      age: raw.age ?? '',
      breed: raw.breed || '',
      distance: raw.distance ?? '',
      tags: raw.tags ?? null,
      intro: typeof raw.intro === 'string' ? raw.intro : (raw.intro ?? '').toString(),
    }
  }, [dataSrc, data, images, avatarSrc, name, age, breed, distance, tags, intro])

  const total = model.images.length
  const goPrev = () => setIdx((p) => (p - 1 + total) % total)
  const goNext = () => setIdx((p) => (p + 1) % total)

  if (dataSrc && !loaded && !data) {
    return <div className="text-sm text-[#8B7355] p-3">載入中...</div>
  }

  return (
    <div
      className={[
        'w-full max-w-[360px]',
        'bg-[#FBB360] rounded-[32px] p-5 md:p-6',
        'shadow-[0_6px_18px_rgba(0,0,0,0.06)]',
        className,
      ].join(' ')}
    >
      {/* 圖片輪播 */}
      <div className="relative w-full rounded-[24px] overflow-hidden">
        {total > 0 ? (
          <Image
            src={model.images[idx]}
            alt={model.name || 'pet'}
            width={640}
            height={640}
            className="w-full h-[280px] object-cover"
            priority
          />
        ) : (
          <div className="w-full h-[280px] bg-white/30" />
        )}

        {/* 左右控制 */}
        {total > 1 && (
          <>
            <button
              aria-label="上一張"
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full bg-white/70 hover:bg-white transition"
            >
              ◀
            </button>
            <button
              aria-label="下一張"
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full bg-white/70 hover:bg-white transition"
            >
              ▶
            </button>
          </>
        )}

        {/* 會員頭像 */}
        {model.avatarSrc && (
          <div className="absolute bottom-3 right-3 w-12 h-12 rounded-full border-2 border-white overflow-hidden">
            <Image
              src={model.avatarSrc}
              alt="會員頭像"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 圓點指示器 */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {model.images.map((_, i) => (
              <span
                key={i}
                className={[
                  'block rounded-full transition-all',
                  i === idx ? 'w-2.5 h-2.5 bg-white' : 'w-2 h-2 bg-white/60'
                ].join(' ')}
              />
            ))}
          </div>
        )}
      </div>

      {/* Tag 區（你會傳自己的 Tag 元件） */}
      {model.tags && (
        <div className="mt-3 flex flex-wrap gap-2">
          {model.tags}
        </div>
      )}

      {/* 文字資訊 */}
      <div className="mt-4">
        {/* 名稱 + 年齡/品種/距離 */}
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-[22px] leading-tight font-extrabold text-[#2E2019]">
            {model.name}
          </h2>
          {/* 距離可放右側，如果你要跟圖一致 */}
        </div>
        <div className="mt-1 text-[14px] text-[#2E2019] font-medium">
          {model.age !== '' && <span>{model.age}歲</span>}
          {model.breed && <span>・{model.breed}</span>}
          {model.distance !== '' && <span>・{model.distance}km</span>}
        </div>

        {/* 自我介紹（限制 6 行 + 看更多） */}
        <p
          className={[
            'mt-3 text-[14px] leading-relaxed text-[#3E2E2E]',
            !showMore ? 'line-clamp-6' : ''
          ].join(' ')}
        >
          {model.intro}
        </p>

        {model.intro && model.intro.length > 0 && (
          <button
            onClick={() => setShowMore((s) => !s)}
            className="mt-1 text-sm text-[#2E2019]/80 underline underline-offset-2"
          >
            {showMore ? '收起' : '看更多'}
          </button>
        )}
      </div>

      {/* 底部按鈕 */}
      <div className="mt-4 flex justify-center gap-5">
        <button
          aria-label="不喜歡"
          className="w-12 h-12 rounded-full grid place-items-center bg-[#B2DDF7] text-white text-xl"
        >
          ✕
        </button>
        <button
          aria-label="喜歡"
          className="w-12 h-12 rounded-full grid place-items-center bg-[#B2DDF7] text-white text-xl"
        >
          ❤
        </button>
      </div>
    </div>
  )
}
