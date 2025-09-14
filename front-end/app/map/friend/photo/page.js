'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import IconButton from '@/app/map/_components/btn/icon-button'
import StepperDots from '@/app/map/_components/friend/stepper-dots'
import {
  faHeart,
  faMapMarkerAlt,
  faAddressCard,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'

const PetPhotoUploadStep = ({petName = '毛毛', title = '先生' }) => {
  const [uploadedImages, setUploadedImages] = useState([])
  const fileInputRef = useRef(null)
  const router = useRouter()


  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + Math.random(),
            src: e.target.result,
            file: file,
            isDefault: false
          }
          setUploadedImages(prev => [...prev, newImage])
        }
        reader.readAsDataURL(file)
      }
    })
    
    // 清空 input
    event.target.value = ''
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId))
  }

  const handleSavePhotos = () => {
    // 跳轉到寵物自我介紹頁面
    router.push('/map/friend/intro')
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="flex justify-end px-[80px] py-[20px] gap-2">
        <IconButton icon={faMapMarkerAlt} />
        <IconButton defaultPressed={true} icon={faHeart} />
        <IconButton icon={faAddressCard} />
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center px-8 mb-2 animate-fade-in-up">
        <div className="w-full max-w-md">
          <StepperDots
            total={5}
            current={4}
            className="py-[30px]"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center px-8 py-6 pb-12">
        <div className="text-center mb-6">
          <h2 className="text-gray-700 text-[30px] py-[4px] mb-1 animate-fade-in-up">
            {petName}{title}的照片
          </h2>
        </div>

        {/* Default Photos Display */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-center py-[20px]">
            <div className="relative">
              <Image
                src="/images/map/friend/images/photo.png"
                alt="寵物照片展示"
                width={500}
                height={500}
              />
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={handleUploadClick}
            className="w-full max-w-lg h-16 border-2 border-gray-300 border-dashed rounded-full bg-white hover:bg-gray-50 transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-gray-800"
          >
            <span className="text-lg">上傳照片</span>
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Uploaded Photos Preview */}
        {uploadedImages.length > 0 && (
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="grid grid-cols-4 gap-3 max-w-md">
              {uploadedImages.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <Image
                      src={image.src}
                      alt="上傳的照片"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveImage(image.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Counter */}
        {uploadedImages.length > 0 && (
          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            <p className="text-gray-600 text-sm text-center">
              已上傳 {uploadedImages.length} 張照片
            </p>
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={handleSavePhotos}
          className="bg-[#ee5a36] text-white px-12 py-4 rounded-full text-lg font-medium hover:bg-[#c65f3a] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl animate-bounce-in"
          style={{ animationDelay: '0.8s' }}
        >
          下一題
        </button>
      </div>

      {/* 添加自定義 CSS 動畫 */}
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

        @keyframes bounceIn {
          from {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out both;
        }

        .animate-bounce-in {
          animation: bounceIn 1s ease-out both;
        }
      `}</style>
    </div>
  )
}

export default PetPhotoUploadStep