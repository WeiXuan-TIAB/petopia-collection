'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronLeft, FaChevronRight, FaXmark } from 'react-icons/fa6'

/**
 * PhotoGallery
 * @param {string[]} photos - 已處理過的圖片絕對網址（建議用你現有的 normalizeSrc 對 data.photos 映射）
 * @param {number} maxPreview - 預覽區顯示的最大張數（含第一張 hero），預設 5；設 0 或 undefined 代表顯示全部
 * @param {string} emptyFallback - 當沒有任何照片時的預設圖
 * @param {string} altBase - 圖片 alt 前綴
 */
export default function PhotoGallery({
  photos = [],
  maxPreview = 5,
  emptyFallback = '/images/restaurant/banner-placeholder.jpg',
  altBase = 'restaurant photo',
}) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [current, setCurrent] = useState(0)

  // 決定預覽要顯示幾張
  const previewPhotos = useMemo(() => {
    if (!photos?.length) return []
    if (!maxPreview || maxPreview <= 0) return photos
    return photos.slice(0, maxPreview)
  }, [photos, maxPreview])

  const remaining = Math.max(0, (photos?.length || 0) - previewPhotos.length)

  const openAt = useCallback((idx) => {
    setCurrent(idx)
    setViewerOpen(true)
  }, [])

  const close = useCallback(() => setViewerOpen(false), [])

  const goPrev = useCallback(() => {
    setCurrent((i) => (i - 1 + photos.length) % photos.length)
  }, [photos.length])

  const goNext = useCallback(() => {
    setCurrent((i) => (i + 1) % photos.length)
  }, [photos.length])

  // 鍵盤控制
  useEffect(() => {
    if (!viewerOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewerOpen, close, goPrev, goNext])

  // 無圖：顯示 fallback
  if (!photos?.length) {
    return (
      <div className="rounded-4xl overflow-hidden">
        <Image
          width={1200}
          height={800}
          src={emptyFallback}
          alt={`${altBase} placeholder`}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
    )
  }

  // 只有 1 張：顯示大圖可點開燈箱
  if (previewPhotos.length === 1) {
    return (
      <>
        <button
          type="button"
          className="relative w-full rounded-4xl overflow-hidden cursor-zoom-in focus:outline-none"
          onClick={() => openAt(0)}
        >
          <Image
            width={1600}
            height={1200}
            src={previewPhotos[0]}
            alt={`${altBase} 1`}
            className="w-full h-auto object-cover"
            priority
          />
        </button>
        <Lightbox
          open={viewerOpen}
          onClose={close}
          src={photos[current]}
          onPrev={goPrev}
          onNext={goNext}
          index={current}
          total={photos.length}
        />
      </>
    )
  }

  // 多張：左大圖 + 右 2x2 小圖，超過的以 "+N" 疊加顯示
  const hero = previewPhotos[0]
  const grid = previewPhotos.slice(1, 5) // 右側最多 4 張

  return (
    <>
      <div className="grid grid-cols-4 [grid-template-rows:repeat(2,minmax(0,1fr))] gap-2 rounded-4xl overflow-hidden">
        {/* 左側 hero 佔兩列兩欄 */}
        <button
          type="button"
          onClick={() => openAt(0)}
          className="col-span-2 row-span-2 relative aspect-[3/4] lg:aspect-[3/4] bg-gray-100 group overflow-hidden"
          aria-label="preview-hero"
        >
          <Image
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            src={hero}
            alt={`${altBase} 1`}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </button>

        {/* 右側小圖 */}
        {grid.map((src, i) => {
          const photoIndex = i + 1 // 真實索引（相對 photos）
          const isLastCell = i === grid.length - 1 && remaining > 0

          return (
            <button
              type="button"
              key={src}
              onClick={() => openAt(photoIndex)}
              className="relative bg-primary h-full group overflow-hidden"
              aria-label={`preview-${photoIndex + 1}`}
            >
              <Image
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                src={src}
                alt={`${altBase} ${photoIndex + 1}`}
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {isLastCell && (
                <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center text-lg">
                  +{remaining}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* 燈箱 */}
      <Lightbox
        open={viewerOpen}
        onClose={close}
        src={photos[current]}
        onPrev={goPrev}
        onNext={goNext}
        index={current}
        total={photos.length}
      />
    </>
  )
}

/** 輕量 Lightbox 視窗 */
function Lightbox({ open, onClose, src, onPrev, onNext, index, total }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
        >
          {/* 關閉區域（背景） */}
          <button
            className="absolute inset-0 cursor-zoom-out"
            aria-label="close"
            onClick={onClose}
          />

          {/* 圖片容器 */}
          <motion.div
            className="relative max-w-[90vw] max-h-[85vh] w-auto h-auto"
            initial={{ scale: 0.98, opacity: 0.9 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
          >
            <Image
              src={src}
              alt={`photo ${index + 1} / ${total}`}
              width={1600}
              height={1200}
              className="object-contain w-auto h-auto max-w-[90vw] max-h-[85vh] select-none"
              priority
            />

            {/* 關閉按鈕 */}
            <button
              className="absolute -top-12 right-0 md:top-4 md:right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
              onClick={onClose}
              aria-label="close"
            >
              <FaXmark />
            </button>

            {/* 左右切換 */}
            <div className="absolute inset-y-0 left-2 right-2 lg:-left-16 lg:-right-16 flex items-center justify-between pointer-events-none">
              <button
                className="pointer-events-auto p-3 rounded-full bg-white/20 hover:bg-white/30 text-white"
                onClick={onPrev}
                aria-label="previous"
              >
                <FaChevronLeft />
              </button>
              <button
                className="pointer-events-auto p-3 rounded-full bg-white/20 hover:bg-white/30 text-white"
                onClick={onNext}
                aria-label="next"
              >
                <FaChevronRight />
              </button>
            </div>

            {/* 索引指示 */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white text-sm opacity-80">
              {index + 1} / {total}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
