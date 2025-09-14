'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import IconButton from '@/app/map/_components/btn/icon-button'
import StepperDots from '@/app/map/_components/friend/stepper-dots'
import CustomSlider from '@/app/map/_components/friend/custom-slider'
import {
  faHeart,
  faMapMarkerAlt,
  faAddressCard,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'

const PetBodyTypeStep = ({ petName = '毛毛', title = '先生' }) => {
  const [bodyType, setBodyType] = useState(3) // 預設在中間位置 (1-6)
  const router = useRouter()

  // 根據 bodyType 值決定要顯示的圖片
  const getDogImage = (type) => {
    return `/images/map/friend/motion/dog${type}.png`
  }

  const handleSliderChange = (value) => {
    setBodyType(value)
  }

  const handleSaveBodyType = () => {
    // 跳轉到寵物個性頁面
    router.push('/map/friend/personality')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex flex-col">
      <div className="flex justify-end px-[80px] py-[20px] gap-2">
        <IconButton icon={faMapMarkerAlt} />
        <IconButton defaultPressed={true} icon={faHeart} />
        <IconButton icon={faAddressCard} />
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center px-8 mb-4 animate-fade-in-up">
        <div className="w-full max-w-md">
          <StepperDots
            total={6}
            current={2} // 假設這是第2步
            className="py-2"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 -mt-4">
        <div className="text-center mb-8">
          <h2 className="text-gray-700 text-[30px] py-[8px] animate-fade-in-up">
            {petName}{title}的體型
          </h2>
        </div>

        {/* Pet Image with Dynamic Change */}
        <div className="text-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="animate-float">
            <div className="relative w-[400px] h-[400px] mx-auto">
              <Image
                src={getDogImage(bodyType)}
                alt={`狗狗體型${bodyType}`}
                width={400}
                height={400}
                className="absolute inset-0 hover:scale-105 transition-all duration-700 ease-out opacity-100"
                style={{
                  transform: 'translateZ(0)', // 硬體加速
                  willChange: 'transform, opacity'
                }}
                priority
              />
            </div>
          </div>
        </div>

        {/* Custom Slider */}
        <div className="w-full max-w-sm mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CustomSlider
            min={1}
            max={6}
            step={1}
            value={bodyType}
            onChange={handleSliderChange}
            className="mb-4 transition-all duration-300 ease-out"
          />
          
          {/* Slider Labels */}
          <div className="flex justify-between text-sm text-gray-600 px-6 transition-all duration-300">
            <span className={`transition-all duration-300 ${bodyType <= 2 ? 'text-[#ee5a36] font-medium' : ''}`}>
              瘦小
            </span>
            <span className={`transition-all duration-300 ${bodyType >= 3 && bodyType <= 4 ? 'text-[#ee5a36] font-medium' : ''}`}>
              標準
            </span>
            <span className={`transition-all duration-300 ${bodyType >= 5 ? 'text-[#ee5a36] font-medium' : ''}`}>
              壯碩
            </span>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleSaveBodyType}
          className="bg-[#ee5a36] text-white px-12 py-4 rounded-full text-lg font-medium hover:bg-[#c65f3a] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl animate-bounce-in"
          style={{ animationDelay: '0.6s' }}
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

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
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

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-bounce-in {
          animation: bounceIn 1s ease-out both;
        }
      `}</style>
    </div>
  )
}

export default PetBodyTypeStep