// routes/reservations.js
import express from 'express'
import { z } from 'zod'
import prisma from '../lib/prisma.js'
import jsonwebtoken from 'jsonwebtoken'
import { serverConfig } from '../config/server.config.js'

const router = express.Router()
const accessTokenSecret = serverConfig.jwt.secret

// === JWT 驗證中間件 ===
async function authMiddleware(req, res, next) {
  const token = req.cookies?.accessToken
  if (!token) return res.status(401).json({ status: 'error', message: '未登入' })

  try {
    const payload = jsonwebtoken.verify(token, accessTokenSecret)
    if (!payload?.id) {
      return res.status(401).json({ status: 'error', message: 'Token 缺少會員 ID' })
    }

    const member = await prisma.members.findFirst({
      where: { id: payload.id },
      select: { id: true, email: true, name: true, nickname: true, avatar: true, mobile: true },
    })
    if (!member) return res.status(404).json({ status: 'error', message: '會員不存在' })

    req.user = member
    next()
  } catch (err) {
    console.error('JWT 驗證失敗:', err)
    return res.status(403).json({ status: 'error', message: '存取令牌無效' })
  }
}

// === 可調參數 ===
const DURATION_MINUTES = 90
const MAX_AHEAD_DAYS = 30

// === 小工具 ===
const pad = (n) => String(n).padStart(2, '0')
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const minutesToHHmm = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`

// ✅ 建立台北時區 DateTime → 存 DB 會自動轉成 UTC
function toTaipeiDateTime(dateStr, timeStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const [hour, minute] = timeStr.split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute, 0)
}

// ✅ 格式化輸出為台北時間
function formatReservation(r) {
  const tzDate = { timeZone: 'Asia/Taipei' }
  const tzTime = {
    timeZone: 'Asia/Taipei',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }
  return {
    ...r,
    reservation_date: r.reservation_date
      ? r.reservation_date.toLocaleDateString('zh-TW', tzDate)
      : null,
    start_time: r.start_time ? r.start_time.toLocaleTimeString('zh-TW', tzTime) : null,
    end_time: r.end_time ? r.end_time.toLocaleTimeString('zh-TW', tzTime) : null,
  }
}

// === 驗證 Schema ===
const BodySchema = z.object({
  member_id: z.coerce.number().int().positive(),
  party_size: z.coerce.number().int().min(1).max(20),
  has_pet: z.coerce.boolean().optional().default(false),
  contact_phone: z.string().max(16).optional().nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
})

/**
 * ✅ 查詢登入會員的所有訂位
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const memberId = req.user.id
    const page = parseInt(req.query.page || '1', 10)
    const pageSize = parseInt(req.query.pageSize || '10', 10)
    const status = req.query.status || ''

    const where = { member_id: memberId }
    if (status) where.status = status

    const [total, reservations] = await Promise.all([
      prisma.reservations.count({ where }),
      prisma.reservations.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { restaurants: true },
        orderBy: { created_at: 'desc' },
      }),
    ])

    return res.json({
      status: 'success',
      data: reservations.map(formatReservation),
      pagination: { total, page, pageSize },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ status: 'error', message: '查詢失敗' })
  }
})

/**
 * ✅ 建立訂位
 */
router.post('/:id/reservations', authMiddleware, async (req, res) => {
  try {
    const restaurantId = Number(req.params.id)
    if (Number.isNaN(restaurantId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid restaurant id' })
    }

    const parsed = BodySchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid body',
        issues: parsed.error.issues,
      })
    }

    const { member_id, party_size, has_pet, contact_phone, date, time } = parsed.data
    const startDateTime = toTaipeiDateTime(date, time)
    const endDateTime = toTaipeiDateTime(date, minutesToHHmm(toMinutes(time) + DURATION_MINUTES))

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const max = new Date(today)
    max.setDate(max.getDate() + MAX_AHEAD_DAYS)
    if (startDateTime < today || startDateTime > max) {
      return res.status(400).json({ status: 'error', message: '日期需在 30 天內' })
    }

    const weekday = startDateTime.getDay()
    const spans = await prisma.restaurant_business_hours.findMany({
      where: { restaurant_id: restaurantId, weekday },
      select: { start_time: true, end_time: true },
      orderBy: { start_time: 'asc' },
    })
    if (!spans.length) {
      return res.status(400).json({ status: 'error', message: '該日公休' })
    }

    const created = await prisma.reservations.create({
      data: {
        member_id,
        restaurant_id: restaurantId,
        reservation_date: startDateTime,
        start_time: startDateTime,
        end_time: endDateTime,
        party_size,
        has_pet: !!has_pet,
        status: 'pending',
        contact_phone: contact_phone || null,
        expire_at: new Date(Date.now() + 15 * 60 * 1000),
        created_by: member_id,
        updated_by: member_id,
      },
    })

    return res.json({
      status: 'success',
      data: formatReservation(created),
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ status: 'error', message: '建立訂位失敗' })
  }
})

/**
 * ✅ 查詢單筆訂位
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id)
    const reservation = await prisma.reservations.findUnique({ where: { id } })
    if (!reservation) {
      return res.status(404).json({ status: 'error', message: '訂位不存在' })
    }

    return res.json({
      status: 'success',
      data: formatReservation(reservation),
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ status: 'error', message: '查詢失敗' })
  }
})

/**
 * ✅ 取消訂位
 */
router.patch('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id)
    const memberId = req.user.id

    const reservation = await prisma.reservations.findUnique({ where: { id } })
    if (!reservation) {
      return res.status(404).json({ status: 'error', message: '訂位不存在' })
    }
    if (reservation.member_id !== memberId) {
      return res.status(403).json({ status: 'error', message: '無權限取消此訂位' })
    }

    const updated = await prisma.reservations.update({
      where: { id },
      data: {
        status: 'cancelled',
        updated_by: memberId,
        updated_at: new Date(),
      },
    })

    return res.json({
      status: 'success',
      data: formatReservation(updated),
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ status: 'error', message: '取消失敗' })
  }
})

export default router
