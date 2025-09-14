'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import RatingStars from '@/app/map/_components/common/rating-stars'

export default function ReviewItemUI({
  userName,
  userAvatar,
  rating,
  date,
  reviewText,

  isHelpful = false,
  isExpanded = false,
  isLoading = false,

  onToggleExpanded,
  onToggleHelpful,

  className = '',
}) {
  // 安全處理頭像 fallback
  const [avatarSrc, setAvatarSrc] = useState(userAvatar || '/default-avatar.png')
  useEffect(() => {
    setAvatarSrc(userAvatar || '/default-avatar.png')
  }, [userAvatar])

  const safeText = reviewText ?? ''
  const shouldShowExpandButton = safeText.length > 50
  const displayText = isExpanded ? safeText : safeText.slice(0, 50)

  if (isLoading) {
    return (
      <div className={`w-full px-[24px] py-[24px] animate-pulse bg-transparent ${className}`}>
        <div className="flex items-center gap-[12px] mb-4">
          <div className="w-[48px] h-[48px] rounded-full bg-gray-200" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full px-[24px] py-[24px] flex flex-col gap-[12px] bg-transparent border-b border-gray-200 ${className}`}>
      {/* 使用者資訊 */}
      <div className="flex items-center gap-[12px]">
        <div className="w-[48px] h-[48px] rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={avatarSrc}
            alt={userName ? `${userName} 的頭像` : '使用者頭像'}
            width={48}
            height={48}
            className="w-full h-full object-cover"
            onError={() => setAvatarSrc('/default-avatar.png')}
          />
        </div>
        <span className="text-[16px] font-medium text-[#3E2E2E]">
          {userName || '匿名使用者'}
        </span>
      </div>

      {/* 評分與時間 */}
      <div className="flex items-center gap-[8px]">
        <RatingStars rating={Number(rating) || 0} />
        <span className="text-[16px] text-[#3E2E2E]">
          {date ? `於 ${date}` : ''}
        </span>
      </div>

      {/* 內容 */}
      <div className="text-[16px] text-[#3E2E2E] leading-relaxed">
        {displayText}
        {shouldShowExpandButton && !isExpanded && (
          <>
            ...{' '}
            <button
              type="button"
              onClick={onToggleExpanded}
              className="text-[#F5AB54] hover:underline font-medium disabled:opacity-50"
              disabled={!onToggleExpanded}
            >
              全文
            </button>
          </>
        )}
      </div>

      {/* 有用按鈕 */}
      <button
        type="button"
        onClick={onToggleHelpful}
        disabled={!onToggleHelpful}
        aria-pressed={isHelpful}
        aria-label={isHelpful ? '已標記為有幫助' : '標記此評論為有幫助'}
        className={`flex items-center gap-[8px] text-[16px] transition-colors w-fit disabled:opacity-50 disabled:cursor-not-allowed ${
          isHelpful ? 'text-[#F5AB54]' : 'text-[#8B7355] hover:text-[#F5AB54]'
        }`}
      >
        <FontAwesomeIcon icon={faThumbsUp} className={`w-[24px] h-[24px] ${isHelpful ? 'text-[#F5AB54]' : ''}`} />
        請問這對您有幫助嗎？
      </button>
    </div>
  )
}