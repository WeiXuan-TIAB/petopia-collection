'use client'
import Image from "next/image"
import StarGroup from "./star-group"
import { useState, useEffect, useRef } from "react"

export default function CustomerFeedback({ customerInfo = {} }) {
  const contentRef = useRef(null)  //用來存取留言文字 <p> 的 DOM
  const [isOverflow, setIsOverflow] = useState(false)  //紀錄是否超過兩行
  const [expanded, setExpanded] = useState(false)  //控制評價展開與否
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 }) //紀錄滑鼠位置
  const [showTooltip, setShowTooltip] = useState(false) //控制是否顯示 Tooltip

  //判斷評論是否超過兩行
  useEffect(() => {
    const el = contentRef.current
    if (el) {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight)
      const twoLineHeight = lineHeight * 2
      setIsOverflow(el.scrollHeight > twoLineHeight + 2)
    }
  }, [])

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  const tooltipText = expanded ? '點擊收起留言' : '點擊展開留言'

  return (
    <div className="relative flex flex-col gap-2 py-6 px-2 border-b-2 border-solid border-border-light">
      <div className="flex flex-row items-center gap-3">
        <Image
          width={64}
          height={64}
          src={customerInfo.avatar}
          alt={customerInfo.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{customerInfo.name}</p>
          <StarGroup rating={customerInfo.rating} color="#f5ab54" />
        </div>
      </div>

      <span
        ref={contentRef}
        role="button"
        tabIndex={0}
        onClick={() => isOverflow && setExpanded(prev => !prev)}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && isOverflow) {
            setExpanded((prev) => !prev)
          }
        }}
        onMouseEnter={() => isOverflow && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onMouseMove={handleMouseMove}
        className={`pt-4 text-fp-body text-start transition-all duration-300 ${isOverflow ? 'cursor-pointer' : 'cursor-default'
          } ${!expanded && isOverflow ? 'line-clamp-2' : ''}`}
      >
        {customerInfo.content}
      </span>
      {showTooltip && (
        <div
          className="fixed z-50 bg-primary text-white text-xs px-3 py-1 rounded shadow-md pointer-events-none"
          style={{
            top: mousePos.y + 16,
            left: mousePos.x + 16,
          }}
        >
          {tooltipText}
        </div>
      )}
    </div>
  )
}
