'use client'

import React, { useState } from 'react'
import IconButton from '@/app/map/_components/btn/icon-button'
import AgeInput from '@/app/map/_components/friend/age-input'
import ToggleSwitch from '@/app/map/_components/friend/toggle-switch'
import {
  faHeart,
  faMapMarkerAlt,
  faAddressCard,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'

const PetInfoStep = ({ petName = '毛毛', title = '先生' }) => {
  const [gender, setGender] = useState('')
  const [spayStatus, setSpayStatus] = useState('')
  const [age, setAge] = useState('')
  const [ageUnit, setAgeUnit] = useState('歲')
  const router = useRouter()

  const handleSavePetInfo = () => {
    // 檢查是否所有必要資料都已填寫
    if (gender && spayStatus && age) {
      // 跳轉到寵物品種頁面
      router.push('/map/friend/breeds')
    }
  }

  const isFormComplete = gender && spayStatus && age

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex flex-col">
      <div className="flex justify-end px-[80px] py-[20px] gap-2">
        <IconButton icon={faMapMarkerAlt} />
        <IconButton defaultPressed={true} icon={faHeart} />
        <IconButton icon={faAddressCard} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="text-center mb-12">
          <h2 className="text-gray-700 text-[30px] py-[8px] mb-2 animate-fade-in-up">
            {petName}{title}的性別、年齡
          </h2>
        </div>

        {/* Form Content */}
        <div className="w-full max-w-md space-y-8">
          
          {/* Gender Selection */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <ToggleSwitch
              options={['男孩', '女孩']}
              selected={gender}
              onChange={setGender}
              className="w-full"
            />
          </div>

          {/* Spay/Neuter Status */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <ToggleSwitch
              options={['已絕育', '未絕育']}
              selected={spayStatus}
              onChange={setSpayStatus}
              className="w-full"
            />
          </div>

          {/* Age Section */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700 text-[24px] font-medium">年齡</h3>
            </div>
            
            <div className="flex justify-center">
              <AgeInput
                value={age}
                unit={ageUnit}
                onValueChange={setAge}
                onUnitChange={setAgeUnit}
                min={0}
                max={ageUnit === '歲' ? 30 : 360}
              />
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="mt-16">
          <button
            onClick={handleSavePetInfo}
            disabled={!isFormComplete}
            className={`px-12 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl animate-bounce-in ${
              isFormComplete
                ? 'bg-[#ee5a36] text-white hover:bg-[#c65f3a]'
                : 'bg-[#f5ab54] text-white cursor-not-allowed opacity-60'
            }`}
            style={{ animationDelay: '0.8s' }}
          >
            下一題
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

export default PetInfoStep