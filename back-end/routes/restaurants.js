// routes/restaurants.js
import express from 'express'
import prisma from '../lib/prisma.js'

const router = express.Router()

// enum <-> 中文 對照
const TYPE_LABEL = {
  cat_friendly: '貓貓友善',
  dog_friendly: '狗狗友善',
  pet_friendly: '貓狗友善',
}
const LABEL_TO_ENUM = Object.fromEntries(
  Object.entries(TYPE_LABEL).map(([en, zh]) => [zh, en])
)

const parseCsv = (v) =>
  typeof v === 'string' && v.trim() !== '' ? v.split(',') : []

const sortToOrderBy = (sort) => {
  switch (sort) {
    case 'ratingDesc':
    case 'rankingDescend':
      return [{ rating: 'desc' }, { created_at: 'desc' }]
    case 'ratingAsc':
    case 'rankingAscend':
      return [{ rating: 'asc' }, { created_at: 'desc' }]
    case 'newest':
      return [{ created_at: 'desc' }]
    case 'oldest':
      return [{ created_at: 'asc' }]
    case 'nameAsc':
      return [{ name: 'asc' }]
    case 'nameDesc':
      return [{ name: 'desc' }]
    default:
      return [{ created_at: 'desc' }]
  }
}

/**
 * GET /api/restaurants
 * 列表
 */
router.get('/', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page ?? '1', 10), 1)
    const pageSize = Math.max(parseInt(req.query.pageSize ?? '12', 10), 1)
    const sort = (req.query.sort || '').toString()

    const cities = parseCsv(req.query.city)
    const typesRaw = parseCsv(req.query.type)
    const types = typesRaw
      .map((t) => LABEL_TO_ENUM[t] || t)
      .filter((t) => TYPE_LABEL[t])

    const q = req.query.q

    const where = {
      AND: [
        cities.length ? { city: { in: cities } } : {},
        types.length ? { type: { in: types } } : {},
        q
          ? {
              OR: [
                { name: { contains: q } },
                { description: { contains: q } },
                { city: { contains: q } },
                { area: { contains: q } },
              ],
            }
          : {},
      ],
    }

    const orderBy = sortToOrderBy(sort)

    const [rows, total] = await Promise.all([
      prisma.restaurants.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          city: true,
          area: true,
          description: true,
          type: true,
          rating: true,
          thumbnail_url: true,
          banner_url: true,
          created_at: true,
        },
      }),
      prisma.restaurants.count({ where }),
    ])

    const data = rows.map((r) => ({
      id: r.id,
      imageSrc: r.thumbnail_url || null,
      restaurantName: r.name,
      restaurantType: TYPE_LABEL[r.type] || r.type,
      restaurantRating: r.rating?.toString?.() ?? '',
      restaurantLocation: `${r.city || ''}${r.area || ''}`,
      restaurantDescription: r.description,
      bannerSrc: r.banner_url || null,
    }))

    res.json({ status: 'success', data, total, page, pageSize })
  } catch (e) {
    console.error(e)
    res.status(500).json({ status: 'error', message: '取得餐廳列表失敗' })
  }
})

/**
 * GET /api/restaurants/:id
 * 單筆詳情（動態頁 /restaurant/[id] 對應）
 */
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid id' })
    }

    const r = await prisma.restaurants.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        type: true,
        rating: true,
        city: true,
        area: true,
        street: true,
        description: true,
        latitude: true,
        longitude: true,
        banner_url: true,
        thumbnail_url: true,
        restaurant_photos: {
          select: { id: true, url: true },
          orderBy: { id: 'asc' },
        },
      },
    })

    if (!r) {
      return res.status(404).json({ status: 'error', message: 'Not found' })
    }

    const data = {
      id: r.id,
      name: r.name,
      type: TYPE_LABEL[r.type] || r.type,
      type_enum: r.type,
      rating: Number(r.rating),
      city: r.city,
      area: r.area,
      street: r.street,
      description: r.description,
      lat: r.latitude,
      lng: r.longitude,
      bannerSrc: r.banner_url || (r.restaurant_photos[0]?.url ?? null),
      thumbnailSrc: r.thumbnail_url,
      photos: r.restaurant_photos, // 前端自己決定怎麼處理 url
    }

    res.json({ status: 'success', data })
  } catch (e) {
    console.error(e)
    res.status(500).json({ status: 'error', message: '取得餐廳詳情失敗' })
  }
})

// GET /api/restaurants/:id/business-hours
router.get('/:id/business-hours', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) return res.status(400).json({ status: 'error', message: 'Invalid id' })

    const rows = await prisma.restaurant_business_hours.findMany({
      where: { restaurant_id: id },
      orderBy: [{ weekday: 'asc' }, { start_time: 'asc' }],
      select: { weekday: true, start_time: true, end_time: true, note: true },
    })

    // 回傳為 byWeekday: 0..6，每個元素是多個時段，時間字串化成 HH:mm
    const toHHmm = (d) => d.toISOString().slice(11, 16)
    const byWeekday = Array.from({ length: 7 }, () => [])
    for (const r of rows) {
      byWeekday[r.weekday].push({
        start: toHHmm(r.start_time),
        end: toHHmm(r.end_time),
        note: r.note ?? null,
      })
    }

    res.json({ status: 'success', data: { byWeekday } })
  } catch (e) {
    console.error(e)
    res.status(500).json({ status: 'error', message: '取得營業時間失敗' })
  }
})




export default router
