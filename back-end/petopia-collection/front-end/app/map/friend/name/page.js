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

const PetNameStep = () => {
  const [petName, setPetName] = useState('')
  const [title, setTitle] = useState('先生')
  const [isTitleDropdownOpen, setIsTitleDropdownOpen] = useState(false)
  const router = useRouter()

  // 稱謂選項
  const titleOptions = [
    '主人',
    '先生', 
    '公主',
    '哥哥',
    '大人',
    '妹妹',
    '姊姊',
    '小姐',
    '小寶寶',
    '少爺',
    '工讀生',
    '弟弟',
    '搗蛋鬼',
    '跤',
    '睡神',
    '胖球',
    '球球怪',
    '趴趴獸'
  ]

  const handleTitleSelect = (selectedTitle) => {
    setTitle(selectedTitle)
    setIsTitleDropdownOpen(false)
  }

  const handleSavePetName = () => {
    if (petName.trim()) {
      // 跳轉到寵物年齡頁面
      router.push('/map/friend/age')
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
            毛孩的名字
          </h2>
        </div>

        {/* Pet Image */}
        <div className="text-center mb-8">
          <div className="animate-float">
            <Image
              src="/images/map/friend/images/dog.png"
              alt="狗狗"
              width={200}
              height={200}
              className="mx-auto hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Name Input with Title */}
        <div className="w-full max-w-lg mb-12">
          <div className="flex gap-3 mb-2">
            {/* Pet Name Input */}
            <input
              type="text"
              placeholder="例如：小黑、Happy"
              className="flex-1 p-4 border-2 border-gray-200 rounded-xl text-center text-lg focus:border-orange-400 focus:outline-none animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
            />
            
            {/* Title Dropdown */}
            <div className="relative z-[9999] animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={() => setIsTitleDropdownOpen(!isTitleDropdownOpen)}
                className="px-4 py-4 border-2 border-gray-200 rounded-xl bg-white text-lg focus:border-orange-400 focus:outline-none hover:border-orange-300 transition-colors flex items-center gap-2 min-w-[100px]"
              >
                <span>{title}</span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isTitleDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Title Dropdown List */}
              {isTitleDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-60 overflow-y-auto z-[10001]">
                  {titleOptions.map((option, index) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleTitleSelect(option)}
                      className={`w-full px-4 py-3 text-left text-lg hover:bg-orange-50 transition-colors duration-150 border-none bg-transparent cursor-pointer relative z-[10002] ${
                        index === 0 ? 'rounded-t-xl' : ''
                      } ${
                        index === titleOptions.length - 1 ? 'rounded-b-xl' : ''
                      } ${
                        title === option ? 'bg-orange-100 text-orange-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <button
            onClick={handleSavePetName}
            disabled={!petName.trim()}
            className={`px-8 py-2 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl animate-bounce-in ${
              petName.trim()
                ? 'bg-[#ee5a36] text-white hover:bg-[#c65f3a]'
                : 'bg-[#f5ab54] text-white cursor-not-allowed'
            }`}
            style={{ animationDelay: '0.6s' }}
          >
            {petName.trim() ? '下一步' : '請輸入寵物姓名'}
          </button>
        </div>
      </div>

      {/* Title Dropdown Overlay */}
      {isTitleDropdownOpen && (
        <button 
          type="button"
          className="fixed inset-0 z-[9998] bg-transparent border-none cursor-default"
          onClick={() => setIsTitleDropdownOpen(false)}
          aria-label="關閉稱謂選單"
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
          0%,
          100% {
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
          animation: float 2s ease-in-out infinite;
        }

        .animate-bounce-in {
          animation: bounceIn 1s ease-out both;
        }
      `}</style>
    </div>
  )
}

export default PetNameStep