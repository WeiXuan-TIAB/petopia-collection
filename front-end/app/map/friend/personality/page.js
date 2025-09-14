'use client'

import React, { useState } from 'react'
import IconButton from '@/app/map/_components/btn/icon-button'
import StepperDots from '@/app/map/_components/friend/stepper-dots'
import PetPersonalityTag from '@/app/map/_components/friend/pet-personality-tag'
import { faHeart, faMapMarkerAlt, faAddressCard } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'

const PetPersonalityStep = ({ petName = '毛毛', title = '先生' }) => {
  const [selectedPersonalities, setSelectedPersonalities] = useState([])
  const router = useRouter()

  const personalityOptions = [
    '親人友善', '害羞內向', '愛交朋友',
    '跑跑', '喜歡小孩', '喜歡露營', '散步',
    '海邊玩耍', '餐廳乖巧', '爬山', '愛看電視',
    '愛坐車', '沙發馬鈴薯', '曬太陽',
    '挑食', '什麼都吃', '尋寶', '愛旅行'
  ]

  const handlePersonalityToggle = (personality) => {
    setSelectedPersonalities(prev =>
      prev.includes(personality) ? prev.filter(p => p !== personality) : [...prev, personality]
    )
  }

  const handleSavePersonality = () => {
    if (selectedPersonalities.length > 0) {
      // 跳轉到寵物照片頁面
      router.push('/map/friend/photo')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex flex-col">
      {/* 頂部按鈕列 */}
      <div className="flex justify-end px-[80px] py-[20px] gap-2">
        <IconButton icon={faMapMarkerAlt} />
        <IconButton defaultPressed icon={faHeart} />
        <IconButton icon={faAddressCard} />
      </div>

      {/* 進度點：縮小下方間距 */}
      <div className="flex justify-center px-8 mb-2 animate-fade-in-up">
        <div className="w-full max-w-md">
          <StepperDots total={5} current={3} />
        </div>
      </div>

      {/* Main Content：移除 flex-1 / justify-center，改用固定 padding & gap */}
      <div className="flex flex-col items-center px-8 pt-2 pb-10 gap-4">
        <div className="text-center">
          <h2 className="text-gray-700 py-10 text-[30px] leading-tight animate-fade-in-up">
            {petName}{title}的興趣、性格
          </h2>
        </div>

        {/* Personality Tags Grid */}
        <div className="w-full max-w-4xl pb-[80px] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 justify-items-center">
            {personalityOptions.map((personality, index) => (
              <PetPersonalityTag
                key={personality}
                text={personality}
                isSelected={selectedPersonalities.includes(personality)}
                onClick={() => handlePersonalityToggle(personality)}
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.05 * (index + 1)}s` }}
              />
            ))}
          </div>
        </div>

        {/* Selection Counter */}
        {selectedPersonalities.length > 0 && (
          <p className="text-gray-600 text-sm text-center animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
            已選擇 {selectedPersonalities.length} 個性格標籤
          </p>
        )}

        {/* Next Button */}
        <button
          onClick={handleSavePersonality}
          disabled={selectedPersonalities.length === 0}
          className={`px-12 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl animate-bounce-in ${
            selectedPersonalities.length > 0
              ? 'bg-[#ee5a36] text-white hover:bg-[#c65f3a]'
              : 'bg-[#f5ab54] text-white cursor-not-allowed opacity-60'
          }`}
          style={{ animationDelay: '0.5s' }}
        >
          {selectedPersonalities.length > 0 ? '下一題' : '請選擇至少一個性格'}
        </button>
      </div>

      {/* 動畫樣式 */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          from { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out both; }
        .animate-bounce-in { animation: bounceIn 1s ease-out both; }
      `}</style>
    </div>
  )
}

export default PetPersonalityStep