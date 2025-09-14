'use client'

import React from 'react'
import Image from 'next/image'
import IconButton from '@/app/map/_components/btn/icon-button'
import { faHeart, faMapMarkerAlt, faAddressCard } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'

const WelcomeStep = () => {
  const router = useRouter()

  const handleSelectPetType = () => {
  router.push('/map/friend/pet-type')
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex flex-col">
      <div className="flex justify-end px-[80px] py-[20px] gap-2">
        <IconButton icon={faMapMarkerAlt} />
        <IconButton defaultPressed={true} icon={faHeart} />
        <IconButton icon={faAddressCard} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 -mt-16">
        <div className="text-center mb-8">
          <Image
            src="/images/map/friend/logo/logo.png"
            alt="網站logo"
            width={400}
            height={400}
            className="mx-auto"
          />
          <h2 className="text-gray-700 text-[30px] py-[30px] mb-2 animate-fade-in-up">
            為毛孩建立專屬檔案
          </h2>
          <p className="text-gray-600 text-[20px] mb-1 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            讓我們協助您設定寵物檔案的可愛資料！
          </p>
          <p className="text-gray-600 text-[20px] animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            完整的寵物檔案讓您更容易找到合適的朋友或夥伴！
          </p>
        </div>

        {/* Pet Illustrations */}
        <div className="flex items-end justify-center space-x-4 mb-12">
          <div className="animate-float">
            <Image
              src="/images/map/friend/images/welcome.png"
              alt="welcome圖"
              width={600}
              height={600}
              className="hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <button
          onClick={handleSelectPetType}
          className="bg-[#ee5a36] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#c65f3a] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl animate-bounce-in"
          style={{ animationDelay: '0.6s' }}
        >
          建立檔案
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
            transform: translateY(-20px);
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

export default WelcomeStep