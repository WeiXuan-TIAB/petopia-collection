'use client'

import { serverURL } from '@/config/'
// -----------------------------
// helpers: 基礎工具
// -----------------------------
const toNumber = (v) => {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isNaN(n) ? null : n
}

const clamp = (n, min, max) => (n == null ? null : Math.max(min, Math.min(max, n)))

const pick = (...vals) => vals.find((v) => v !== undefined && v !== null && v !== '')

// -----------------------------
// helpers: 日期格式化
// -----------------------------
function formatDate(input) {
  if (!input) return ''
  try {
    const d = new Date(input)
    if (isNaN(d.getTime())) return String(input)
    const y = d.getFullYear()
    const m = `${d.getMonth() + 1}`.padStart(2, '0')
    const day = `${d.getDate()}`.padStart(2, '0')
    return `${y}/${m}/${day}`
  } catch (error) {
    console.error('🔍 formatDate 錯誤:', error, input)
    return String(input)
  }
}

function toDateMs(input) {
  if (!input) return 0
  try {
    const d = new Date(input)
    return isNaN(d.getTime()) ? 0 : d.getTime()
  } catch (error) {
    console.error('🔍 toDateMs 錯誤:', error, input)
    return 0
  }
}

// -----------------------------
// helpers: 穩健的頭像 URL 處理
// 支援：完整 URL / data URL / 絕對路徑 / 相對路徑 / 只有檔名
// 一律輸出可用於 <img> 或 <Image> 的 URL
// -----------------------------
function resolveAvatarUrl(input) {
  const DEFAULT = '/images/map/avatars/default-avatar.png'
  if (!input) return DEFAULT

  const s = String(input).trim()
  if (!s) return DEFAULT

  // 1) 完整 URL 或 data URL：直接使用
  if (/^(https?:)?\/\//i.test(s) || s.startsWith('data:')) return s

  // 2) 已是絕對路徑（/images/... 或 /public/images/...）
  if (s.startsWith('/')) {
    console.log('===================s===================', s)
    // 把 /public 前綴拿掉（Next 只會從 /public 之後開始對外提供）
    // return s.replace(/^\/public(?=\/)/, '')
    return `${serverURL}${s}`
  }

  // 3) 相對路徑但已包含 avatars 目錄
  const AVATAR_DIR = '/images/map/avatars/'
  const idx = s.lastIndexOf(AVATAR_DIR)
  if (idx !== -1) {
    const file = s.slice(idx + AVATAR_DIR.length)
    return `${AVATAR_DIR}${file}`
  }

  // 4) 只給檔名或其他相對路徑：取檔名拼到 avatars 目錄
  const file = s.split('/').pop()
  return `${AVATAR_DIR}${file || 'default-avatar.png'}`
}

// -----------------------------
// 單筆評論轉換
// -----------------------------
export function transformReview(raw) {
  if (!raw) return null

  // 🔹 使用者名稱
  const userName = pick(
    raw.member?.nickname, // 主要來源
    raw.member?.name,
    raw.userName,
    raw.username,
    raw.user_name,
    raw.nickname,
    raw.author,
    raw.user?.name,
    '匿名用戶'
  )

  // 🔹 頭像（支援多來源、多格式）
  const avatarRaw = pick(
    raw.member?.avatar, // 可能是 'avatar6.png' 或 '/images/map/avatars/avatar6.png'
    raw.userAvatar,
    raw.avatar,
    raw.avatar_url,
    raw.user_avatar_url,
    raw.user?.avatar,
    raw.photo
  )

  const userAvatar = resolveAvatarUrl(avatarRaw)

  // 🔹 評分
  const rating = clamp(toNumber(raw.rating), 0, 5) ?? 0

  // 🔹 日期
  const dateRaw = pick(
    raw.created_at,
    raw.createdAt,
    raw.reviewed_at,
    raw.date,
    raw.time,
    raw.updated_at
  )
  const date = formatDate(dateRaw)
  const dateMs = toDateMs(dateRaw)

  // 🔹 內容
  const reviewText = String(
    pick(
      raw.comment, // 你的後端使用 comment
      raw.reviewText,
      raw.content,
      raw.text,
      raw.body,
      raw.description,
      ''
    )
  )

  const result = {
    id: raw.id,
    userName,
    userAvatar,
    rating,
    date,
    dateMs,
    reviewText,
  }

  return result
}

// -----------------------------
// 批次轉換
// -----------------------------
export function transformReviews(list) {
  if (!Array.isArray(list)) return []
  return list
    .map((item, index) => {
      try {
        return transformReview(item)
      } catch (error) {
        console.error(`🔍 transformReview 第 ${index} 筆失敗:`, error, item)
        return null
      }
    })
    .filter(Boolean)
}

// -----------------------------
// 排序工具
// -----------------------------
export function sortReviews(list = [], sortBy = 'id') {
  const arr = Array.isArray(list) ? [...list] : []

  switch (sortBy) {
    case '最新':
      return arr.sort(
        (a, b) =>
          (b.dateMs ?? 0) - (a.dateMs ?? 0) || (b.rating ?? 0) - (a.rating ?? 0)
      )
    case '評分最高':
      return arr.sort(
        (a, b) =>
          (b.rating ?? 0) - (a.rating ?? 0) || (b.dateMs ?? 0) - (a.dateMs ?? 0)
      )
    case '評分最低':
      return arr.sort(
        (a, b) =>
          (a.rating ?? 0) - (b.rating ?? 0) || (b.dateMs ?? 0) - (a.dateMs ?? 0)
      )
    case 'id':
    default:
      return arr.sort((a, b) => {
        const ai = Number(a.id)
        const bi = Number(b.id)
        if (Number.isFinite(ai) && Number.isFinite(bi)) return ai - bi
        return String(a.id ?? '').localeCompare(String(b.id ?? ''))
      })
  }
}

// -----------------------------
// 一次轉換 + 排序（保留原始 id 或給預設）
// -----------------------------
export function transformReviewsWithSort(rawList = [], sortBy = 'id') {
  const list = transformReviews(rawList).map((r, i) => ({
    id: rawList[i]?.id ?? `${i}`,
    ...r,
  }))
  return sortReviews(list, sortBy)
}

// -----------------------------
// 針對 place 結構的轉換
// -----------------------------
export function transformPlaceReviews(place = {}) {
  const transformed = transformReviews(place.reviews || []).map((r, i) => ({
    id: place.reviews?.[i]?.id ?? `${place.id ?? 'p'}-${i}`,
    ...r,
  }))
  return {
    ...place,
    reviews: transformed,
    reviewCount: place.reviewCount ?? transformed.length,
    rating: Number(place.rating ?? 0),
  }
}