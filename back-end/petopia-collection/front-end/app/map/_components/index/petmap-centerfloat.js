// app/components/CenterFloatImage.jsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'

const MotionImage = motion(Image)

export default function CenterFloatImage({
  src,            // 傳入圖片路徑
  width = 120,    // 圖片寬
  height = 120,   // 圖片高
  amplitude = 14, // 上下浮動幅度(px)
  duration = 2.6, // 一次來回秒數
}) {
  const prefersReducedMotion = useReducedMotion()
  const floatY = prefersReducedMotion ? 0 : amplitude

  return (
    <section className="relative w-full flex items-center justify-center">
      <MotionImage
        src={src}
        alt=""
        width={width}
        height={height}
        className="select-none"
        aria-hidden
        initial={{  y: 30 }}
        animate={{ 
          y: [0, -floatY, 0] 
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      />
    </section>
  )
}
