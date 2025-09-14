'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import IconButton from '@/app/map/_components/btn/icon-button'
import {
  faHeart,
  faMapMarkerAlt,
  faAddressCard,
  faTimes,
  faChampagneGlasses,
  faPaw,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const TinderStylePetMatching = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showMatch, setShowMatch] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState('')

  // 三個寵物檔案資料
  const petProfiles = [
    {
      id: 1,
      name: 'Luna',
      title: '小姐',
      age: 2,
      breed: '吉娃娃',
      distance: '1km',
      personalities: ['散步', '曬太陽', '挑食'],
      introduction: '嗨！我是Luna，超愛和人類玩耍！每天最期待散步時間，看到陌生人也會搖尾巴～我很乖，會握手和坐下，最愛的零食是雞肉條！',
      photo: '/images/map/friend/images/friend-1.png',
      avatar: '/images/map/friend/images/avatar2.png'
    },
    {
      id: 2,
      name: 'Max',
      title: '先生',
      age: 3,
      breed: '柴犬',
      distance: '3km',
      personalities: ['害羞內向', '餐廳乖巧', '沙發馬鈴薯'],
      introduction: '我是Max，個性溫和穩重，最愛陪主人看電視。雖然體型大但很溫柔，特別喜歡小朋友。會游泳也會接飛盤，是個全能好夥伴！',
      photo: '/images/map/friend/images/friend-3.png',
      avatar: '/images/map/friend/images/avatar3.png'
    },
    {
      id: 3,
      name: 'Peko',
      title: '公主',
      age: 1,
      breed: '黃金獵大',
      distance: '3km',
      personalities: ['喜歡小孩', '愛交朋友', '什麼都吃'],
      introduction: '嗨～我是溫馴又文靜的心心的黃金獵犬女孩！個性溫馨很好朋友～我喜歡慢慢、一起看電視開心，我溫馴很聰明，學習能力很強呦～',
      photo: '/images/map/friend/images/friend-4.png',
      avatar: '/images/map/friend/images/avatar4.png'
    }
  ]

  const currentPet = petProfiles[currentCardIndex]

  // 處理不喜歡（❌）
  const handleDislike = () => {
    console.log(`❌ 不喜歡 ${currentPet.name}`)
    setSwipeDirection('left')
    
    setTimeout(() => {
      if (currentCardIndex < petProfiles.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1)
        setSwipeDirection('')
      }
    }, 500) // 增加延遲時間，讓動畫完全結束
  }

  // 處理喜歡（❤️）
  const handleLike = () => {
    console.log(`❤️ 喜歡 ${currentPet.name}`)
    setSwipeDirection('right')
    
    setTimeout(() => {
      // 第三個卡片按喜歡時顯示 Match
      if (currentCardIndex === 2) {
        setShowMatch(true)
        // 3秒後跳轉到好友列表
        setTimeout(() => {
          window.location.href = '/map/friend/friendlist'
        }, 3000)
      } else {
        setCurrentCardIndex(currentCardIndex + 1)
        setSwipeDirection('')
      }
    }, 500) // 增加延遲時間，讓動畫完全結束
  }

  // Match 彈窗組件
  const MatchModal = () => (
    <div className="fixed inset-0 bg-[#f5ab54] flex items-center justify-center z-50 animate-match-appear">
      <div className="text-center text-white animate-bounce-in">
        <div className="text-6xl mb-6">
          <FontAwesomeIcon icon={faChampagneGlasses} className="text-white" />
        </div>
        <h1 className="text-6xl font-bold mb-4 animate-pulse">MATCH!</h1>
        <p className="text-2xl mb-6">你和 {currentPet.name}{currentPet.title} 配對成功！</p>
        <div className="flex justify-center items-center gap-8 mb-8">
          {/* 你的寵物照片（毛毛先生） */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src="/images/map/friend/images/coffee-3.png"
              alt="咖啡寶寶的照片"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-4xl animate-pulse">
            <FontAwesomeIcon icon={faHeart} className="text-red-500" />
          </div>
          {/* 配對成功的寵物照片 */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src="/images/map/friend/images/friend-4.png"
              alt="Peko的照片"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <p className="text-lg opacity-80">正在跳轉到好友列表...</p>
      </div>
    </div>
  )

  // 如果所有卡片都看完了（沒有 Match）
  if (currentCardIndex >= petProfiles.length && !showMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 text-[#f5ab54]">
            <FontAwesomeIcon icon={faPaw} />
          </div>
          <h1 className="text-3xl font-bold text-gray-700 mb-4">沒有更多檔案了</h1>
          <p className="text-gray-600 mb-8">等待更多毛孩加入...</p>
          <Link href="/map/friend/mypetsprofile">
            <button className="bg-[#ee5a36] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#c65f3a] transition-colors">
              回到我的檔案
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex flex-col">
      {showMatch && <MatchModal />}
      
      {/* 標題列 */}
      <div className="flex justify-between items-center px-8 py-6">
        <h1 className="text-gray-700 text-[28px] font-medium">探索好友</h1>
        <div className="flex gap-2">
          <IconButton icon={faMapMarkerAlt} />
          <IconButton icon={faHeart} />
          <IconButton defaultPressed={true} icon={faAddressCard} />
        </div>
      </div>

      {/* 卡片區域 */}
      <div className="flex-1 flex items-center justify-center px-8 py-4">
        <div className="relative w-full max-w-sm">
          
          {/* 寵物卡片 */}
          <div 
            className={`bg-[#f5ab54] rounded-3xl p-6 shadow-2xl transition-all duration-300 transform ${
              swipeDirection === 'left' ? 'translate-x-[-100%] rotate-[-15deg] opacity-0' :
              swipeDirection === 'right' ? 'translate-x-[100%] rotate-[15deg] opacity-0' :
              'translate-x-0 rotate-0 opacity-100'
            }`}
          >
            
            {/* 寵物照片 */}
            <div className="relative mb-4">
              <div className="w-full h-96 bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={currentPet.photo}
                  alt={`${currentPet.name}的照片`}
                  width={400}
                  height={384}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 主人頭像 */}
              <div className="absolute bottom-2 right-2 w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
                <Image
                  src={currentPet.avatar}
                  alt="主人照片"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            {/* 個性標籤 */}
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
              {currentPet.personalities.map((personality, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-[#ee5a36] text-white rounded-full text-sm font-medium"
                >
                  {personality}
                </span>
              ))}
            </div>

            {/* 寵物資訊 */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {currentPet.name} {currentPet.title}
              </h2>
              <div className="flex items-center justify-center gap-4 text-gray-700">
                <span>{currentPet.age}歲</span>
                <span>•</span>
                <span>{currentPet.breed}</span>
                <span>•</span>
                <span>{currentPet.distance}</span>
              </div>
            </div>

            {/* 自我介紹 */}
            <div className="text-gray-800 text-center leading-relaxed mb-6 px-2">
              <p className="text-sm">
                {currentPet.introduction}
              </p>
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="flex justify-center items-center gap-8 mt-8">
            {/* 不喜歡按鈕 */}
            <button
              onClick={handleDislike}
              disabled={swipeDirection !== ''}
              className="w-16 h-16 bg-white border-4 border-gray-300 rounded-full flex items-center justify-center text-gray-500 hover:border-red-300 hover:text-red-500 transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-lg disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
            </button>

            {/* 喜歡按鈕 */}
            <button
              onClick={handleLike}
              disabled={swipeDirection !== ''}
              className="w-16 h-16 bg-white border-4 border-pink-300 rounded-full flex items-center justify-center text-pink-500 hover:border-pink-500 hover:bg-pink-50 transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-lg disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faHeart} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* CSS 動畫 */}
      <style jsx>{`
        @keyframes matchAppear {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
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

        .animate-match-appear {
          animation: matchAppear 0.5s ease-out both;
        }

        .animate-bounce-in {
          animation: bounceIn 1s ease-out both;
        }
      `}</style>
    </div>
  )
}

export default TinderStylePetMatching