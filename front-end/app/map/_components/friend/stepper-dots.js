'use client'
import React from 'react'

/**
 * StepperDots（改法二：flex 讓線條佔滿點與點之間）
 * props:
 *  - total: 總步數（預設 5）
 *  - current: 目前步驟（1 起算）
 *  - onStepClick?: (idx:number)=>void  // 可選：點擊某步驟
 *  - className?: string
 */
export default function StepperDots({
  total = 5,
  current = 1,
  onStepClick,
  className = '',
}) {
  const activeColor = '#EE5A36'   // 亮橘（目前步驟 / 已完成）
  const completedColor = '#EE5A36'
  const dotColor = '#F3A64C'      // 淺橘（未完成）
  const lineColor = '#F3A64C'     // 淺橘（未完成線）

  return (
    <div className={`w-full flex items-center justify-center ${className}`} aria-label="流程步驟">
      <div className="flex items-center max-w-sm">
        {Array.from({ length: total }).map((_, i) => {
          const idx = i + 1
          const isActive = idx === current
          const isCompleted = idx < current

          return (
            <div key={idx} className="flex items-center">
              {/* 圓點 */}
              <button
                type="button"
                onClick={onStepClick ? () => onStepClick(idx) : undefined}
                disabled={!onStepClick}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`第 ${idx} 步`}
                className={[
                  'rounded-full transition-transform duration-200 shrink-0',
                  'w-4 h-4', // 點比線粗一點
                  'focus:outline-none focus:ring-2 focus:ring-black/10',
                  onStepClick ? 'cursor-pointer hover:scale-110' : 'cursor-default',
                ].join(' ')}
                style={{
                  backgroundColor: (isActive || isCompleted) ? activeColor : dotColor,
                }}
              />

              {/* 線（最後一個點後不畫） */}
              {idx < total && (
                <div
                  className="h-1 w-12"
                  style={{
                    backgroundColor: idx < current ? completedColor : lineColor,
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}