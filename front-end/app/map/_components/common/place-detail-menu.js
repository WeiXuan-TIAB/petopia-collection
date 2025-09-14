'use client'

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'

/**
 * PlaceDetailMenu
 *
 * Props:
 * - items?: Array<{ id: string; label: string }>
 * - activeTab?: string                 // 受控用法（外部控制當前 tab）
 * - defaultTab?: string                // 非受控初始值（預設 'overview'）
 * - onTabChange?: (id: string) => void
 * - onScrollToSection?: (id: string) => void
 * - sticky?: boolean                   // 是否吸頂
 * - className?: string
 */
export default function PlaceDetailMenu({
  items,
  activeTab,
  defaultTab = 'overview',
  onTabChange,
  onScrollToSection,
  sticky = false,
  className = '',
}) {
  const fallbackItems = useMemo(
    () =>
      items?.length
        ? items
        : [
            { id: 'overview', label: '總覽' },
            { id: 'reviews', label: '評論' },
            { id: 'photos', label: '照片' },
          ],
    [items]
  )

  const isControlled = typeof activeTab === 'string'
  const [currentTab, setCurrentTab] = useState(activeTab ?? defaultTab)

  // 同步受控值
  useEffect(() => {
    if (isControlled && activeTab !== currentTab) {
      setCurrentTab(activeTab)
    }
  }, [isControlled, activeTab, currentTab])

  // 切換 tab
  const handleChange = useCallback(
    (id) => {
      if (!isControlled) setCurrentTab(id)
      onTabChange?.(id)
      onScrollToSection?.(id)
    },
    [isControlled, onTabChange, onScrollToSection]
  )

  // 鍵盤左右鍵切換
  const containerRef = useRef(null)
  const onKeyDown = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const idx = fallbackItems.findIndex((i) => i.id === currentTab)
    if (idx === -1) return
    const nextIdx =
      e.key === 'ArrowRight'
        ? (idx + 1) % fallbackItems.length
        : (idx - 1 + fallbackItems.length) % fallbackItems.length
    handleChange(fallbackItems[nextIdx].id)
  }

  return (
    <div
      className={`
        relative
        ${
          sticky
            ? 'sticky top-0 z-20 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60'
            : ''
        }
        ${className}
      `}
    >

      <div
        ref={containerRef}
        role="tablist"
        aria-label="地點詳情選單"
        aria-orientation="horizontal"
        tabIndex={0} // ✅ 讓 tablist 可聚焦，消除 ESLint 警告
        className="max-w-full w-full px-6 py-2"
        onKeyDown={onKeyDown}
      >
        <div className="flex justify-between items-center gap-4">
          {fallbackItems.map((item) => {
            const selected = currentTab === item.id
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`section-${item.id}`}
                onClick={() => handleChange(item.id)}
                className={`
                  relative pb-2 text-[18px] md:text-[20px] font-medium
                  transition-colors duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 rounded-sm
                  ${
                    selected
                      ? 'text-[#3E2E2E]'
                      : 'text-[#8B7355] hover:text-[#3E2E2E]'
                  }
                `}
              >
                {item.label}
                {/* 黃色底線 */}
                <span
                  aria-hidden="true"
                  className={`
                    absolute left-0 right-0 bottom-0 h-[3px] rounded-t-sm bg-[#F5AB54]
                    transition-all duration-200
                    ${
                      selected
                        ? 'opacity-100 scale-x-100'
                        : 'opacity-0 scale-x-0'
                    }
                    origin-left
                  `}
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
