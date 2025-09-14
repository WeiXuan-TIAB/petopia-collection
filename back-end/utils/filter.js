// utils/filter.js
export const parseProductConditions = (query) => {
  const perPage = Math.min(Math.max(parseInt(query.perpage, 10) || 20, 1), 100)
  const page = parseInt(query.page, 10) || 1

  // 允許的條件
  const conditions = {
    nameLike: query.nameLike || query.name_like || query.namelike,
    priceGte: query.priceGte || query.price_gte ? Number(query.priceGte || query.price_gte) : undefined,
    priceLte: query.priceLte || query.price_lte ? Number(query.priceLte || query.price_lte) : undefined,

    // 保持字串，讓 generateWhere split 逗號
    mainCategoryId: query.mainCategoryId || query.main_category_id,
    subCategoryId: query.subCategoryId || query.sub_category_id,   // 如果前端沒用 id，可以不傳
    mainCategoryName: query.mainCategoryName || query.main_category_name,
    subCategoryName: query.subCategoryName || query.sub_category_name, // 前端傳名字 (例如: 優質主食,美容護理)
  }

  // 移除 undefined
  Object.keys(conditions).forEach((k) => conditions[k] === undefined && delete conditions[k])

  // 排序（僅允許 id | price）
  const allowedSort = new Set(['id', 'price'])
  const sortRaw = (query.sort || 'id').toString()
  const sort = allowedSort.has(sortRaw) ? sortRaw : 'id'
  const orderRaw = (query.order || 'asc').toString().toLowerCase()
  const order = orderRaw === 'desc' ? 'desc' : 'asc'
  const sortBy = { sort, order }

  return { page, perPage, conditions, sortBy }
}

// 新增：解析地點查詢條件
export const parsePlaceConditions = (query) => {
  const perPage = Math.min(Math.max(parseInt(query.perpage, 10) || 12, 1), 100)
  const page = parseInt(query.page, 10) || 1

  // 允許的條件
  const conditions = {
    // 基本篩選
    nameLike: query.nameLike || query.name_like,
    search: query.search, // 關鍵字搜尋（名稱、描述、地址）
    categoryId: query.categoryId || query.category_id ? Number(query.categoryId || query.category_id) : undefined,
    district: query.district, // 行政區
    
    // 評分篩選
    ratingGte: query.ratingGte || query.rating_gte ? Number(query.ratingGte || query.rating_gte) : undefined,
    ratingLte: query.ratingLte || query.rating_lte ? Number(query.ratingLte || query.rating_lte) : undefined,
    
    // 地理位置篩選（用於距離排序）
    lat: query.lat ? Number(query.lat) : undefined,
    lng: query.lng || query.lon ? Number(query.lng || query.lon) : undefined,
    radius: query.radius ? Number(query.radius) : undefined, // 搜尋半徑（公里）
    
    // 營業狀態
    isOpen: query.isOpen || query.is_open ? Boolean(query.isOpen || query.is_open) : undefined,
    
    // 特色服務篩選
    features: parseFeatures(query.features),
  }

  // 移除 undefined
  Object.keys(conditions).forEach((k) => conditions[k] === undefined && delete conditions[k])

  // 排序（允許 id | name | rating | distance | created_at）
  const allowedSort = new Set(['id', 'name', 'rating', 'distance', 'created_at'])
  const sortRaw = (query.sort || 'id').toString()
  const sort = allowedSort.has(sortRaw) ? sortRaw : 'id'
  const orderRaw = (query.order || 'asc').toString().toLowerCase()  // 改為預設 asc
  const order = orderRaw === 'desc' ? 'desc' : 'asc'
  const sortBy = { sort, order }

  return { page, perPage, conditions, sortBy }
}

// 解析特色服務參數
function parseFeatures(featuresParam) {
  if (!featuresParam) return undefined
  
  const features = {}
  
  // 支援多種格式：
  // 1. 逗號分隔：features=parking,pet_menu,outdoor_seating
  // 2. 多個參數：features[]=parking&features[]=pet_menu
  // 3. JSON字串：features={"parking":1,"pet_menu":1}
  
  try {
    if (typeof featuresParam === 'string') {
      // 嘗試解析 JSON
      if (featuresParam.startsWith('{')) {
        return JSON.parse(featuresParam)
      }
      
      // 逗號分隔的字串
      const featureArray = featuresParam.split(',').map(f => f.trim())
      featureArray.forEach(feature => {
        if (isValidFeature(feature)) {
          features[feature] = 1
        }
      })
    } else if (Array.isArray(featuresParam)) {
      // 陣列格式
      featuresParam.forEach(feature => {
        if (isValidFeature(feature)) {
          features[feature] = 1
        }
      })
    }
    
    return Object.keys(features).length > 0 ? features : undefined
  } catch (error) {
    console.warn('解析 features 參數失敗:', error)
    return undefined
  }
}

// 驗證特色服務名稱
function isValidFeature(feature) {
  const validFeatures = [
    'indoor_dining',    // 室內用餐
    'takeout',         // 外帶
    'outdoor_seating', // 戶外座位
    'pet_menu',        // 寵物餐點
    'parking',         // 停車場
    'wheelchair_accessible' // 無障礙設施
  ]
  
  return validFeatures.includes(feature)
}

// 新增：解析地點評論查詢條件
export const parsePlaceReviewConditions = (query) => {
  const perPage = Math.min(Math.max(parseInt(query.perpage, 10) || 10, 1), 50)
  const page = parseInt(query.page, 10) || 1

  const conditions = {
    placeId: query.placeId || query.place_id ? Number(query.placeId || query.place_id) : undefined,
    memberId: query.memberId || query.member_id ? Number(query.memberId || query.member_id) : undefined,
    ratingGte: query.ratingGte || query.rating_gte ? Number(query.ratingGte || query.rating_gte) : undefined,
    ratingLte: query.ratingLte || query.rating_lte ? Number(query.ratingLte || query.rating_lte) : undefined,
  }

  // 移除 undefined
  Object.keys(conditions).forEach((k) => conditions[k] === undefined && delete conditions[k])

  // 排序（允許 id | rating | created_at）
  const allowedSort = new Set(['id', 'rating', 'created_at'])
  const sortRaw = (query.sort || 'created_at').toString()
  const sort = allowedSort.has(sortRaw) ? sortRaw : 'created_at'
  const orderRaw = (query.order || 'desc').toString().toLowerCase()
  const order = orderRaw === 'asc' ? 'asc' : 'desc'
  const sortBy = { sort, order }

  return { page, perPage, conditions, sortBy }
}