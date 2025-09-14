'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import IconButton from '@/app/map/_components/btn/icon-button'
import {
  faHeart,
  faMapMarkerAlt,
  faAddressCard,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'

const PetTypeStep = () => {
  const [selectedPetType, setSelectedPetType] = useState(null)
  const router = useRouter()

  const handlePetTypeSelect = (petType) => {
    setSelectedPetType(petType)
  }

  const handleNextStep = () => {
    if (selectedPetType) {
      router.push('/map/friend/name')
    }
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
          <h2 className="text-gray-700 text-[30px] py-[8px] mb-2 animate-fade-in-up">
            選擇毛孩的種類
          </h2>
        </div>

        {/* Pet Selection Area */}
        <div className="flex items-end justify-center space-x-4 mb-12">
          <div className="animate-float">
            <div className="grid grid-cols-5 gap-8 items-end">
              {/* 狗狗 */}
              <button
                onClick={() => handlePetTypeSelect('dog')}
                className={`transform transition-all duration-300 hover:scale-110 ${
                  selectedPetType === 'dog' ? 'scale-125 animate-pulse' : ''
                }`}
              >
                <Image
                  src="/images/map/friend/images/dog.png"
                  alt="狗狗"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </button>

              {/* 爬蟲類 */}
              <button
                onClick={() => handlePetTypeSelect('reptile')}
                className={`transform transition-all duration-300 hover:scale-110 ${
                  selectedPetType === 'reptile' ? 'scale-125 animate-pulse' : ''
                }`}
              >
                <Image
                  src="/images/map/friend/images/crawler.png"
                  alt="爬蟲"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </button>

              {/* 貓咪 */}
              <button
                onClick={() => handlePetTypeSelect('cat')}
                className={`transform transition-all duration-300 hover:scale-110 ${
                  selectedPetType === 'cat' ? 'scale-125 animate-pulse' : ''
                }`}
              >
                <Image
                  src="/images/map/friend/images/cat.png"
                  alt="貓"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </button>

              {/* 鳥類 */}
              <button
                onClick={() => handlePetTypeSelect('bird')}
                className={`transform transition-all duration-300 hover:scale-110 ${
                  selectedPetType === 'bird' ? 'scale-125 animate-pulse' : ''
                }`}
              >
                <Image
                  src="/images/map/friend/images/bird.png"
                  alt="鳥"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </button>

              {/* 其他寵物 */}
              <button
                onClick={() => handlePetTypeSelect('other')}
                className={`transform transition-all duration-300 hover:scale-110 ${
                  selectedPetType === 'other' ? 'scale-125 animate-pulse' : ''
                }`}
              >
                <Image
                  src="/images/map/friend/images/mouse.png"
                  alt="鼠"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleNextStep}
          disabled={!selectedPetType}
          className={`px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl animate-bounce-in ${
            selectedPetType
              ? 'bg-[#ee5a36] text-white hover:bg-[#c65f3a]'
              : 'bg-[#f5ab54] text-white cursor-not-allowed'
          }`}
          style={{ animationDelay: '0.6s' }}
        >
          {selectedPetType ? '下一步' : '請選擇寵物類型'}
        </button>
        <div className="text-center mb-8">
          <p
            className="text-gray-600 text-[20px] py-[10px] animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            點選動物圖片
          </p>
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

        @keyframes float {
          0%,
          100% {
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

export default PetTypeStep