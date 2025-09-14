// hooks/useBusinessHours.js
'use client'

import { useState, useMemo, useCallback } from 'react'

// 🔥 預設營業時間資料
const getDefaultBusinessHours = () => {
  return {
    templates: {
      default: {
        monday: { open: "09:00", close: "18:00", closed: false },
        tuesday: { open: "09:00", close: "18:00", closed: false },
        wednesday: { open: "09:00", close: "18:00", closed: false },
        thursday: { open: "09:00", close: "18:00", closed: false },
        friday: { open: "09:00", close: "18:00", closed: false },
        saturday: { open: "10:00", close: "16:00", closed: false },
        sunday: { open: "", close: "", closed: true }
      },
      寵物友善餐廳: {
        monday: { open: "11:00", close: "21:00", closed: false },
        tuesday: { open: "11:00", close: "21:00", closed: false },
        wednesday: { open: "11:00", close: "21:00", closed: false },
        thursday: { open: "11:00", close: "21:00", closed: false },
        friday: { open: "11:00", close: "22:00", closed: false },
        saturday: { open: "10:00", close: "22:00", closed: false },
        sunday: { open: "10:00", close: "21:00", closed: false }
      },
      寵物公園: {
        monday: { open: "24小時", close: "", closed: false },
        tuesday: { open: "24小時", close: "", closed: false },
        wednesday: { open: "24小時", close: "", closed: false },
        thursday: { open: "24小時", close: "", closed: false },
        friday: { open: "24小時", close: "", closed: false },
        saturday: { open: "24小時", close: "", closed: false },
        sunday: { open: "24小時", close: "", closed: false }
      },
      寵物美容: {
        monday: { open: "09:00", close: "19:00", closed: false },
        tuesday: { open: "", close: "", closed: true },
        wednesday: { open: "09:00", close: "19:00", closed: false },
        thursday: { open: "09:00", close: "19:00", closed: false },
        friday: { open: "09:00", close: "19:00", closed: false },
        saturday: { open: "09:00", close: "18:00", closed: false },
        sunday: { open: "10:00", close: "17:00", closed: false }
      },
      寵物旅館: {
        monday: { open: "08:00", close: "20:00", closed: false },
        tuesday: { open: "08:00", close: "20:00", closed: false },
        wednesday: { open: "08:00", close: "20:00", closed: false },
        thursday: { open: "08:00", close: "20:00", closed: false },
        friday: { open: "08:00", close: "20:00", closed: false },
        saturday: { open: "08:00", close: "18:00", closed: false },
        sunday: { open: "10:00", close: "18:00", closed: false }
      },
      寵物醫院: {
        monday: { open: "09:00", close: "21:00", closed: false },
        tuesday: { open: "09:00", close: "21:00", closed: false },
        wednesday: { open: "09:00", close: "21:00", closed: false },
        thursday: { open: "09:00", close: "21:00", closed: false },
        friday: { open: "09:00", close: "21:00", closed: false },
        saturday: { open: "09:00", close: "17:00", closed: false },
        sunday: { open: "09:00", close: "17:00", closed: false }
      },
      毛孩店長: {
        monday: { open: "10:00", close: "20:00", closed: false },
        tuesday: { open: "10:00", close: "20:00", closed: false },
        wednesday: { open: "10:00", close: "20:00", closed: false },
        thursday: { open: "10:00", close: "20:00", closed: false },
        friday: { open: "10:00", close: "21:00", closed: false },
        saturday: { open: "10:00", close: "21:00", closed: false },
        sunday: { open: "11:00", close: "19:00", closed: false }
      },
      寵物用品: {
        monday: { open: "10:00", close: "19:00", closed: false },
        tuesday: { open: "10:00", close: "19:00", closed: false },
        wednesday: { open: "10:00", close: "19:00", closed: false },
        thursday: { open: "10:00", close: "19:00", closed: false },
        friday: { open: "10:00", close: "20:00", closed: false },
        saturday: { open: "10:00", close: "20:00", closed: false },
        sunday: { open: "11:00", close: "18:00", closed: false }
      },
      公用設施: {
        monday: { open: "24小時", close: "", closed: false },
        tuesday: { open: "24小時", close: "", closed: false },
        wednesday: { open: "24小時", close: "", closed: false },
        thursday: { open: "24小時", close: "", closed: false },
        friday: { open: "24小時", close: "", closed: false },
        saturday: { open: "24小時", close: "", closed: false },
        sunday: { open: "24小時", close: "", closed: false }
      },
      特寵友善: {
        monday: { open: "10:00", close: "18:00", closed: false },
        tuesday: { open: "10:00", close: "18:00", closed: false },
        wednesday: { open: "10:00", close: "18:00", closed: false },
        thursday: { open: "10:00", close: "18:00", closed: false },
        friday: { open: "10:00", close: "19:00", closed: false },
        saturday: { open: "09:00", close: "19:00", closed: false },
        sunday: { open: "09:00", close: "17:00", closed: false }
      }
    },
    categoryMapping: {
      "1": "寵物友善餐廳",
      "2": "寵物公園", 
      "3": "寵物美容",
      "4": "寵物旅館",
      "5": "寵物醫院",
      "6": "毛孩店長",
      "7": "寵物用品",
      "8": "公用設施",
      "9": "特寵友善"
    },
    placeTemplates: {},
    customHours: {},
    holidays: [],
    specialHours: {},
    timezone: "Asia/Taipei"
  }
}

