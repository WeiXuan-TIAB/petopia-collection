'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { serverURL } from '@/config'

const FALLBACK = '/images/restaurant/placeholder.png' // 放在 public/

function toAbs(src) {
  if (!src) return ''
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  return `${serverURL}${src.startsWith('/') ? src : `/${src}`}`
}

export default function Thumbnail({
  src,
  alt = '',
  className = '',
  sizes = '(min-width: 1024px) 400px, 100vw',
  fill = true, // 預設用 fill + 容器 aspect-ratio
  width,
  height,
  priority = false,
}) {
  const [imgSrc, setImgSrc] = useState(src ? toAbs(src) : FALLBACK)
  const failedOnce = useRef(false)

  const handleError = () => {
    if (!failedOnce.current && imgSrc !== FALLBACK) {
      failedOnce.current = true
      setImgSrc(FALLBACK)
    }
  }

  const commonProps = {
    alt,
    onError: handleError,
    className: `object-cover ${className}`,
    sizes,
    priority,
  }

  return fill ? (
    <Image src={imgSrc} alt={commonProps.alt} fill {...commonProps} />
  ) : (
    <Image src={imgSrc} alt={commonProps.alt} width={width} height={height} {...commonProps} />
  )
}
