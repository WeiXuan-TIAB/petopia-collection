'use client'

import React, { useMemo, useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import RatingStars from '../common/rating-stars'
import CategoryTag from '../common/category-tag'
import PlaceFeatures from './place-features'
import PlaceDetailMenu from '../common/place-detail-menu'
import SortDropdownBtn from '../btn/sort-option-btn'

const toExternalHref = (url) =>
  /^https?:\/\//i.test(url) ? url : `https://${url || ''}`.replace(/\/+$/, '')

export default function PlaceDetailUI({
  // 資料
  title,
  imageUrl,
  rating = 0,
  district,
  category,
  address,
  phone,
  website,
  isOpen,
  businessHours,
  description,
  features = {},
  photos = [],

  // 狀態
  isFavorited = false,

  // 按鈕事件
  onNavigate,
  onFavoriteToggle,
  onReservation,
  onClose,
  onPublishPhoto,

  // 其它
  ReviewsSectionComponent, // 容器傳進來的評論區
  actionIcons = {},
  className = '',
}) {
  // sticky menu + anchor
  const containerRef = useRef(null)
  const [activeTab, setActiveTab] = useState('overview')

  const handleScrollTo = (id) => {
    const el = containerRef.current?.querySelector(`#section-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // 照片顯示/排序
  const [photoSortBy, setPhotoSortBy] = useState('最新')
  const [showAllPhotos, setShowAllPhotos] = useState(false)

  const sortedPhotos = useMemo(() => {
    const arr = [...photos]
    switch (photoSortBy) {
      case '評分最高':
        return arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      case '評分最低':
        return arr.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0))
      case '最新':
      default:
        return arr.sort((a, b) => {
          const tb = new Date(b.created_at || b.id || 0).getTime()
          const ta = new Date(a.created_at || a.id || 0).getTime()
          return tb - ta
        })
    }
  }, [photos, photoSortBy])

  const displayedPhotos = showAllPhotos
    ? sortedPhotos
    : sortedPhotos.slice(0, 4)
  const remainingPhotos = Math.max(sortedPhotos.length - 4, 0)

  // 隱藏捲軸（仍可滾動）
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.classList.add('scrollbar-hide')
  }, [])


  const {
    navigate,
    reserve,
    address: iconAddress,
    hours: iconHours,
    phone: iconPhone,
    website: iconWebsite,
  } = actionIcons

  return (
    <div
      ref={containerRef}
      className={`w-[320px] md:w-[400px] lg:w-[480px] xl:w-[534px] max-h-[90vh] overflow-auto scrollbar-hide
                  bg-[#FDEFE6] rounded-[10px] md:rounded-[20px] shadow-lg p-3 md:p-4 ${className}`}
    >
      {/* 1) 主圖 */}
      <div className="w-full aspect-[495/388] rounded-[14px] overflow-hidden relative">
        <Image
          src={
            imageUrl ||
            'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop&auto=format'
          }
          alt={title ? `${title} 的照片` : '地點圖片'}
          fill
          className="object-cover"
        />
        {/* 關閉按鈕 - 固定在主圖右上角 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 z-10"
          aria-label="關閉"
        >
          <span className="text-gray-700 text-lg">✕</span>
        </button>
      </div>
      {/* 2) 標籤 */}
      <div className="mt-2 flex flex-wrap gap-2">
        {category && <CategoryTag category={category} />}
      </div>
      {/* 3) 標題 */}
      <h1 className="mt-2 text-[18px] md:text-[20px] font-semibold text-[#3E2E2E]">
        {title}
      </h1>
      {/* 4) 評分 + 簡單地區 */}
      <div className="mt-1 flex items-center gap-2">
        <RatingStars rating={rating || 0} />
        <span className="text-sm text-[#3E2E2E]">
          {Number(rating || 0).toFixed(1)}
        </span>
        {district && (
          <span className="text-sm text-[#8B7355] truncate">・{district}</span>
        )}
      </div>
      {/* 5) 地址 */}
      {address && (
        <div className="mt-1 flex items-center gap-2 text-[#3E2E2E]">
          {iconAddress && (
            <FontAwesomeIcon icon={iconAddress} className="w-4 h-4" />
          )}
          <span className="text-sm">{address}</span>
        </div>
      )}
      {/* 6) 營業時間（寫死版顯示） */}
      {businessHours && (
        <div className="mt-1 flex items-center gap-2">
          {iconHours && (
            <FontAwesomeIcon icon={iconHours} className="w-4 h-4" />
          )}
          <span className="text-sm">
            {typeof isOpen === 'boolean' && (
              <>
                {isOpen ? (
                  <span className="text-[#1A9562]">營業中</span>
                ) : (
                  <span className="text-[#EE5A36]">已打烊</span>
                )}
                {' ・ '}
              </>
            )}
            {businessHours}
          </span>
        </div>
      )}
      {/* 7) Sticky 選單 - z-index 保持 z-20 */}
      <div className="mt-3 sticky top-0 z-20 bg-[#FDEFE6]/90 backdrop-blur supports-[backdrop-filter]:bg-[#FDEFE6]/90">
        <PlaceDetailMenu
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onScrollToSection={handleScrollTo}
          className="pt-1"
          sticky
        />
      </div>
      {/* 總覽（把三顆主按鈕移到總覽最上方） */}
      <section id="section-overview" className="pt-3">
        {/* 主按鈕 */}
        <div className="space-y-2 mb-3">
          {/* 第一排：導航 + 收藏 */}
          <div className="grid grid-cols-2 gap-2 px-10">
            <button
              type="button"
              onClick={onNavigate}
              className="h-10 rounded-full bg-[#F5AB54] text-white font-medium flex items-center justify-center gap-2 hover:opacity-90"
            >
              {navigate && (
                <FontAwesomeIcon icon={navigate} className="w-4 h-4" />
              )}
              導航
            </button>

            <button
              type="button"
              onClick={onFavoriteToggle}
              className="h-10 rounded-full bg-[#F5AB54] text-white font-medium flex items-center justify-center gap-2 hover:opacity-90"
            >
              {actionIcons?.favoriteOn || actionIcons?.favoriteOff ? (
                <FontAwesomeIcon
                  icon={
                    isFavorited
                      ? actionIcons.favoriteOn
                      : actionIcons.favoriteOff
                  }
                  className="w-4 h-4"
                />
              ) : (
                <span className="inline-block w-4 text-center">♥</span>
              )}
              收藏
            </button>
          </div>

          {/* 第二排：訂位（佔滿整排） */}
          <div className="px-16">
            <button
              type="button"
              onClick={onReservation}
              className="w-full h-10 rounded-full bg-[#F5AB54] text-white font-medium flex items-center justify-center gap-2 hover:opacity-90"
            >
              {reserve && (
                <FontAwesomeIcon icon={reserve} className="w-4 h-4" />
              )}
              訂位
            </button>
          </div>
        </div>

        {/* 其餘資訊（電話/網站/描述/特色） */}
        <div className="space-y-2 text-[#3E2E2E]">
          {phone && (
            <div className="flex items-center gap-2">
              {iconPhone && (
                <FontAwesomeIcon icon={iconPhone} className="w-4 h-4" />
              )}
              <a
                href={`tel:${phone}`}
                className="text-sm underline hover:no-underline"
              >
                {phone}
              </a>
            </div>
          )}
          {website && (
            <div className="flex items-center gap-2">
              {iconWebsite && (
                <FontAwesomeIcon icon={iconWebsite} className="w-4 h-4" />
              )}
              <a
                href={toExternalHref(website)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline hover:no-underline"
              >
                官方網站
              </a>
            </div>
          )}
          {description && (
            <p className="text-sm leading-relaxed">{description}</p>
          )}
        </div>

        {/* 設施特色 */}
        <div className="mt-3">
          <PlaceFeatures features={features} />
        </div>
      </section>
      {/* 評論 */}
      <section id="section-reviews" className="pt-6">
        {ReviewsSectionComponent}
      </section>
      {/* 照片 */}
      <section id="section-photos" className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[20px] font-medium text-[#3E2E2E]">相片</h3>
          <SortDropdownBtn
            value={photoSortBy}
            onChange={setPhotoSortBy}
            className="!h-9"
            context="photos" // 🔧 加上 context
            options={[
              { value: '最新', label: '最新' },
              { value: '評分最高', label: '評分最高' },
              { value: '評分最低', label: '評分最低' },
            ]}
          />
        </div>

        {/* 相片格 */}
        <div className="grid grid-cols-4 gap-2">
          {displayedPhotos.map((p, idx) => (
            <div
              key={p.id ?? p.url ?? idx}
              className="relative w-full aspect-square rounded-[10px] overflow-hidden"
            >
              <Image
                src={p.url}
                alt={p.caption || '相片'}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* 底部：更多 + 發表相片 */}
        <div className="mt-3 flex items-center justify-between">
          {remainingPhotos > 0 && !showAllPhotos ? (
            <button
              type="button"
              className="px-4 h-9 rounded-[12px] bg-[#F5AB54] text-white font-medium hover:opacity-90"
              onClick={() => setShowAllPhotos(true)}
            >
              更多相片（{remainingPhotos}）
            </button>
          ) : (
            photos.length > 4 && (
              <button
                type="button"
                className="px-4 h-9 rounded-[12px] bg-[#F5AB54] text-white font-medium hover:opacity-90"
                onClick={() => setShowAllPhotos(false)}
              >
                收合相片
              </button>
            )
          )}

          <button
            type="button"
            onClick={onPublishPhoto}
            className="px-3 h-9 rounded-[12px] border-2 border-[#EE5A36] text-[#EE5A36] bg-white font-medium flex items-center gap-2 hover:bg-[#FFF3EF]"
          >
            {actionIcons?.publishPhoto && (
              <FontAwesomeIcon
                icon={actionIcons.publishPhoto}
                className="w-4 h-4"
              />
            )}
            發表相片
          </button>
        </div>
      </section>
    </div>
  )
}
