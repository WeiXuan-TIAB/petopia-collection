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

const PetBreedStep = ({petName = '毛毛', title = '先生' }) => {
  const [selectedBreed, setSelectedBreed] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()

  // 品種選項列表
  const breedOptions = [
    '吉娃娃',
    '博美犬', 
    '馬爾濟斯',
    '約克夏',
    '法國鬥牛犬',
    '臘腸狗',
    '貴賓狗 / 泰迪',
    '西施犬',
    '柴犬',
    '柯基',
    '邊境牧羊犬',
    '可卡犬',
    '美國鬥牛犬',
    '米格魯',
    '黃金獵犬',
    '拉布拉多',
    '德國牧羊犬',
    '哈士奇',
    '阿拉斯加犬',
    '大白熊犬',
    '杜賓犬',
    '聖伯納犬',
    '台灣犬',
    '米克斯'
  ]

  const handleBreedSelect = (breed) => {
    setSelectedBreed(breed)
    setIsDropdownOpen(false)
  }

  const handleSaveBreed = () => {
    if (selectedBreed) {
      // 跳轉到完成歡迎頁面
      router.push('/map/friend/welcome')
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
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="text-center mb-8">
          <h2 className="text-gray-700 text-[30px] py-[8px] mb-2 animate-fade-in-up">
            {petName}{title}的品種
          </h2>
        </div>

        {/* Pet Illustrations */}
        <div className="flex items-center justify-center space-x-8 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="animate-float" style={{ animationDelay: '0s' }}>
            <Image
              src="/images/map/friend/images/breeds.png"
              alt="狗狗們"
              width={400}
              height={400}
              className="hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Breed Selection Dropdown */}
        <div className="w-full max-w-lg mb-2 relative z-[9999] animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full h-14 px-6 rounded-full border-2 border-gray-400 bg-white/90 text-left text-lg flex items-center justify-between transition-all duration-200 hover:border-orange-400 focus:border-orange-400 focus:outline-none ${
                selectedBreed ? 'text-gray-700' : 'text-gray-400'
              }`}
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>{selectedBreed || '搜尋品種'}</span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown List */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 max-h-80 overflow-y-auto z-[10001] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {breedOptions.map((breed, index) => (
                  <button
                    key={breed}
                    type="button"
                    onClick={() => handleBreedSelect(breed)}
                    className={`w-full px-6 py-3 text-left text-lg hover:bg-orange-50 transition-colors duration-150 border-none bg-transparent cursor-pointer relative z-[10002] ${
                      index === 0 ? 'rounded-t-2xl' : ''
                    } ${
                      index === breedOptions.length - 1 ? 'rounded-b-2xl' : ''
                    } ${
                      selectedBreed === breed ? 'bg-orange-100 text-orange-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {breed}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Next Button */}
        <div className="mt-20 relative z-10">
          <button
            onClick={handleSaveBreed}
            disabled={!selectedBreed}
            className={`px-12 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl animate-bounce-in ${
              selectedBreed
                ? 'bg-[#ee5a36] text-white hover:bg-[#c65f3a]'
                : 'bg-[#f5ab54] text-white cursor-not-allowed opacity-60'
            }`}
            style={{ animationDelay: '0.6s' }}
          >
            下一題
          </button>
        </div>
      </div>

      {/* Overlay to close dropdown */}
      {isDropdownOpen && (
        <button 
          type="button"
          className="fixed inset-0 z-[9998] bg-transparent border-none cursor-default"
          onClick={() => setIsDropdownOpen(false)}
          aria-label="關閉下拉選單"
        />
      )}

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

export default PetBreedStep