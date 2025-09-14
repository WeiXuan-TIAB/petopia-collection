'use client'

import React, { useState } from 'react'
import PetPersonalityTag from './pet-personality-tag'

// 寵物性格標籤容器組件
export default function PetPersonalityContainer() {
  const [selectedTags, setSelectedTags] = useState(['餐廳乖巧'])

  const handleTagClick = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div className="flex flex-col items-center">
      {/* 標籤容器 */}
      <div
        className="
        w-[268px] h-[177px]           /* 手機版容器尺寸 */
        md:w-[966px] md:h-[463px]     /* PC版容器尺寸 */
        relative
      "
      >
        {/* 手機版布局 */}
        <div className="md:hidden w-full h-full flex flex-col justify-between gap-[10px]">
          {/* 第一行 */}
          <div className="flex justify-between">
            <PetPersonalityTag
              text="親人友善"
              isSelected={selectedTags.includes('親人友善')}
              onClick={() => handleTagClick('親人友善')}
            />
            <PetPersonalityTag
              text="害羞內向"
              isSelected={selectedTags.includes('害羞內向')}
              onClick={() => handleTagClick('害羞內向')}
            />
            <PetPersonalityTag
              text="愛交朋友"
              isSelected={selectedTags.includes('愛交朋友')}
              onClick={() => handleTagClick('愛交朋友')}
            />
          </div>

          {/* 第二行 */}
          <div className="flex justify-center gap-[10px]">
            <PetPersonalityTag
              text="喜歡露營"
              isSelected={selectedTags.includes('喜歡露營')}
              onClick={() => handleTagClick('喜歡露營')}
            />
            <PetPersonalityTag
              text="跑跑"
              isSelected={selectedTags.includes('跑跑')}
              onClick={() => handleTagClick('跑跑')}
            />
            <PetPersonalityTag
              text="喜歡小孩"
              isSelected={selectedTags.includes('喜歡小孩')}
              onClick={() => handleTagClick('喜歡小孩')}
            />
          </div>

          {/* 第三行 */}
          <div className="flex justify-between gap-[10px]">
            <PetPersonalityTag
              text="散步"
              isSelected={selectedTags.includes('散步')}
              onClick={() => handleTagClick('散步')}
            />
            <PetPersonalityTag
              text="愛看電視"
              isSelected={selectedTags.includes('愛看電視')}
              onClick={() => handleTagClick('愛看電視')}
            />
            <PetPersonalityTag
              text="爬山"
              isSelected={selectedTags.includes('爬山')}
              onClick={() => handleTagClick('爬山')}
            />
            <PetPersonalityTag
              text="曬太陽"
              isSelected={selectedTags.includes('曬太陽')}
              onClick={() => handleTagClick('曬太陽')}
            />
          </div>

          {/* 第四行 */}
          <div className="flex justify-center gap-[10px]">
            <PetPersonalityTag
              text="海邊玩耍"
              isSelected={selectedTags.includes('海邊玩耍')}
              onClick={() => handleTagClick('海邊玩耍')}
            />
            <PetPersonalityTag
              text="餐廳乖巧"
              isSelected={selectedTags.includes('餐廳乖巧')}
              onClick={() => handleTagClick('餐廳乖巧')}
            />
            <PetPersonalityTag
              text="尋寶"
              isSelected={selectedTags.includes('尋寶')}
              onClick={() => handleTagClick('尋寶')}
            />
          </div>

          {/* 第五行 */}
          <div className="flex justify-between gap-[10px]">
            <PetPersonalityTag
              text="愛坐車"
              isSelected={selectedTags.includes('愛坐車')}
              onClick={() => handleTagClick('愛坐車')}
            />
            <PetPersonalityTag
              text="沙發馬鈴薯"
              isSelected={selectedTags.includes('沙發馬鈴薯')}
              onClick={() => handleTagClick('沙發馬鈴薯')}
            />
            <PetPersonalityTag
              text="愛旅行"
              isSelected={selectedTags.includes('愛旅行')}
              onClick={() => handleTagClick('愛旅行')}
            />
          </div>

          {/* 第六行 - 只有2個標籤，居中對齊 */}
          <div className="flex justify-center gap-[10px]">
            <PetPersonalityTag
              text="挑食"
              isSelected={selectedTags.includes('挑食')}
              onClick={() => handleTagClick('挑食')}
            />
            <PetPersonalityTag
              text="什麼都吃"
              isSelected={selectedTags.includes('什麼都吃')}
              onClick={() => handleTagClick('什麼都吃')}
            />
          </div>
        </div>

        {/* PC版布局 */}
        <div className="hidden md:flex md:flex-col md:justify-between md:w-full md:h-full">
          {/* 第一行 - 3個標籤，居中 */}
          <div className="flex justify-center gap-6">
            <PetPersonalityTag
              text="親人友善"
              isSelected={selectedTags.includes('親人友善')}
              onClick={() => handleTagClick('親人友善')}
            />
            <PetPersonalityTag
              text="害羞內向"
              isSelected={selectedTags.includes('害羞內向')}
              onClick={() => handleTagClick('害羞內向')}
            />
            <PetPersonalityTag
              text="愛交朋友"
              isSelected={selectedTags.includes('愛交朋友')}
              onClick={() => handleTagClick('愛交朋友')}
            />
          </div>

          {/* 第二行 - 4個標籤 */}
          <div className="flex justify-between gap-6">
            <PetPersonalityTag
              text="跑跑"
              isSelected={selectedTags.includes('跑跑')}
              onClick={() => handleTagClick('跑跑')}
            />
            <PetPersonalityTag
              text="喜歡小孩"
              isSelected={selectedTags.includes('喜歡小孩')}
              onClick={() => handleTagClick('喜歡小孩')}
            />
            <PetPersonalityTag
              text="喜歡露營"
              isSelected={selectedTags.includes('喜歡露營')}
              onClick={() => handleTagClick('喜歡露營')}
            />
            <PetPersonalityTag
              text="散步"
              isSelected={selectedTags.includes('散步')}
              onClick={() => handleTagClick('散步')}
            />
          </div>

          {/* 第三行 - 4個標籤 */}
          <div className="flex justify-between gap-6">
            <PetPersonalityTag
              text="海邊玩耍"
              isSelected={selectedTags.includes('海邊玩耍')}
              onClick={() => handleTagClick('海邊玩耍')}
            />
            <PetPersonalityTag
              text="餐廳乖巧"
              isSelected={selectedTags.includes('餐廳乖巧')}
              onClick={() => handleTagClick('餐廳乖巧')}
            />
            <PetPersonalityTag
              text="爬山"
              isSelected={selectedTags.includes('爬山')}
              onClick={() => handleTagClick('爬山')}
            />
            <PetPersonalityTag
              text="愛看電視"
              isSelected={selectedTags.includes('愛看電視')}
              onClick={() => handleTagClick('愛看電視')}
            />
          </div>

          {/* 第四行 - 3個標籤，居中 */}
          <div className="flex justify-center gap-6">
            <PetPersonalityTag
              text="愛坐車"
              isSelected={selectedTags.includes('愛坐車')}
              onClick={() => handleTagClick('愛坐車')}
            />
            <PetPersonalityTag
              text="沙發馬鈴薯"
              isSelected={selectedTags.includes('沙發馬鈴薯')}
              onClick={() => handleTagClick('沙發馬鈴薯')}
            />
            <PetPersonalityTag
              text="曬太陽"
              isSelected={selectedTags.includes('曬太陽')}
              onClick={() => handleTagClick('曬太陽')}
            />
          </div>

          {/* 第五行 - 4個標籤 */}
          <div className="flex justify-between gap-6">
            <PetPersonalityTag
              text="挑食"
              isSelected={selectedTags.includes('挑食')}
              onClick={() => handleTagClick('挑食')}
            />
            <PetPersonalityTag
              text="什麼都吃"
              isSelected={selectedTags.includes('什麼都吃')}
              onClick={() => handleTagClick('什麼都吃')}
            />
            <PetPersonalityTag
              text="尋寶"
              isSelected={selectedTags.includes('尋寶')}
              onClick={() => handleTagClick('尋寶')}
            />
            <PetPersonalityTag
              text="愛旅行"
              isSelected={selectedTags.includes('愛旅行')}
              onClick={() => handleTagClick('愛旅行')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
