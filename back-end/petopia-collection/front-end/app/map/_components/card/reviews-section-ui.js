'use client'

import React, { useState } from 'react'
import ReviewItemUI from '@/app/map/_components/card/review-item-ui'
import SortDropdownBtn from '@/app/map/_components/btn/sort-option-btn'

export default function ReviewsSectionUI({
  reviews = [],
  totalCount = 0,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  error = null,
  sortBy = '最新',
  onSortChange,
  onAddReview,
  onLoadMore,
  onRetry,
  className = '',
  // 📍 移除內部的分頁邏輯，完全依賴外部控制
}) {
  const [reviewStates, setReviewStates] = useState({})

  const handleToggleExpanded = (rid) => {
    setReviewStates((prev) => ({
      ...prev,
      [rid]: { ...prev[rid], isExpanded: !prev[rid]?.isExpanded },
    }))
  }

  const handleToggleHelpful = (rid) => {
    setReviewStates((prev) => ({
      ...prev,
      [rid]: { ...prev[rid], isHelpful: !prev[rid]?.isHelpful },
    }))
  }

  if (error && reviews.length === 0) {
    return (
      <div className={`w-full p-4 text-center bg-transparent ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-600 text-lg mb-2">📝</div>
          <div className="text-red-800 font-medium mb-2">載入評論失敗</div>
          <div className="text-sm text-red-600 mb-4">{error}</div>
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            重試
          </button>
        </div>
      </div>
    )
  }

  if (!isLoading && reviews.length === 0) {
    return (
      <div className={`w-full bg-transparent ${className}`}>
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">📝</div>
          <div className="text-gray-600 text-lg mb-2">尚無評論</div>
          <div className="text-gray-500 text-sm mb-6">
            成為第一個分享體驗的人
          </div>
          {onAddReview && (
            <button
              onClick={onAddReview}
              className="px-6 py-3 bg-[#F5AB54] text-white rounded-lg hover:bg-[#e0a04b] font-medium"
            >
              撰寫評論
            </button>
          )}
        </div>
      </div>
    )
  }

  console.log('🔍 ReviewsSectionUI 渲染狀態:', {
    reviews: reviews.length,
    totalCount,
    hasMore,
    isLoadingMore,
    onLoadMore: !!onLoadMore,
  })

  return (
    <div className={`w-full bg-transparent ${className}`}>
      {/* 標題 + 排序 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[20px] font-medium text-[#3E2E2E]">評論</h3>
        {onSortChange && (
          <SortDropdownBtn
            value={sortBy}
            onChange={onSortChange}
            context="reviews"
          />
        )}
      </div>

      <div className="bg-transparent">
        {isLoading ? (
          <div className="space-y-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <ReviewItemUI key={i} isLoading />
            ))}
          </div>
        ) : (
          <>
            {/* 📍 直接顯示所有傳入的評論，不做內部過濾 */}
            {reviews.map((review, index) => {
              const rid =
                review.id ??
                review.reviewId ??
                review._id ??
                `${review.userName}-${review.date}-${index}`
              const state = reviewStates[rid] || {}

              return (
                <ReviewItemUI
                  key={rid}
                  userName={review.userName}
                  userAvatar={review.userAvatar}
                  rating={review.rating}
                  date={review.date}
                  reviewText={review.reviewText}
                  isHelpful={state.isHelpful || review.isHelpful}
                  isExpanded={state.isExpanded || false}
                  onToggleExpanded={() => handleToggleExpanded(rid)}
                  onToggleHelpful={() => handleToggleHelpful(rid)}
                  className={index === reviews.length - 1 ? 'border-b-0' : ''}
                />
              )
            })}

            {/* 📍 載入更多按鈕 - 橢圓形樣式 */}
            {hasMore && onLoadMore && (
              <div className="pt-4">
                <button
                  onClick={onLoadMore}
                  disabled={isLoadingMore}
                  className="px-4 h-9 rounded-[12px] bg-[#F5AB54] text-white font-medium hover:opacity-90 disabled:opacity-50 transition-colors"
                >
                  {isLoadingMore ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      載入中...
                    </div>
                  ) : (
                    `更多評論`
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 顯示完畢提示 */}
      {!hasMore && reviews.length > 0 && !isLoading && totalCount > 3 && (
        <div className="text-center py-6 text-sm text-gray-500">
          已顯示全部 {totalCount} 則評論
        </div>
      )}
    </div>
  )
}