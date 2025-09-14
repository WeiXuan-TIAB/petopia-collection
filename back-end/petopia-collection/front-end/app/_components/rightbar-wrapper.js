'use client'

import { usePathname } from 'next/navigation'
import OriginalRightbar from '@/app/_components/right-bar' // 你們原本的 Rightbar

export default function RightbarWrapper({ isVisible }) {
  const pathname = usePathname()
  const isMapPage = pathname === '/map/search'

  // 如果不是地圖頁面，直接顯示原本的 Rightbar
  if (!isMapPage) {
    return <OriginalRightbar />
  }

  // 地圖頁面：完全控制顯示/隱藏
  if (!isVisible) {
    return null // 完全不渲染
  }

  return (
    <div 
      style={{
        zIndex: 99999, // 強制設定超高 z-index
        position: 'relative'
      }}
    >
      <div 
        style={{
          zIndex: 99999,
          position: 'relative'
        }}
      >
        <OriginalRightbar />
      </div>
    </div>
  )
}