// 全域資料實例 - 直接使用預設資料
const globalBusinessHoursData = getDefaultBusinessHours()

// 營業時間處理 Hook
export function useBusinessHours(placeId, placeType = 'petPlaces', placeCategory = null) {
  const [businessHoursData] = useState(globalBusinessHoursData)
  const [isLoading] = useState(false) // 不需要載入，直接設為 false
  const [error] = useState(null)

  // 獲取指定地點的營業時間
  const getPlaceBusinessHours = useCallback((targetPlaceId, placeCategory = null) => {
    if (!businessHoursData || !targetPlaceId) {
      return businessHoursData?.templates?.default || null
    }

    const today = new Date().toISOString().split('T')[0]
    
    // 檢查是否有特殊時間（節日等）
    if (businessHoursData.specialHours?.[today]) {
      return businessHoursData.specialHours[today].hours || businessHoursData.templates?.default
    }

    // 檢查是否為節日
    const isHoliday = businessHoursData.holidays?.some(holiday => holiday.date === today)
    if (isHoliday) {
      return {
        monday: { open: "", close: "", closed: true },
        tuesday: { open: "", close: "", closed: true },
        wednesday: { open: "", close: "", closed: true },
        thursday: { open: "", close: "", closed: true },
        friday: { open: "", close: "", closed: true },
        saturday: { open: "", close: "", closed: true },
        sunday: { open: "", close: "", closed: true }
      }
    }

    const placeIdStr = String(targetPlaceId)

    // 1. 優先檢查自訂營業時間
    if (businessHoursData.customHours?.[placeIdStr]) {
      return businessHoursData.customHours[placeIdStr]
    }

    // 2. 檢查地點模板映射
    if (businessHoursData.placeTemplates?.[placeIdStr]) {
      const templateName = businessHoursData.placeTemplates[placeIdStr]
      const template = businessHoursData.templates[templateName]
      if (template) {
        return template
      }
    }

    // 3. 檢查範圍匹配
    const placeId = parseInt(placeIdStr)
    if (!isNaN(placeId) && businessHoursData.placeTemplates) {
      for (const [rangeKey, templateName] of Object.entries(businessHoursData.placeTemplates)) {
        if (rangeKey.includes('-')) {
          const [start, end] = rangeKey.split('-').map(n => parseInt(n.trim()))
          if (!isNaN(start) && !isNaN(end) && placeId >= start && placeId <= end) {
            const template = businessHoursData.templates[templateName]
            if (template) {
              return template
            }
          }
        }
      }
    }

    // 4. 根據分類自動分配營業時間模板
    if (placeCategory && businessHoursData.templates?.[placeCategory]) {
      return businessHoursData.templates[placeCategory]
    }

    // 5. 如果分類是 ID，嘗試轉換
    if (placeCategory && businessHoursData.categoryMapping?.[placeCategory]) {
      const mappedCategory = businessHoursData.categoryMapping[placeCategory]
      if (businessHoursData.templates?.[mappedCategory]) {
        return businessHoursData.templates[mappedCategory]
      }
    }

    // 6. 使用預設模板
    return businessHoursData.templates?.default || null
  }, [businessHoursData])

  // 計算當前營業狀態
  const calculateBusinessStatus = useMemo(() => {
    if (!businessHoursData || !placeId) {
      return {
        isOpen: false,
        statusText: '營業時間未設定',
        hoursText: '',
        todayHours: null
      }
    }

    const placeHours = getPlaceBusinessHours(placeId, placeType, placeCategory)
    
    if (!placeHours) {
      return {
        isOpen: false,
        statusText: '營業時間未設定',
        hoursText: '',
        todayHours: null
      }
    }

    const now = new Date()
    const currentDay = now.getDay()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const currentDayName = dayNames[currentDay]
    const todayHours = placeHours[currentDayName]

    if (!todayHours || todayHours.closed) {
      return {
        isOpen: false,
        statusText: '今日公休',
        hoursText: '公休',
        todayHours
      }
    }

    if (!todayHours.open || !todayHours.close) {
      // 處理 24 小時營業
      if (todayHours.open === '24小時' || todayHours.open === '24小時開放') {
        return {
          isOpen: true,
          statusText: '24小時營業',
          hoursText: '24小時',
          todayHours
        }
      }
      
      return {
        isOpen: false,
        statusText: '今日公休',
        hoursText: '公休',
        todayHours
      }
    }

    // 解析時間
    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number)
      return hours * 60 + minutes
    }

    const openTime = parseTime(todayHours.open)
    const closeTime = parseTime(todayHours.close)

    let isOpen = false
    let statusText = ''

    if (closeTime > openTime) {
      // 同日營業
      isOpen = currentTime >= openTime && currentTime <= closeTime
      if (isOpen) {
        statusText = '營業中'
      } else if (currentTime < openTime) {
        statusText = `今日 ${todayHours.open} 開始營業`
      } else {
        statusText = '已結束營業'
      }
    } else {
      // 跨日營業
      isOpen = currentTime >= openTime || currentTime <= closeTime
      statusText = isOpen ? '營業中' : `今日 ${todayHours.open} 開始營業`
    }

    const hoursText = `${todayHours.open}-${todayHours.close}`

    return {
      isOpen,
      statusText,
      hoursText,
      todayHours
    }
  }, [businessHoursData, placeId, placeType, placeCategory, getPlaceBusinessHours])

  // 獲取完整週營業時間（用於顯示）
  const getWeeklyHours = useCallback((targetPlaceId, targetPlaceType = 'petPlaces', targetPlaceCategory = null) => {
    const placeHours = getPlaceBusinessHours(targetPlaceId, targetPlaceType, targetPlaceCategory)
    
    if (!placeHours) return []

    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayLabels = ['週日', '週一', '週二', '週三', '週四', '週五', '週六']

    return dayNames.map((day, index) => {
      const hours = placeHours[day]
      let hoursText = '公休'
      
      if (hours && !hours.closed) {
        if (hours.open === '24小時' || hours.open === '24小時開放') {
          hoursText = '24小時'
        } else if (hours.open && hours.close) {
          hoursText = `${hours.open}-${hours.close}`
        }
      }
      
      return {
        day: day,
        label: dayLabels[index],
        open: hours?.open || '',
        close: hours?.close || '',
        closed: hours?.closed || false,
        hoursText
      }
    })
  }, [getPlaceBusinessHours])

  // 檢查指定日期是否營業
  const isOpenOnDate = useCallback((date, targetPlaceId, targetPlaceType = 'petPlaces', targetPlaceCategory = null) => {
    const placeHours = getPlaceBusinessHours(targetPlaceId, targetPlaceType, targetPlaceCategory)
    if (!placeHours) return false

    const dateObj = new Date(date)
    const dayOfWeek = dateObj.getDay()
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayName = dayNames[dayOfWeek]
    const dayHours = placeHours[dayName]

    // 檢查是否為節日
    const dateString = date.toISOString ? date.toISOString().split('T')[0] : date
    const isHoliday = businessHoursData?.holidays?.some(holiday => holiday.date === dateString)
    
    if (isHoliday) return false
    if (!dayHours || dayHours.closed) return false
    
    // 24小時營業
    if (dayHours.open === '24小時' || dayHours.open === '24小時開放') return true
    
    return !!(dayHours.open && dayHours.close)
  }, [businessHoursData, getPlaceBusinessHours])

  return {
    // 原始資料
    businessHoursData,
    isLoading,
    error,

    // 當前地點狀態
    isOpen: calculateBusinessStatus.isOpen,
    statusText: calculateBusinessStatus.statusText,
    hoursText: calculateBusinessStatus.hoursText,
    todayHours: calculateBusinessStatus.todayHours,

    // 工具函數
    getPlaceBusinessHours,
    getWeeklyHours,
    isOpenOnDate
  }
}

