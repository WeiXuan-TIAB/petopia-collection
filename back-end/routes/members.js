import express from 'express'
const router = express.Router()
import { ZodError } from 'zod'
import prisma from '../lib/prisma.js'

import {
  getMembers,
  getMemberById,
  createMember,
  updateMemberById,
  deleteMemberById,
  updateMemberPassword, // 新增：修改密碼函式
  memberSchema,
} from '../services/member.js'

import { successResponse, errorResponse, isDev } from '../lib/utils.js'
import authenticate from '../middlewares/authenticate.js'
import path from 'path'
import multer from 'multer'
import bcrypt from 'bcrypt'

// 設定檔案儲存位置和檔名
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/avatar/')
  },
  filename: function (req, file, callback) {
    // 用會員 ID 命名，避免重覆，可加時間戳避免快取問題
    const ext = path.extname(file.originalname)
    callback(null, `${req.user.id}${ext}`)
  },
})
const upload = multer({ storage })

router.post(
  '/me/avatar',
  authenticate,
  upload.single('avatar'),
  async (req, res) => {
    const memberId = req.user.id

    if (!req.file) {
      return res.status(400).json({ status: 'error', message: '沒有選擇圖片' })
    }

    // 建立圖片網址
    const filename = req.file.filename
    const baseUrl = process.env.BASE_URL || 'http://localhost:3005' // 🔹 改成你的實際後端 port
    const avatarUrl = `/avatar/${filename}` // 資料庫存相對路徑
    const fullUrl = `${baseUrl}${avatarUrl}?v=${Date.now()}` // 前端用完整網址，並加版本避免快取

    try {
      // 更新資料庫中的 avatar 欄位（只存相對路徑）
      await prisma.members.update({
        where: { id: memberId },
        data: { avatar: avatarUrl },
      })

      res.json({
        status: 'success',
        message: '頭像更新成功',
        avatar: fullUrl, // 前端直接用這個 URL
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ status: 'error', message: '伺服器錯誤' })
    }
  }
)

// #region GET
// 網址: /api/members
router.get('/', async (req, res) => {
  try {
    const members = await getMembers()
    successResponse(res, { members })
  } catch (error) {
    errorResponse(res, error)
  }
})

// 得到單筆資料(透過授權的直接使用JWT token中的id)
// 網址: /api/members/me
router.get('/me', authenticate, async (req, res) => {
  const memberId = req.user.id
  if (isDev) console.log('memberId', memberId)

  try {
    const member = await getMemberById(memberId)
    successResponse(res, { member })
  } catch (error) {
    errorResponse(res, error)
  }
})

// 網址: /api/members/:memberId
router.get('/:memberId', async (req, res) => {
  const memberId = Number(req.params.memberId)
  try {
    const member = await getMemberById(memberId)
    successResponse(res, { member })
  } catch (error) {
    errorResponse(res, error)
  }
})
// #endregion

// #region POST
// 網址: /api/members
router.post('/', upload.none(), async (req, res) => {
  try {
    const member = await createMember(req.body)
    successResponse(res, { member }, 201)
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: 'error',
        message: '資料格式不正確',
        issues: error.issues, // 提供欄位錯誤細節
      })
    }

    // 自訂錯誤訊息（例如重複註冊）
    if (error.message) {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    }

    // 其他錯誤交給通用處理
    errorResponse(res, error)
  }
})

// #endregion

// #region PUT
router.put('/me/profile', upload.none(), authenticate, async (req, res) => {
  const updatedMember = req.body
  const memberId = req.user.id

  try {
    // 先查詢目前的會員狀態
    const member = await prisma.members.findUnique({
      where: { id: memberId },
      select: { status: true },
    })

    if (!member) {
      return res.status(404).json({ status: 'error', message: '會員不存在' })
    }

    // 如果是 pending，更新時一起改成 active
    if (member.status === 'pending') {
      updatedMember.status = 'active'
    }

    await updateMemberById(memberId, updatedMember)
    successResponse(res)
  } catch (error) {
    errorResponse(res, error)
  }
})

// router.put('/:memberId/profile', upload.none(), async (req, res) => {
//   const updatedMember = req.body
//   const memberId = Number(req.params.memberId)
//   try {
//     await updateMemberById(memberId, updatedMember)
//     successResponse(res)
//   } catch (error) {
//     errorResponse(res, error)
//   }
// })

// **新增：修改密碼 API**
router.put('/me/password', upload.none(), authenticate, async (req, res) => {
  const memberId = req.user.id
  const { currentPassword, newPassword } = req.body

  try {
    // 1. 找出會員憑證 (限定 type=password)
    const memberCredential = await prisma.member_credentials.findFirst({
      where: { 
        member_id: memberId,
        type: 'password',
      },
    })

    // 如果沒有 password 類型的憑證
    if (!memberCredential) {
      return res
        .status(400)
        .json({ status: 'error', message: '此帳號為第三方登入，不支援修改密碼' })
    }

    console.log('memberId:', memberId)
    console.log('input currentPassword:', currentPassword)
    console.log('db hash:', memberCredential.credential_hash)

    // 2. 驗證舊密碼
    const valid = await bcrypt.compare(
      currentPassword,
      memberCredential.credential_hash
    )
    if (!valid) {
      return res.status(400).json({ status: 'error', message: '舊密碼錯誤' })
    }

    // 3. 更新密碼
    const hash = bcrypt.hashSync(newPassword, 10)
    await prisma.member_credentials.update({
      where: { id: memberCredential.id }, // 🔹 使用 id
      data: { credential_hash: hash },
    })

    res.json({ status: 'success', message: '密碼更新成功' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})



// router.put('/:memberId/password', upload.none(), authenticate, async (req, res) => {
//   const memberId = Number(req.params.memberId)
//   const { password } = req.body

//   // 確認權限：只有自己或管理員能改
//   if (req.user.id !== memberId) {
//     return res.status(403).json({ status: 'error', message: '無權限修改他人密碼' })
//   }

//   try {
//     const hash = bcrypt.hashSync(password, 10)
//     const updated = await updateMemberPassword(memberId, hash)
//     successResponse(res, { updated })
//   } catch (error) {
//     errorResponse(res, error)
//   }
// })
// #endregion

// #region DELETE
// 網址: /api/members/:memberId
router.delete('/:memberId', authenticate, async (req, res) => {
  const memberId = Number(req.params.memberId)

  // 確認權限
  if (req.user.id !== memberId /* && !req.user.isAdmin */) {
    return res
      .status(403)
      .json({ status: 'error', message: '無權限刪除此會員' })
  }

  try {
    await deleteMemberById(memberId)
    successResponse(res)
  } catch (error) {
    errorResponse(res, error)
  }
})

// #endregion

export default router
