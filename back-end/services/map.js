// services/map.js (根據 Prisma Schema 修正)
import prisma from '../lib/prisma.js'

export async function getPlaces(page = 1, perPage = 20, conditions = {}, sortBy = 'id') {
  const skip = (page - 1) * perPage

  console.log('🔍 getPlaces 查詢參數:', {
    page,
    perPage,
    skip,
    conditions,
    sortBy
  })

  const where = {}

  // 🔥 分類篩選邏輯 - 使用正確的 relation 名稱
  if (conditions.category_ids && conditions.category_ids.length > 0) {
    where.place_category_relations = {
      some: {
        category_id: {
          in: conditions.category_ids
        }
      }
    }
    console.log('🏷️ 分類篩選條件:', where.place_category_relations)
  }

  // 🔥 地區篩選
  if (conditions.district) {
    where.district = conditions.district
    console.log('📍 地區篩選:', conditions.district)
  }

  // 🔥 搜尋關鍵字
  if (conditions.search) {
    where.OR = [
      { name: { contains: conditions.search } },
      { description: { contains: conditions.search } },
      { address: { contains: conditions.search } }
    ]
    console.log('🔍 搜尋條件:', where.OR)
  }

  // 🔥 功能特色篩選 - 需要透過 place_features 關聯
  if (conditions.features && Object.keys(conditions.features).length > 0) {
    // 將功能特色條件加到 place_features 關聯中
    const featureConditions = {}
    Object.entries(conditions.features).forEach(([key, value]) => {
      if (value === true) {
        featureConditions[key] = true
      }
    })
    
    if (Object.keys(featureConditions).length > 0) {
      where.place_features = featureConditions
      console.log('✨ 功能特色篩選:', featureConditions)
    }
  }

  // 🔥 排序邏輯
  let orderBy = { id: 'asc' } // 預設排序
  
  switch (sortBy) {
    case '最新':
      orderBy = { created_at: 'desc' }
      break
    case '評分最高':
      // 注意：places 表沒有 rating 欄位，可能需要計算 place_reviews 的平均值
      // 這裡先用 id 排序，稍後可以添加評分計算
      orderBy = { id: 'desc' }
      break
    case 'id':
    default:
      orderBy = { id: 'asc' }
      break
  }

  console.log('📊 最終查詢條件:', {
    where,
    orderBy,
    skip,
    take: perPage
  })

  try {
    const places = await prisma.places.findMany({
      skip,
      take: perPage,
      orderBy,
      where,
      include: {
        // 🔥 正確的關聯名稱
        place_category_relations: {
          include: {
            place_categories: true // 包含分類詳細資訊
          }
        },
        place_photos: {
          where: {
            photo_type: 'official' // 只取官方照片作為主要圖片
          },
          take: 1 // 只取第一張
        },
        place_features: true, // 包含功能特色
        // 可選：包含評分統計
        place_reviews: {
          select: {
            rating: true
          }
        }
      }
    })

    // 🔥 格式化回傳資料
    const formattedPlaces = places.map(place => {
      // 提取分類 ID 陣列
      const categoryIds = place.place_category_relations.map(rel => rel.category_id)
      
      // 提取分類詳細資訊
      const categories = place.place_category_relations.map(rel => ({
        id: rel.place_categories.id,
        name: rel.place_categories.name,
        color: rel.place_categories.color,
        icon: rel.place_categories.icon,
        pin_color: rel.place_categories.pin_color
      }))

      // 計算平均評分
      let averageRating = 0
      if (place.place_reviews && place.place_reviews.length > 0) {
        const totalRating = place.place_reviews.reduce((sum, review) => sum + review.rating, 0)
        averageRating = Number((totalRating / place.place_reviews.length).toFixed(1))
      }

      // 格式化回傳
      return {
        id: place.id,
        name: place.name,
        address: place.address,
        district: place.district,
        phone: place.phone,
        latitude: Number(place.latitude), // 轉換 Decimal 為 Number
        longitude: Number(place.longitude),
        description: place.description,
        website: place.website,
        created_at: place.created_at,
        updated_at: place.updated_at,
        
        // 🔥 前端需要的格式
        category_ids: categoryIds,
        categories: categories,
        
        // 主要圖片
        imageUrl: place.place_photos?.[0]?.url || null,
        mainPhoto: place.place_photos?.[0] ? {
          url: place.place_photos[0].url,
          caption: place.place_photos[0].caption
        } : null,
        
        // 功能特色
        features: place.place_features || {},
        
        // 評分資訊
        rating: averageRating,
        reviewCount: place.place_reviews?.length || 0,
        
        // 其他有用的欄位
        hasPhotos: place.place_photos && place.place_photos.length > 0,
        hasFeatures: place.place_features !== null
      }
    })

    console.log('✅ 查詢成功:', formattedPlaces.length, '個地點')
    
    if (formattedPlaces.length > 0) {
      console.log('📄 第一個地點範例:', {
        id: formattedPlaces[0].id,
        name: formattedPlaces[0].name,
        category_ids: formattedPlaces[0].category_ids,
        categories: formattedPlaces[0].categories.map(c => c.name),
        rating: formattedPlaces[0].rating,
        hasFeatures: formattedPlaces[0].hasFeatures
      })
    }

    return formattedPlaces
  } catch (error) {
    console.error('❌ 查詢地點失敗:', error)
    throw error
  }
}

