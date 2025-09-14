'use client'

import React from 'react'
import Image from 'next/image'
import IconButton from '@/app/map/_components/btn/icon-button'
import StepperDots from '@/app/map/_components/friend/stepper-dots'
import {
  faHeart,
  faMapMarkerAlt,
  faAddressCard,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'

const WelcomeCompleteStep = ({ petName = '毛毛', title = '先生' }) => {
  const router = useRouter()

  const handleNextStep = () => {
    // 跳轉到寵物體型頁面
    router.push('/map/friend/bodytype')
  }

  const handleCompleteProfile = () => {
    // 完成檔案功能 - 可能跳轉到主頁面或其他頁面
    console.log('完成檔案')
    // 如果需要跳轉到主頁面，可以加上：
    // router.push('/map/friend')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex flex-col">
      <div className="flex justify-end px-[80px] py-[20px] gap-2">
        <IconButton icon={faMapMarkerAlt} />
        <IconButton defaultPressed={true} icon={faHeart} />
        <IconButton icon={faAddressCard} />
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center px-8 animate-fade-in-up">
        <div className="w-full max-w-md">
          <StepperDots
            total={6}
            current={1}
            className="py-4"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 -mt-4">
        <div className="text-center mb-8">
          <h2 className="text-gray-700 text-[30px] py-[8px] mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            歡迎{petName}{title}加入！
          </h2>
          <p className="text-gray-600 text-[20px] animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            告訴我們更多關於他的事情
          </p>
        </div>

        {/* Pet Celebration Image */}
        <div className="text-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="animate-celebration">
            <Image
              src="/images/map/friend/images/dog-hand.png"
              alt="舉手狗"
              width={300}
              height={300}
              className="mx-auto hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 items-center">
          <button
            onClick={handleNextStep}
            className="bg-[#ee5a36] text-white px-12 py-4 rounded-full text-lg font-medium hover:bg-[#c65f3a] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl animate-bounce-in"
            style={{ animationDelay: '0.8s' }}
          >
            繼續
          </button>
          
          <button
            onClick={handleCompleteProfile}
            className="bg-white text-[#ee5a36] px-10 py-4 rounded-full text-lg font-medium border-2 border-[#ee5a36] hover:bg-[#ee5a36] hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl animate-bounce-in"
            style={{ animationDelay: '1s' }}
          >
            完成檔案
          </button>
        </div>
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

        @keyframes celebration {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-15px) rotate(-5deg);
          }
          50% {
            transform: translateY(-10px) rotate(0deg);
          }
          75% {
            transform: translateY(-15px) rotate(5deg);
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

        .animate-celebration {
          animation: celebration 3s ease-in-out infinite;
        }

        .animate-bounce-in {
          animation: bounceIn 1s ease-out both;
        }
      `}</style>
    </div>
  )
}

export default WelcomeCompleteStep