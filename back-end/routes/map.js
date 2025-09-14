// routes/map.js (修正版)
import express from 'express'
import {
  getPlaces,
  getPlacesCount,
  getPlaceById,
  getPlaceCategories
} from '../services/map.js'

const router = express.Router()

// 🔥 GET 地點列表（修正參數處理）
router.get('/places', async (req, res) => {
  try {
    console.log('🌐 收到地點列表請求:', {
      query: req.query,
      url: req.originalUrl
    })

    const page = parseInt(req.query.page) || 1
    const perPage = parseInt(req.query.perPage) || 20
    const sortBy = req.query.sortBy || 'id'
    const conditions = {}

    // 🔥 修正分類參數處理
    let categoryIds = []
    
    // 處理多種可能的分類參數格式
    if (req.query['categories[]']) {
      // Express 自動解析的陣列格式
      categoryIds = Array.isArray(req.query['categories[]']) 
        ? req.query['categories[]'] 
        : [req.query['categories[]']]
    } else if (req.query.categories) {
      // 逗號分隔的字串格式
      if (typeof req.query.categories === 'string') {
        categoryIds = req.query.categories.split(',').map(id => id.trim())
      } else if (Array.isArray(req.query.categories)) {
        categoryIds = req.query.categories
      }
    }

    // 轉換為數字陣列並過濾無效值
    if (categoryIds.length > 0) {
      const validIds = categoryIds
        .map(id => parseInt(id, 10))
        .filter(id => !isNaN(id) && id > 0)

      if (validIds.length > 0) {
        conditions.category_ids = validIds
        console.log('🏷️ 處理後的分類ID:', validIds)
      }
    }

    // 🔥 處理單一分類 ID（向後相容）
    if (req.query.category_id) {
      const categoryId = parseInt(req.query.category_id, 10)
      if (!isNaN(categoryId) && categoryId > 0) {
        conditions.category_ids = [categoryId]
        console.log('🏷️ 單一分類ID:', categoryId)
      }
    }

    // 其他篩選條件
    if (req.query.district) {
      conditions.district = req.query.district
    }

    if (req.query.search) {
      conditions.search = req.query.search
    }

    // 處理功能特色篩選
    const features = {}
    for (const key of [
      'parking',
      'pet_menu',
      'outdoor_seating',
      'wheelchair_accessible',
      'indoor_dining',
      'takeout'
    ]) {
      if (req.query[`features[${key}]`] === 'true') {
        features[key] = true
      }
    }

    if (Object.keys(features).length > 0) {
      conditions.features = features
    }

    console.log('🔍 查詢條件:', {
      page,
      perPage,
      sortBy,
      conditions
    })

    // 並行查詢地點資料和總數
    const [places, total] = await Promise.all([
      getPlaces(page, perPage, conditions, sortBy),
      getPlacesCount(conditions)
    ])

    console.log('✅ 查詢結果:', {
      地點數量: places.length,
      總數: total,
      頁數: page
    })

    // 🔥 確保回應格式正確
    res.json({
      status: 'success',
      data: places,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage)
      },
      // 🔥 為了向後相容，也提供這些欄位
      places: places,
      total: total,
      totalCount: total
    })
  } catch (error) {
    console.error('❌ 取得地點列表錯誤:', error)
    res.status(500).json({
      status: 'error',
      message: '取得地點列表失敗',
      error: process.env.NODE_ENV === 'development' ? error.message : '伺服器錯誤'
    })
  }
})

// 🔥 GET 地點分類（修正路由路徑）
router.get('/categories', async (req, res) => {
  try {
    console.log('🏷️ 收到分類列表請求')
    
    const categories = await getPlaceCategories()
    const formatted = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      color: cat.color || '#6B7280',
      icon: cat.icon || null,
      pin_color: cat.pin_color || cat.color || '#6B7280',
      created_at: cat.created_at,
      updated_at: cat.updated_at
    }))

    console.log('✅ 分類載入成功:', formatted.length, '個分類')

    res.json({
      status: 'success',
      message: '分類載入成功',
      categories: formatted,
      // 🔥 為了向後相容
      data: formatted
    })
  } catch (error) {
    console.error('❌ 載入分類失敗:', error)
    res.status(500).json({
      status: 'error',
      message: '載入分類失敗',
      error: process.env.NODE_ENV === 'development' ? error.message : '伺服器錯誤'
    })
  }
})

// GET 單一地點詳細資料
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    console.log('🏢 收到地點詳細資料請求:', id)
    
    const place = await getPlaceById(id)

    res.json({
      status: 'success',
      message: '地點詳細資料取得成功',
      data: place
    })
  } catch (error) {
    console.error('❌ 取得地點詳細資料錯誤:', error)
    res.status(500).json({
      status: 'error',
      message: error.message || '取得地點詳細資料失敗'
    })
  }
})

export default router