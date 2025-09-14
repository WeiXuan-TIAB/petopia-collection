'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BlurToast({
  isVisible,
  onClose,
  children,        // 左側內容
  rightContent,    // 右側內容（可選）
  className = '',
  toastClassName = '',
  backdropBlur = 'backdrop-blur-md', // e.g. 'backdrop-blur-sm|md|lg'
  backdropTint = 'bg-black/30',      // e.g. 'bg-black/30'
  lockScroll = true,                 // ✅ 新增：開啟時鎖住 body 捲動
}) {
  // Esc 關閉
  useEffect(() => {
    if (!isVisible) return
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isVisible, onClose])

  // ✅ 開啟時鎖住 body 滾動（支援多個 Toast 疊加）
  useEffect(() => {
    if (!lockScroll || !isVisible) return
    const body = document?.body
    if (!body) return
    const current = Number(body.dataset.scrollLock || 0) + 1
    body.dataset.scrollLock = String(current)
    body.classList.add('overflow-hidden', 'touch-none') // 禁止滾動/觸控滾動

    return () => {
      const n = Math.max(0, Number(body.dataset.scrollLock || 1) - 1)
      if (n === 0) {
        body.classList.remove('overflow-hidden', 'touch-none')
        delete body.dataset.scrollLock
      } else {
        body.dataset.scrollLock = String(n)
      }
    }
  }, [isVisible, lockScroll])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="通知"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
          onClick={() => onClose?.()} // 點背景關閉
        >
          {/* 霧面背景 */}
          <div className={`absolute inset-0 ${backdropTint} ${backdropBlur}`} />

          {/* Toast 內容 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
            className={`
              relative bg-gradient-to-br from-orange-200 to-orange-300
              rounded-3xl mx-4 w-full max-w-md shadow-2xl overflow-hidden
              ${toastClassName}
            `}
            onClick={(e) => e.stopPropagation()} // 阻擋冒泡
          >
            {/* 關閉按鈕 */}
            <button
              type="button"
              onClick={() => onClose?.()}
              aria-label="關閉通知"
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200"
            >
              <span className="text-gray-700 text-lg">×</span>
            </button>

            {/* 主要內容區域：手機直向、桌機左右 */}
            <div className="flex flex-col sm:flex-row min-h-[200px]">
              <div className={`flex-1 p-6 ${rightContent ? 'sm:pr-3' : ''} flex flex-col justify-center`}>
                {children}
              </div>
              {rightContent ? (
                <div className="flex-1 p-6 sm:pl-3 flex items-center justify-center">
                  {rightContent}
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}