// app/map/_components/card/place-cards-section-ui.js
'use client'

import React from 'react'
import SortDropdownBtn from '@/app/map/_components/btn/sort-option-btn'
import SearchBox from '../search/search-box'

// 標題列組件 - 恢復排序下拉選單
function TitleBar({ titleInfo, sortBy, onSortChange, className = '' }) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex-1 min-w-0">
        <h2 className="text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px] font-bold text-[#3E2E2E]">
          {titleInfo.title}
        </h2>
        {titleInfo.filters?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {titleInfo.filters.map((filter, index) => (
              <span
                key={index}
                className="text-[10px] md:text-[12px] text-[#F5AB54]"
              >
                ({filter})
              </span>
            ))}
          </div>
        )}
      </div>

      <SortDropdownBtn
        context="places"
        value={sortBy}
        onChange={onSortChange}
        className="ml-2 flex-shrink-0"
      />
    </div>
  )
}

// 錯誤狀態組件
function ErrorMessage({ error, onRetry, className = '' }) {
  if (!error) return null

  return (
    <div
      className={`flex items-center justify-between text-orange-600 text-xs bg-orange-50 p-2 rounded ${className}`}
    >
      <span>⚠️ {error}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-orange-700 underline hover:no-underline focus:outline-none"
          aria-label="重新載入地點資料"
        >
          重試
        </button>
      )}
    </div>
  )
}

// 載入骨架組件
function LoadingSkeleton({ count = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full min-h-[140px] md:min-h-[160px] lg:min-h-[180px] xl:min-h-[232px] bg-gray-200 rounded-[8px] md:rounded-[10px] lg:rounded-[12px] p-[8px] md:p-[12px] lg:p-[16px] animate-pulse"
        >
          <div className="flex gap-[8px] md:gap-[12px] lg:gap-[16px]">
            <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px] xl:w-[180px] xl:h-[180px] bg-gray-300 rounded-[12px]"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// 空狀態組件
function EmptyState({ emptyStateMessage, className = '' }) {
  return (
    <div
      className={`text-[#8B7355] text-xs sm:text-sm text-center py-8 ${className}`}
    >
      <div className="text-2xl mb-2">{emptyStateMessage.icon}</div>
      <p>{emptyStateMessage.title}</p>
      {emptyStateMessage.subtitle && (
        <p className="mt-1 text-[#C8B8AC]">{emptyStateMessage.subtitle}</p>
      )}
      {emptyStateMessage.action && (
        <button
          onClick={emptyStateMessage.action.handler}
          className="mt-2 text-[#EE5A36] underline hover:no-underline"
        >
          {emptyStateMessage.action.text}
        </button>
      )}
    </div>
  )
}

// 載入更多按鈕組件
function LoadMoreButton({
  isLoadingMore,
  hasMore,
  onLoadMore,
  totalCount,
  currentCount,
  className = '',
}) {
  if (isLoadingMore) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F5AB54] mx-auto" />
        <p className="text-gray-600 mt-2 text-xs">載入更多地點中...</p>
      </div>
    )
  }

  if (hasMore && onLoadMore) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <button
          onClick={onLoadMore}
          className="w-full py-3 bg-[#EE5A36] text-white rounded-lg hover:bg-[#d54a2a] transition-colors text-sm font-medium"
        >
          載入更多地點
        </button>
      </div>
    )
  }

  if (!hasMore && currentCount > 0) {
    return (
      <div
        className={`text-center py-4 text-gray-500 text-xs border-t border-gray-200 mt-2 ${className}`}
      >
        已顯示全部 {totalCount || currentCount} 個地點
      </div>
    )
  }

  return null
}

// 主要的 CardsSectionUI 組件
export default function CardsSectionUI({
  // 資料
  places = [],
  titleInfo = { title: '結果', filters: [] }, // 移除 (0) 計數
  totalCount = 0,
  emptyStateMessage = {
    icon: '🏪',
    title: '沒有地點資料',
    subtitle: '',
    action: null,
  },

  // 載入狀態
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  error = null,

  // 搜尋
  searchTerm = '',

  // 排序（恢復排序相關 props）
  sortBy = '最新',

  // 事件處理
  onSearchChange = () => {},
  onSortChange = () => {},
  onLoadMore = () => {},
  onRetry = () => {},

  // 渲染函數
  renderPlaceCard = () => null,

  // UI 設定
  className = '',
}) {
  return (
    <div
      className={`w-[320px] md:w-[380px] lg:w-[420px] xl:w-[480px] 2xl:w-[575px] h-full bg-[#FDEFE6] shadow-lg overflow-auto scrollbar-hide ${className}`}
    >
      <div className="p-1 md:p-2 lg:p-3 xl:p-4 pb-6 md:pb-8 lg:pb-10 xl:pb-12 flex flex-col gap-1 md:gap-2 lg:gap-3 xl:gap-4">
        {/* 搜尋框 */}
        <SearchBox
          value={searchTerm}
          onChange={onSearchChange}
          onSearch={(val) => onSearchChange(val)} // 或觸發你自己的搜尋動作
        />

        {/* 標題列 - 恢復排序下拉選單 */}
        <TitleBar
          titleInfo={titleInfo}
          sortBy={sortBy}
          onSortChange={onSortChange}
        />

        {/* 錯誤狀態 */}
        <ErrorMessage error={error} onRetry={onRetry} />

        {/* 地點列表 */}
        <div className="flex flex-col gap-2 sm:gap-2.5 lg:gap-3">
          {isLoading ? (
            <LoadingSkeleton count={3} />
          ) : places.length > 0 ? (
            <>
              {/* 渲染地點卡片 */}
              {places.map((place, index) => renderPlaceCard(place, index))}

              {/* 載入更多按鈕 */}
              <LoadMoreButton
                isLoadingMore={isLoadingMore}
                hasMore={hasMore}
                onLoadMore={onLoadMore}
                totalCount={totalCount}
                currentCount={places.length}
              />
            </>
          ) : (
            /* 空狀態 */
            <EmptyState emptyStateMessage={emptyStateMessage} />
          )}
        </div>
      </div>
    </div>
  )
}

export { CardsSectionUI }