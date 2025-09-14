'use client'
import React, { useState, useRef, useCallback } from 'react'

export default function CustomSlider({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  onChange = () => {},
  className = '',
}) {
  const [internal, setInternal] = useState(min)
  const value = controlledValue ?? internal
  const sliderRef = useRef(null)
  const percent = ((value - min) / (max - min)) * 100

  const setVal = useCallback((v) => {
    const clamped = Math.min(max, Math.max(min, Math.round(v / step) * step))
    if (controlledValue === undefined) setInternal(clamped)
    onChange(clamped)
  }, [controlledValue, min, max, step, onChange])

  const updateFromClientX = (clientX) => {
    const rect = sliderRef.current.getBoundingClientRect()
    let ratio = (clientX - rect.left) / rect.width
    ratio = Math.max(0, Math.min(1, ratio))
    setVal(min + ratio * (max - min))
  }

  const onTrackMouseDown = (e) => {
    e.preventDefault()
    updateFromClientX(e.clientX)
    const move = (ev) => updateFromClientX(ev.clientX)
    const up = () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') setVal(value - step)
    if (e.key === 'ArrowRight') setVal(value + step)
    if (e.key === 'Home') setVal(min)
    if (e.key === 'End') setVal(max)
    if (e.key === 'PageUp') setVal(value + step * 10)
    if (e.key === 'PageDown') setVal(value - step * 10)
  }

  return (
    <div className={`relative h-4 ${className}`}>
      {/* 軌道：可點擊/拖曳 */}
      <div
        ref={sliderRef}
        className="absolute inset-0 cursor-pointer select-none"
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={0}
        onMouseDown={onTrackMouseDown}
        onKeyDown={onKeyDown}
      >
        {/* 背景條 */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-3 bg-[#3A2B2B] rounded-full" />

        {/* 拖曳按鈕（button -> 不會被 a11y 規則噴） */}
        <button
          type="button"
          className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-[#3A2B2B] rounded-full cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-white/60 transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ left: `calc(${percent}% - 16px)` }} // 16 = 半徑
          aria-label="Slider thumb"
          onMouseDown={onTrackMouseDown} // 也能直接拖曳 thumb
        />
      </div>
    </div>
  )
}