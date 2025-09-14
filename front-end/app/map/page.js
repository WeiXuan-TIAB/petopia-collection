'use client'

import React from 'react'
import { useState } from 'react'
import Image from 'next/image'
import '@/styles/globals.css'
import GenericButton from '@/app/map/_components/btn/generic-button'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import PetMapHero from '@/app/map/_components/index/petmap-hero'
import CenterFloatImage from './_components/index/petmap-centerfloat'
import BlurToast from '@/app/map/_components/common/blur-toast'
import Link from 'next/link'

const PetopiaMapPage = () => {
  const [showToast1, setShowToast1] = useState(false)
  const [showToast2, setShowToast2] = useState(false)

  return (
    <div>
      {/* Main Content */}
      <main className="flex flex-col">
        {/* Section 1 */}
        <section className="relative w-full h-screen overflow-hidden">
          {/* 背景圖 */}
          <Image
            src="/images/map/index/index-bg.png"
            alt="背景圖"
            fill
            priority
            className="object-cover"
          />

          {/* 前景內容 */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
            {/* 標題和按鈕置中 */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center z-20">
              <h2 className="text-3xl md:text-4xl font-bold text-[#3E2E2E] mb-4">
                探索寵物友善地點，連結從此更簡單
              </h2>
              <p className="text-lg text-[#3E2E2E]">
                開啟地圖，找到鄰近的寵物朋友與活動空間，從相遇開始連結心意
              </p>
            </div>

            {/* PetMapHero 動畫內容 */}
            <div className="relative z-10 w-full h-full top-[110px]">
              <PetMapHero
                dogSrc="/images/map/index/dog-left.png"
                humanSrc="/images/map/index/character.png"
                catSrc="/images/map/index/cat-left.png"
                pins={[
                  {
                    id: 'p1',
                    src: '/images/map/index/pins/pin-green.png',
                    left: '12%',
                    top: '78%',
                    size: 100,
                  },
                  {
                    id: 'p2',
                    src: '/images/map/index/pins/pin-yellow.png',
                    left: '28%',
                    top: '70%',
                    size: 80,
                  },
                  {
                    id: 'p3',
                    src: '/images/map/index/pins/pin-purple.png',
                    left: '80%',
                    top: '90%',
                    size: 60,
                  },
                  {
                    id: 'p4',
                    src: '/images/map/index/pins/pin-blue.png',
                    left: '62%',
                    top: '78%',
                    size: 100,
                  },
                  {
                    id: 'p5',
                    src: '/images/map/index/pins/pin-green.png',
                    left: '80%',
                    top: '65%',
                    size: 60,
                  },
                  {
                    id: 'p6',
                    src: '/images/map/index/pins/pin-purple.png',
                    left: '10%',
                    top: '64%',
                    size: 50,
                  },
                  {
                    id: 'p7',
                    src: '/images/map/index/pins/pin-blue.png',
                    left: '0.05%',
                    top: '70%',
                    size: 50,
                  },
                  {
                    id: 'p8',
                    src: '/images/map/index/pins/pin-yellow.png',
                    left: '90%',
                    top: '80%',
                    size: 50,
                  },
                  {
                    id: 'p9',
                    src: '/images/map/index/pins/pin-yellow.png',
                    left: '1px',
                    top: '91%',
                    size: 50,
                  },
                  {
                    id: 'p10',
                    src: '/images/map/index/pins/pin-purple.png',
                    left: '40%',
                    top: '88%',
                    size: 40,
                  },
                ]}
              />
            </div>

            {/* 按鈕 */}
            <Link href="/map/search">
              <div className="absolute bottom-[130px] left-1/2 transform -translate-x-1/2 z-20">
                <GenericButton
                  text="立即開啟旅程"
                  className="text-lg px-8 py-4"
                />
              </div>
            </Link>
          </div>
        </section>

        {/* Section 2 */}
        <section className="relative w-full h-screen overflow-hidden bg-[#F5AB54]">
          {/* 前景內容 */}
          <div className="relative mt-20 z-10 w-full h-full flex flex-col items-center justify-center ">
            {/* 標題文字區域 */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center z-20">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Pet Map
              </h2>
              <p className="text-lg text-white">
                毛孩友善店家一把抓，出門不再煩惱去哪玩！
              </p>
            </div>

            {/* 動畫圖片 */}
            <div className="relative z-10 w-full h-full top-[250px]">
              <CenterFloatImage
                src="/images/map/index/mapicon.png"
                width={400}
                height={400}
                amplitude={12}
                duration={2.4}
              />
            </div>

            {/* 按鈕 */}
            <div className="absolute bottom-[130px] left-1/2 transform -translate-x-1/2 z-20">
              <GenericButton
                text="了解更多"
                icon={faPlus}
                className="text-lg px-8 py-4"
                onClick={() => setShowToast1(true)}
              />
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="relative w-full h-screen overflow-hidden bg-[#F5AB54]">
          {/* 前景內容 */}
          <div className="relative mt-20 z-10 w-full h-full flex flex-col items-center justify-center ">
            {/* 標題文字區域 */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center z-20">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                毛孩交友圈
              </h2>
              <p className="text-lg text-white">
                從寵物開始的友誼，讓生活更加精彩！
              </p>
            </div>

            {/* 動畫圖片 */}
            <div className="relative z-10 w-full h-full top-[250px]">
              <CenterFloatImage
                src="/images/map/index/dogs.png"
                width={400}
                height={400}
                amplitude={12}
                duration={2.4}
              />
            </div>

            {/* 按鈕 */}

            <div className="absolute bottom-[200px] left-1/2 transform -translate-x-1/2 z-20">
              <GenericButton
                text="了解更多"
                icon={faPlus}
                className="text-lg px-8 py-4"
                onClick={() => setShowToast2(true)}
              />
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="relative w-full h-screen overflow-hidden bg-[#FEF1EA]">
          {/* 前景內容 */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
            {/* 動畫圖片 */}
            <div className="mb-8">
              <CenterFloatImage
                src="/images/map/index/group.png"
                width={400}
                height={400}
                amplitude={12}
                duration={2.4}
              />
            </div>

            {/* 按鈕 */}
            <Link href="/map/search">
              <GenericButton
                text="立即開啟旅程"
                className="text-lg px-8 py-4"
              />
            </Link>
          </div>
        </section>

        <BlurToast
          isVisible={showToast1}
          onClose={() => setShowToast1(false)}
          rightContent={
            <Image
              src="/images/map/index/pins.png"
              alt="Pet Map 功能"
              width={200}
              height={200}
              className="rounded-lg"
            />
          }
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-[#ee5a36] rounded-full"></div>
              <span className="text-[#3E2E2E]">寵物友善店家</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-[#ee5a36] rounded-full"></div>
              <span className="text-[#3E2E2E]">店家評價與推薦</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-[#ee5a36] rounded-full"></div>
              <span className="text-[#3E2E2E]">路線規劃導航</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-[#ee5a36] rounded-full"></div>
              <span className="text-[#3E2E2E]">毛爸媽心得分享</span>
            </div>
          </div>
        </BlurToast>

        <BlurToast
          isVisible={showToast2}
          onClose={() => setShowToast2(false)}
          rightContent={
            <Image
              src="/images/map/index/friend-dog.png"
              alt="Pet Map 功能"
              width={180}
              height={180}
              className="rounded-lg"
            />
          }
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-[#ee5a36] rounded-full"></div>
              <span className="text-[#3E2E2E]">寵物檔案配對</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-[#ee5a36] rounded-full"></div>
              <span className="text-[#3E2E2E]">約玩活動發起</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-[#ee5a36] rounded-full"></div>
              <span className="text-[#3E2E2E]">興趣標籤媒合</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-[#ee5a36] rounded-full"></div>
              <span className="text-[#3E2E2E]">即時聊天互動</span>
            </div>
          </div>
        </BlurToast>
      </main>
    </div>
  )
}

export default PetopiaMapPage
