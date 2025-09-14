'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// sections: [{ id: 'intro', label: '簡介' }, ...]
// className: 外層容器額外樣式（可帶 sticky/top/border）
// rootMarginY: 控制觸發點（預設視窗上下各留 45% 與 55%）
export default function StickyNav({
  sections = [],
  className = '',
  rootMarginY = { top: '45%', bottom: '55%' },
}) {
  const [active, setActive] = useState(sections?.[0]?.id ?? '')

  useEffect(() => {
    if (!sections?.length) return
    const observers = []

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(id)
          }
        },
        {
          // 讓區塊大約過到視窗中間就算 active
          root: null,
          threshold: 0,
          rootMargin: `-${rootMarginY.top} 0px -${rootMarginY.bottom} 0px`,
        }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((ob) => ob.disconnect())
  }, [sections, rootMarginY.top, rootMarginY.bottom])

  const handleClick = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    // 你各區塊已經有 scroll-mt-32，這裡直接 scrollIntoView 即可
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // 更新網址的 hash（不觸發跳轉）
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      {sections.map(({ id, label }) => (
        <Link
          key={id}
          href={`#${id}`}
          onClick={(e) => handleClick(e, id)}
          className={[
            'px-4 py-2 transition-colors text-lg',
            active === id ? 'text-primary' : 'hover:text-primary',
          ].join(' ')}
        >
          {label}
        </Link>
      ))}
    </div>
  )
}