// 簡化版 Hook，只取得營業狀態
export function useBusinessStatus(placeId, placeType = 'petPlaces', placeCategory = null) {
  const { isOpen, statusText, hoursText, isLoading } = useBusinessHours(placeId, placeType, placeCategory)
  
  return {
    isOpen,
    statusText,
    hoursText,
    isLoading
  }
}

// 餐廳專用 Hook（如果需要的話）
export function useRestaurantBusinessHours(restaurantId) {
  const result = useBusinessHours(restaurantId, 'restaurants')
  
  // 轉換為原本餐廳組件期望的格式
  const byWeekday = useMemo(() => {
    if (!result.businessHoursData || !restaurantId) return null

    const placeHours = result.getPlaceBusinessHours(restaurantId, 'restaurants', null)
    if (!placeHours) return null

    // 轉換為 [0-6] 索引的陣列格式
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const weeklyHours = {}

    dayNames.forEach((dayName, index) => {
      const dayIndex = index // 0=週日, 1=週一, ..., 6=週六
      const hours = placeHours[dayName]
      
      if (hours && !hours.closed && hours.open && hours.close) {
        // 處理 24 小時營業
        if (hours.open === '24小時' || hours.open === '24小時開放') {
          weeklyHours[dayIndex] = [{
            open_time: '00:00',
            close_time: '23:59',
            is_closed: false
          }]
        } else {
          weeklyHours[dayIndex] = [{
            open_time: hours.open,
            close_time: hours.close,
            is_closed: false
          }]
        }
      } else {
        weeklyHours[dayIndex] = []
      }
    })

    return weeklyHours
  }, [result, restaurantId])

  return {
    ...result,
    byWeekday
  }
}