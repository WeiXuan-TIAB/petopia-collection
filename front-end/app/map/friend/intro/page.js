'use client'

import React, { useState } from 'react'
import IconButton from '@/app/map/_components/btn/icon-button'
import StepperDots from '@/app/map/_components/friend/stepper-dots'
import {
  faHeart,
  faMapMarkerAlt,
  faAddressCard,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'

const PetIntroStep = ({ petName = '毛毛', title = '先生' }) => {
  const [introduction, setIntroduction] = useState('')
  const router = useRouter()

  const handleSaveIntro = () => {
    // 跳轉到寵物資訊預覽頁面或完成頁面
    router.push('/map/friend/info')
  }

  const maxLength = 200

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
            total={6}
            current={6}
            className="py-1"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center px-8 py-6 pb-12">
        <div className="text-center mb-6">
          <h2 className="text-gray-700 text-[30px] py-[4px] mb-1 animate-fade-in-up">
            自我介紹
          </h2>
        </div>

        {/* Introduction Textarea */}
        <div className="w-full max-w-2xl mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative">
            <textarea
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="填寫自我介紹"
              maxLength={maxLength}
              className="w-full h-64 p-6 border-2 border-gray-400 rounded-3xl bg-white/90 text-gray-700 text-lg placeholder-gray-400 resize-none focus:border-orange-400 focus:outline-none focus:bg-white transition-all duration-200"
            />
            
            {/* Character Count */}
            <div className="absolute bottom-4 right-6 text-sm text-gray-500">
              {introduction.length}/{maxLength}
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-gray-600 text-lg text-center">
            告訴大家更多{petName}{title}的故事吧
          </p>
        </div>

        {/* Next Button */}
        <button
          onClick={handleSaveIntro}
          className="bg-[#ee5a36] text-white px-12 py-4 rounded-full text-lg font-medium hover:bg-[#c65f3a] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl animate-bounce-in"
          style={{ animationDelay: '0.6s' }}
        >
          預覽檔案
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

        /* 自訂滾動條 */
        textarea::-webkit-scrollbar {
          width: 8px;
        }
        
        textarea::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        textarea::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        
        textarea::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  )
}

export default PetIntroStep