export async function getPlacesCount(conditions = {}) {
  const where = {}

  // 🔥 與 getPlaces 相同的篩選邏輯
  if (conditions.category_ids && conditions.category_ids.length > 0) {
    where.place_category_relations = {
      some: {
        category_id: {
          in: conditions.category_ids
        }
      }
    }
  }

  if (conditions.district) {
    where.district = conditions.district
  }

  if (conditions.search) {
    where.OR = [
      { name: { contains: conditions.search } },
      { description: { contains: conditions.search } },
      { address: { contains: conditions.search } }
    ]
  }

  if (conditions.features && Object.keys(conditions.features).length > 0) {
    const featureConditions = {}
    Object.entries(conditions.features).forEach(([key, value]) => {
      if (value === true) {
        featureConditions[key] = true
      }
    })
    
    if (Object.keys(featureConditions).length > 0) {
      where.place_features = featureConditions
    }
  }

  console.log('🔢 計算總數，條件:', where)

  try {
    const count = await prisma.places.count({ where })
    console.log('✅ 總數:', count)
    return count
  } catch (error) {
    console.error('❌ 計算總數失敗:', error)
    throw error
  }
}

export async function getPlaceById(id) {
  const numericId = parseInt(id, 10)
  if (isNaN(numericId) || numericId <= 0) {
    throw new Error('ID 必須為正整數')
  }

  console.log('🏢 查詢地點詳細資料:', numericId)

  try {
    const place = await prisma.places.findUnique({
      where: { id: numericId },
      include: {
        place_category_relations: {
          include: {
            place_categories: true
          }
        },
        place_photos: {
          orderBy: {
            created_at: 'desc'
          }
        },
        place_features: true,
        place_business_hours: {
          orderBy: {
            day_of_week: 'asc'
          }
        },
        place_reviews: {
          include: {
            members: {
              select: {
                id: true,
                nickname: true,
                avatar: true
              }
            }
          },
          orderBy: {
            created_at: 'desc'
          }
        },
        place_favorites: true // 收藏統計
      }
    })

    if (!place) {
      throw new Error('找不到該地點')
    }

    // 🔥 格式化單一地點資料
    const categoryIds = place.place_category_relations.map(rel => rel.category_id)
    const categories = place.place_category_relations.map(rel => ({
      id: rel.place_categories.id,
      name: rel.place_categories.name,
      color: rel.place_categories.color,
      icon: rel.place_categories.icon,
      pin_color: rel.place_categories.pin_color
    }))

    // 計算評分統計
    let averageRating = 0
    let ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    
    if (place.place_reviews && place.place_reviews.length > 0) {
      const totalRating = place.place_reviews.reduce((sum, review) => {
        ratingDistribution[review.rating]++
        return sum + review.rating
      }, 0)
      averageRating = Number((totalRating / place.place_reviews.length).toFixed(1))
    }

    const formattedPlace = {
      id: place.id,
      name: place.name,
      address: place.address,
      district: place.district,
      phone: place.phone,
      latitude: Number(place.latitude),
      longitude: Number(place.longitude),
      description: place.description,
      website: place.website,
      created_at: place.created_at,
      updated_at: place.updated_at,
      
      // 分類資訊
      category_ids: categoryIds,
      categories: categories,
      
      // 圖片資訊
      imageUrl: place.place_photos?.[0]?.url || null,
      photos: place.place_photos.map(photo => ({
        id: photo.id,
        url: photo.url,
        caption: photo.caption,
        photo_type: photo.photo_type,
        is_main: photo.is_main,
        created_at: photo.created_at
      })),
      
      // 功能特色
      features: place.place_features || {},
      
      // 營業時間
      businessHours: place.place_business_hours || [],
      
      // 評分與評論
      rating: averageRating,
      reviewCount: place.place_reviews?.length || 0,
      reviews: place.place_reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at,
        member: {
          id: review.members.id,
          nickname: review.members.nickname,
          avatar: review.members.avatar
        }
      })),
      ratingDistribution,
      
      // 收藏統計
      favoriteCount: place.place_favorites?.length || 0,
      
      // 統計資訊
      hasPhotos: place.place_photos && place.place_photos.length > 0,
      hasReviews: place.place_reviews && place.place_reviews.length > 0,
      hasBusinessHours: place.place_business_hours && place.place_business_hours.length > 0
    }

    console.log('✅ 地點詳細資料查詢成功:', formattedPlace.name)
    return formattedPlace
  } catch (error) {
    console.error('❌ 查詢地點詳細資料失敗:', error)
    throw error
  }
}

export async function getPlaceCategories() {
  console.log('🏷️ 查詢所有分類')
  
  try {
    const categories = await prisma.place_categories.findMany({
      orderBy: { id: 'asc' },
      include: {
        place_category_relations: {
          select: {
            place_id: true
          }
        }
      }
    })
    
    // 🔥 加入地點數量統計
    const categoriesWithCount = categories.map(category => ({
      id: category.id,
      name: category.name,
      color: category.color || '#6B7280',
      icon: category.icon || null,
      pin_color: category.pin_color || category.color || '#6B7280',
      created_at: category.created_at,
      
      // 統計該分類下的地點數量
      placeCount: category.place_category_relations.length
    }))
    
    console.log('✅ 分類查詢成功:', categoriesWithCount.length, '個分類')
    console.log('📊 分類統計:', categoriesWithCount.map(c => `${c.name}: ${c.placeCount}個地點`))
    
    return categoriesWithCount
  } catch (error) {
    console.error('❌ 查詢分類失敗:', error)
    throw error
  }
}