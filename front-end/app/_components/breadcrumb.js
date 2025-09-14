'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { breadcrumbMap } from '@/config/breadcrumbs'

export default function Breadcrumb({ items }) {
  const pathname = usePathname()

  // 移除開頭空字串
  const segments = pathname.split('/').filter(Boolean)

  // 如果沒有手動傳 items，就自動生成
  const autoItems =
    items ||
    segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/')
      const label = breadcrumbMap[segment] || segment
      return { label, href }
    })

  return (
    <nav className="text-base mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            首頁
          </Link>
        </li>
        {autoItems.map((item, index) => (
          <li key={item.href} className="flex items-center space-x-2">
            <span className="text-gray-400">/</span>
            {index === autoItems.length - 1 ? (
              <span className="text-gray-800 font-medium">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
