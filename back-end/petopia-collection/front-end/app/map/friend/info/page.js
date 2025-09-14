'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import IconButton from '@/app/map/_components/btn/icon-button'
import StepperDots from '@/app/map/_components/friend/stepper-dots'
import {
  faHeart,
  faMapMarkerAlt,
  faAddressCard,
  faEdit,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const PetInfoPage = ({ 
  // 從前面步驟收集的資料
  petName = '毛毛',
  title = '先生',
  breed = '米格魯',
  age = 1,
  ageUnit = '歲',
  personalities = ['跑跑', '愛交朋友', '什麼都吃'],
  uploadedPhotos = [],
  introduction = '我是一隻活潑好奇的米格魯！我很貪吃！'
}) => {
  const router = useRouter()
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  // 處理照片輪播
  const handlePhotoChange = (index) => {
    setCurrentPhotoIndex(index)
  }

  // 編輯按鈕處理
  const handleEdit = () => {
    console.log('編輯寵物資料')
    // 這裡可以加入編輯邏輯
  }

  // 完成建檔按鈕處理 - 跳轉到配對頁面
  const handleComplete = () => {
    console.log('完成建檔，跳轉到配對頁面')
    router.push('/map/friend/match')
  }

  // 取得顯示的照片（優先顯示上傳照片，否則使用預設照片）
  const displayPhotos = uploadedPhotos.length > 0 
    ? uploadedPhotos 
    : [
        { src: '/images/map/friend/images/coffee-3.png', alt: '預設照片1' },
        { src: '/images/map/friend/images/coffee-2.png', alt: '預設照片2' },
        { src: '/images/map/friend/images/coffee-1.png', alt: '預設照片3' }
      ]

  const currentPhoto = displayPhotos[currentPhotoIndex] || displayPhotos[0]

  // 計算距離（可以是動態的）
  const distance = '1km'

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex flex-col items-center py-8">
      {/* 頂部標題和按鈕 */}
      <div className="w-full flex justify-between items-start px-8 mb-6">
        <h1 className="text-gray-700 text-[28px] font-medium">
          {petName}{title}的檔案
        </h1>
        <div className="flex gap-2">
          <IconButton icon={faMapMarkerAlt} />
          <IconButton defaultPressed={true} icon={faHeart} />
          <IconButton icon={faAddressCard} />
        </div>
      </div>

      {/* 進度指示器 */}
      <div className="w-full max-w-md mb-6">
        <StepperDots
          total={6}
          current={6}
          className="py-2"
        />
      </div>

      {/* 寵物檔案卡片 */}
      <div className="w-full max-w-md mx-auto bg-[#f5ab54] rounded-3xl p-6 shadow-xl relative animate-fade-in-up">
        
        {/* 編輯按鈕 */}
        <button
          onClick={handleEdit}
          className="absolute top-4 right-4 w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center text-white hover:bg-blue-400 transition-colors shadow-lg z-10"
        >
          <FontAwesomeIcon icon={faEdit} className="w-5 h-5" />
        </button>

        {/* 寵物照片 */}
        <div className="relative mb-4">
          <div className="w-full h-80 bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={currentPhoto.src || '/images/map/friend/images/dog.png'}
              alt={currentPhoto.alt || `${petName}的照片`}
              width={400}
              height={320}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 主人頭像 */}
          <div className="absolute bottom-2 right-2 w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
            <Image
              src='/images/map/friend/images/avatar.png'
              alt='會員照片'
              width={100}
              height={100}
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          {/* 照片指示點 */}
          {displayPhotos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {displayPhotos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePhotoChange(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 個性標籤 */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {personalities.slice(0, 3).map((personality, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-[#ee5a36] text-white rounded-full text-sm font-medium"
            >
              {personality}
            </span>
          ))}
        </div>

        {/* 寵物資訊 */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {petName} {title}
          </h2>
          <div className="flex items-center justify-center gap-4 text-gray-700">
            <span>{age}{ageUnit}</span>
            <span>•</span>
            <span>{breed}</span>
            <span>•</span>
            <span>{distance}</span>
          </div>
        </div>

        {/* 自我介紹 */}
        <div className="text-gray-800 text-center leading-relaxed mb-6 px-2">
          <p className="text-sm">
            {introduction}
          </p>
        </div>
      </div>

      {/* 操作按鈕 */}
      <div className="mt-8 flex flex-col gap-4 items-center">
        {/* 完成建檔按鈕 */}
        <button
          onClick={handleComplete}
          className="bg-[#ee5a36] text-white px-12 py-4 rounded-full text-lg font-medium hover:bg-[#c65f3a] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
        >
          開始交友！
        </button>
      </div>

      {/* CSS 動畫 */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out both;
        }
      `}</style>
    </div>
  )
}

export default PetInfoPage