'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import IconButton from '@/app/map/_components/btn/icon-button'
import {
  faHeart,
  faMapMarkerAlt,
  faAddressCard,
  faEdit,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// 單一寵物檔案卡片組件
const PetCard = ({ 
  petName,
  title,
  breed,
  age,
  ageUnit = '歲',
  personalities,
  introduction,
  uploadedPhotos = [],
  onEdit,
  distance = '1km'
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  // 處理照片輪播
  const handlePhotoChange = (index) => {
    setCurrentPhotoIndex(index)
  }

  // 取得顯示的照片（優先顯示上傳照片，否則使用預設照片）
  const displayPhotos = uploadedPhotos.length > 0 
    ? uploadedPhotos 
    : [
        { src: '/images/map/friend/images/mao-1.png', alt: '預設照片1' },
        { src: '/images/map/friend/images/mao-2.png', alt: '預設照片2' },
        { src: '/images/map/friend/images/mao-3.png', alt: '預設照片3' }
      ]

  const currentPhoto = displayPhotos[currentPhotoIndex] || displayPhotos[0]

  return (
    <div className="w-full max-w-md mx-auto bg-[#f5ab54] rounded-3xl p-6 shadow-xl relative animate-fade-in-up mb-6">
      
      {/* Edit Button */}
      {onEdit && (
        <button
          onClick={onEdit}
          className="absolute top-4 right-4 w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center text-white hover:bg-blue-400 transition-colors shadow-lg z-10"
        >
          <FontAwesomeIcon icon={faEdit} className="w-5 h-5" />
        </button>
      )}

      {/* Pet Photo */}
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

        {/* Owner Avatar */}
        <div className="absolute bottom-2 right-2 w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
          <Image
            src='/images/map/friend/images/avatar.png'
            alt='會員照片'
            width={100}
            height={100}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Photo Indicators */}
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

      {/* Personality Tags */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {personalities && personalities.slice(0, 3).map((personality, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-[#ee5a36] text-white rounded-full text-sm font-medium"
          >
            {personality}
          </span>
        ))}
      </div>

      {/* Pet Info */}
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

      {/* Introduction */}
      <div className="text-gray-800 text-center leading-relaxed mb-4 px-2">
        <p className="text-sm">
          {introduction}
        </p>
      </div>
    </div>
  )
}

// 主要的我的檔案頁面
const MyPetsProfile = ({ 
  onEdit,
  // 接收寵物列表陣列（支援立即顯示新建立的寵物）
  pets = []
}) => {

  // 預設寵物：毛毛先生（貓咪）- 原本就存在的
  const defaultCat = {
    id: 'cat-mao',
    petName: "毛毛",
    title: "先生", 
    breed: "米克斯", 
    age: 1, 
    personalities: ['沙拉馬鈴薯', '愛講話', '懶'], 
    introduction: "我有藍色的眼睛！我媽說我很聰明，以前有點兇，現在喜歡人類摸摸我！摸我！",
    uploadedPhotos: []
  }

  // 合併寵物資料：預設貓咪 + 新建立的寵物（通常是狗狗：咖啡寶寶）
  const allPets = [defaultCat, ...pets]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex flex-col items-center py-8">
      <div className="w-full flex justify-between items-start px-8 mb-6">
        <h1 className="text-gray-700 text-[28px] font-medium">
          我的檔案
        </h1>
        <div className="flex gap-2">
          <IconButton icon={faMapMarkerAlt} />
          <IconButton icon={faHeart} />
          <IconButton defaultPressed={true} icon={faAddressCard} />
        </div>
      </div>

      {/* 寵物檔案列表 */}
      <div className="w-full max-w-md mx-auto space-y-6">
        
        {/* 動態渲染所有寵物檔案 */}
        {/* 第一張卡片：毛毛先生（貓咪）- 預設 */}
        {/* 第二張卡片：咖啡寶寶（狗狗）- 新建立的（如果有的話）*/}
        {allPets.map((pet, index) => (
          <PetCard
            key={pet.id || index}
            petName={pet.petName}
            title={pet.title}
            breed={pet.breed}
            age={pet.age}
            ageUnit={pet.ageUnit || '歲'}
            personalities={pet.personalities || []}
            introduction={pet.introduction}
            uploadedPhotos={pet.uploadedPhotos || []}
            onEdit={() => onEdit && onEdit(pet.id || index)}
          />
        ))}

        {/* 新增寵物按鈕 - 使用 Link 組件跳轉到 /map/friend */}
        <Link href="/map/friend" className="block w-full">
          <button 
            type="button"
            className="w-full max-w-md mx-auto bg-white/50 border-2 border-dashed border-gray-300 rounded-3xl p-8 flex flex-col items-center justify-center hover:bg-white/70 transition-all cursor-pointer" 
            aria-label="新增寵物檔案"
          >
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-4 hover:bg-gray-400 transition-colors">
              <FontAwesomeIcon icon={faPlus} className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-600 text-lg font-medium">新增寵物檔案</p>
          </button>
        </Link>
      </div>

      {/* CSS Animations */}
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

export default MyPetsProfile