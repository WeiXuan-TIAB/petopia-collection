// app/map/_components/card/review-item.js
'use client'

import React, { useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import RatingStars from '../common/rating-stars'
import { transformReview } from '@/utils/reviewdata-transformer'

export default function ReviewItem({ review, className = '' }) {
  // 先計算轉換結果（可能為 null）
  const transformed = useMemo(() => transformReview(review), [review])

  // hooks 一律無條件呼叫
  const [isExpanded, setIsExpanded] = useState(false)
  const [avatarSrc, setAvatarSrc] = useState('/images/default-avatar.png')

  // 從轉換結果取值並給預設
  const userName   = transformed?.userName   ?? '匿名用戶'
  const userAvatar = transformed?.userAvatar ?? '/images/default-avatar.png'
  const rating     = transformed?.rating     ?? 0
  const date       = transformed?.date       ?? ''
  const reviewText = transformed?.reviewText ?? ''

  // avatar 同步（Next/Image 不能直接 e.target.src 指派，因此用 state）
  useEffect(() => {
    setAvatarSrc(userAvatar || '/images/default-avatar.png')
  }, [userAvatar])

  const isLongText  = (reviewText?.length ?? 0) > 150
  const displayText = isExpanded || !isLongText
    ? reviewText
    : reviewText.slice(0, 150) + '...'

  // 渲染階段才決定要不要顯示；hooks 已經固定呼叫了
  if (!transformed) return null

  return (
    <div className={`border rounded-lg p-4 bg-white ${className}`}>
      {/* user */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 relative shrink-0">
          <Image
            src={avatarSrc}
            alt={userName}
            fill
            sizes="40px"
            className="rounded-full object-cover"
            onError={() => setAvatarSrc('/images/default-avatar.png')}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900 truncate">{userName}</h4>
            <div className="scale-90 origin-left">
              <RatingStars rating={rating} />
            </div>
          </div>
          {date && <div className="text-sm text-gray-500">{date}</div>}
        </div>
      </div>

      {/* content */}
      {displayText && (
        <div className="mb-2">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {displayText}
          </p>
          {isLongText && (
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="text-blue-600 text-sm mt-2 hover:underline"
            >
              {isExpanded ? '收起' : '展開更多'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}