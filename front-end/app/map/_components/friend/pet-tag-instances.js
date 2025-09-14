// /components/pet_tag_instances.js
// 這個檔案定義各種預設好屬性的標籤組件

'use client'

import React from 'react'
import PetPersonalityTag from './pet-personality-tag'

// 預設好文字的標籤組件們
export function SeaPlayTag({ isSelected = false, onClick }) {
  return (
    <PetPersonalityTag
      text="海邊玩耍"
      isSelected={isSelected}
      onClick={onClick}
    />
  )
}

export function FriendlyTag({ isSelected = false, onClick }) {
  return (
    <PetPersonalityTag
      text="親人友善"
      isSelected={isSelected}
      onClick={onClick}
    />
  )
}

export function ShyTag({ isSelected = false, onClick }) {
  return (
    <PetPersonalityTag
      text="害羞內向"
      isSelected={isSelected}
      onClick={onClick}
    />
  )
}

export function RunningTag({ isSelected = false, onClick }) {
  return (
    <PetPersonalityTag text="跑跑" isSelected={isSelected} onClick={onClick} />
  )
}

export function LikesKidsTag({ isSelected = false, onClick }) {
  return (
    <PetPersonalityTag
      text="喜歡小孩"
      isSelected={isSelected}
      onClick={onClick}
    />
  )
}

export function WalkingTag({ isSelected = false, onClick }) {
  return (
    <PetPersonalityTag text="散步" isSelected={isSelected} onClick={onClick} />
  )
}

export function CampingTag({ isSelected = false, onClick }) {
  return (
    <PetPersonalityTag
      text="喜歡露營"
      isSelected={isSelected}
      onClick={onClick}
    />
  )
}

export function SocialTag({ isSelected = false, onClick }) {
  return (
    <PetPersonalityTag
      text="愛交朋友"
      isSelected={isSelected}
      onClick={onClick}
    />
  )
}

export function ClimbingTag({ isSelected = false, onClick }) {
  return (
    <PetPersonalityTag text="爬山" isSelected={isSelected} onClick={onClick} />
  )
}

export function LazyTag({ isSelected = false, onClick }) {
  return (
    <PetPersonalityTag
      text="沙發馬鈴薯"
      isSelected={isSelected}
      onClick={onClick}
    />
  )
}

export function SunbathingTag({ isSelected = false, onClick }) {
  return (
    <PetPersonalityTag
      text="曬太陽"
      isSelected={isSelected}
      onClick={onClick}
    />
  )
}

export function RestaurantGoodTag({ isSelected = false, onClick }) {
  return (
    <PetPersonalityTag
      text="餐廳乖巧"
      isSelected={isSelected}
      onClick={onClick}
    />
  )
}

export function EatsEverythingTag({ isSelected = false, onClick }) {
  return (
    <PetPersonalityTag
      text="什麼都吃"
      isSelected={isSelected}
      onClick={onClick}
    />
  )
}

export function TravelTag({ isSelected = false, onClick }) {
  return (
    <PetPersonalityTag
      text="愛旅行"
      isSelected={isSelected}
      onClick={onClick}
    />
  )
}

export function TreasureHuntTag({ isSelected = false, onClick }) {
  return (
    <PetPersonalityTag text="尋寶" isSelected={isSelected} onClick={onClick} />
  )
}

export function WatchTVTag({ isSelected = false, onClick }) {
  return (
    <PetPersonalityTag
      text="愛看電視"
      isSelected={isSelected}
      onClick={onClick}
    />
  )
}

export function PickyEaterTag({ isSelected = false, onClick }) {
  return (
    <PetPersonalityTag text="挑食" isSelected={isSelected} onClick={onClick} />
  )
}

export function CarRideTag({ isSelected = false, onClick }) {
  return (
    <PetPersonalityTag
      text="愛坐車"
      isSelected={isSelected}
      onClick={onClick}
    />
  )
}

// 也可以提供一個統一的對照表，方便管理
export const PET_TAGS = {
  seaPlay: SeaPlayTag,
  friendly: FriendlyTag,
  shy: ShyTag,
  running: RunningTag,
  likesKids: LikesKidsTag,
  walking: WalkingTag,
  camping: CampingTag,
  social: SocialTag,
  climbing: ClimbingTag,
  lazy: LazyTag,
  sunbathing: SunbathingTag,
  restaurantGood: RestaurantGoodTag,
  eatsEverything: EatsEverythingTag,
  travel: TravelTag,
  treasureHunt: TreasureHuntTag,
  watchTV: WatchTVTag,
  pickyEater: PickyEaterTag,
  carRide: CarRideTag,
}

// 或者更簡單的陣列格式
export const TAG_LIST = [
  { key: 'seaPlay', text: '海邊玩耍', component: SeaPlayTag },
  { key: 'friendly', text: '親人友善', component: FriendlyTag },
  { key: 'shy', text: '害羞內向', component: ShyTag },
  { key: 'running', text: '跑跑', component: RunningTag },
  { key: 'likesKids', text: '喜歡小孩', component: LikesKidsTag },
  { key: 'walking', text: '散步', component: WalkingTag },
  { key: 'camping', text: '喜歡露營', component: CampingTag },
  { key: 'social', text: '愛交朋友', component: SocialTag },
  { key: 'climbing', text: '爬山', component: ClimbingTag },
  { key: 'lazy', text: '沙發馬鈴薯', component: LazyTag },
  { key: 'sunbathing', text: '曬太陽', component: SunbathingTag },
  { key: 'restaurantGood', text: '餐廳乖巧', component: RestaurantGoodTag },
  { key: 'eatsEverything', text: '什麼都吃', component: EatsEverythingTag },
  { key: 'travel', text: '愛旅行', component: TravelTag },
  { key: 'treasureHunt', text: '尋寶', component: TreasureHuntTag },
  { key: 'watchTV', text: '愛看電視', component: WatchTVTag },
  { key: 'pickyEater', text: '挑食', component: PickyEaterTag },
  { key: 'carRide', text: '愛坐車', component: CarRideTag },
]
