'use client'

import React from 'react'

// 基礎標籤組件
export default function PetPersonalityTag({
  text,
  variant = 'default',
  size = 'default',
  className = '',
  onClick,
  ...props
}) {
  // 顏色變體
  const variantClasses = {
    default: 'bg-[#f5ab54] text-white',
    orange: 'bg-[#ee5a36] text-white',
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    gray: 'bg-gray-500 text-white',
    yellow: 'bg-yellow-500 text-white',
    purple: 'bg-purple-500 text-white',
    pink: 'bg-pink-500 text-white',
  }

  // 尺寸變體
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    default: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base',
  }

  return (
    <span
      role="button"
      tabIndex={0}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        font-fake-pearl 
        font-normal 
        rounded-full 
        whitespace-nowrap
        inline-block
        cursor-pointer
        hover:opacity-90
        transition-opacity
        ${className}
      `}
      onClick={onClick}
      onKeyDown={e => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(e);
        }
      }}
      {...props}
    >
      {text}
    </span>
  )
}

// 使用範例組件
export function PetPersonalityTagShowcase() {
  const tags = [
    { text: '海邊玩耍', variant: 'default' },
    { text: '親人友善', variant: 'default' },
    { text: '雪室內向', variant: 'orange' },
    { text: '跑跑', variant: 'default' },
    { text: '喜歡小孩', variant: 'default' },
    { text: '散步', variant: 'orange' },
    { text: '喜歡露營', variant: 'orange' },
    { text: '愛交朋友', variant: 'orange' },
    { text: '爬山', variant: 'default' },
    { text: '沙發馬鈴薯', variant: 'orange' },
    { text: '曬太陽', variant: 'orange' },
    { text: '餐廳乖巧', variant: 'orange' },
    { text: '什麼都吃', variant: 'orange' },
    { text: '愛旅行', variant: 'default' },
    { text: '愛賓', variant: 'orange' },
    { text: '愛看電視', variant: 'orange' },
    { text: '挑食', variant: 'orange' },
    { text: '愛坐車', variant: 'orange' },
  ]

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">標籤組件展示</h1>

      {/* 基本使用 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">基本標籤</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <PetPersonalityTag
              key={index}
              text={tag.text}
              variant={tag.variant}
              onClick={() => console.log(`點擊了: ${tag.text}`)}
            />
          ))}
        </div>
      </div>

      {/* 不同尺寸 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">不同尺寸</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <PetPersonalityTag text="小標籤" size="small" />
          <PetPersonalityTag text="標準標籤" size="default" />
          <PetPersonalityTag text="大標籤" size="large" />
        </div>
      </div>

      {/* 不同顏色 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          不同顏色變體
        </h2>
        <div className="flex flex-wrap gap-2">
          <PetPersonalityTag text="預設" variant="default" />
          <PetPersonalityTag text="橘色" variant="orange" />
          <PetPersonalityTag text="藍色" variant="blue" />
          <PetPersonalityTag text="綠色" variant="green" />
          <PetPersonalityTag text="灰色" variant="gray" />
          <PetPersonalityTag text="黃色" variant="yellow" />
          <PetPersonalityTag text="紫色" variant="purple" />
          <PetPersonalityTag text="粉色" variant="pink" />
        </div>
      </div>

      {/* 實際應用場景 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          實際應用 - 寵物特性
        </h2>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium mb-3 text-gray-800">小白的特性：</h3>
          <div className="flex flex-wrap gap-2">
            <PetPersonalityTag text="親人友善" variant="green" />
            <PetPersonalityTag text="喜歡小孩" variant="blue" />
            <PetPersonalityTag text="愛散步" variant="orange" />
            <PetPersonalityTag text="餐廳乖巧" variant="purple" />
            <PetPersonalityTag text="什麼都吃" variant="yellow" />
          </div>
        </div>
      </div>
    </div>
  )
}



//實際使用方式
// 導入組件
//import Tag from '@/components/Tag'

// 簡單使用
//<Tag text="海邊玩耍" />
//<Tag text="親人友善" />
//<Tag text="雪室內向" variant="orange" />

// 動態生成
//const petTags = ['海邊玩耍', '親人友善', '喜歡小孩', '散步']
//{petTags.map(tag => (
  //<Tag key={tag} text={tag} />
//))}