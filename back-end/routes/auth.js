import express from 'express'
import multer from 'multer'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jsonwebtoken from 'jsonwebtoken'
import prisma from '../lib/prisma.js'
import { z } from 'zod'
import {
  successResponse,
  errorResponse,
  isDev,
  safeParseBindSchema,
} from '../lib/utils.js'
import { serverConfig } from '../config/server.config.js'

import * as fs from 'fs'
import { promises as fsPromises } from 'fs'
import path from 'path'
import admin from "../config/firebase-admin.js";
import https from 'https'
import { transporter } from '../utils/mailer.js'

const router = express.Router()
const upload = multer()
const accessTokenSecret = serverConfig.jwt.secret

// === Schema 驗證 ===
const authSchema = {}
authSchema.loginData = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(5).max(30),
})
authSchema.resetPasswordData = z.object({
  email: z.string().email(),
  newPassword: z.string().min(5).max(30),
})
const authSchemaValidator = safeParseBindSchema(authSchema)

// === 登入（帳密） ===
export const login = async (loginData) => {
  authSchemaValidator({ loginData })

  const member = await prisma.members.findFirst({
    where: {
      OR: [{ email: loginData.username }, { nickname: loginData.username }],
    },
  })
  if (!member) throw new Error('使用者不存在')

  const credential = await prisma.member_credentials.findFirst({
    where: {
      member_id: member.id,
      type: 'password',
    },
  })
  if (!credential) throw new Error('帳號密碼設定錯誤')

  const isValid = await bcrypt.compare(
    loginData.password,
    credential.credential_hash
  )
  if (!isValid) throw new Error('密碼錯誤')

  for (const key in member) {
    if (member[key] === null) member[key] = ''
  }
  return member
}

// === 產生 JWT Cookie ===
const generateAccessToken = async (res, user) => {
  const accessToken = jsonwebtoken.sign(user, accessTokenSecret, {
    expiresIn: '3d',
  })

  const option = isDev
    ? { httpOnly: true, sameSite: 'lax', secure: false }
    : {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        domain: serverConfig.domain,
      }

  res.cookie('accessToken', accessToken, option)
}

// === 清除 Cookie ===
const logoutClearCookie = (res) => {
  const option = isDev
    ? { httpOnly: true, sameSite: 'lax', secure: false }
    : {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        domain: serverConfig.domain,
      }

  res.clearCookie('accessToken', option)
  res.clearCookie('SESSION_ID', option)
}

// === 儲存或更新頭像 ===
const saveOrUpdateAvatar = async (memberId, picture) => {
  if (!picture) return null

  const avatarDir = path.resolve('./public/avatar')
  try {
    await fsPromises.access(avatarDir)
  } catch {
    await fsPromises.mkdir(avatarDir, { recursive: true })
  }

  const ext = picture.includes('.png') ? '.png' : '.jpg'
  const avatarPath = path.join(avatarDir, `${memberId}${ext}`)

  // 刪除舊檔案
  const files = await fsPromises.readdir(avatarDir)
  await Promise.all(
    files
      .filter(
        (file) =>
          file.startsWith(`${memberId}.`) && file !== `${memberId}${ext}`
      )
      .map((file) => fsPromises.unlink(path.join(avatarDir, file)))
  )

  // 下載圖片（支援 302 redirect）
  await new Promise((resolve, reject) => {
    const doRequest = (url) => {
      https
        .get(url, (response) => {
          if (
            response.statusCode >= 300 &&
            response.statusCode < 400 &&
            response.headers.location
          ) {
            return doRequest(response.headers.location)
          }
          if (response.statusCode !== 200) {
            reject(new Error(`下載失敗，狀態碼: ${response.statusCode}`))
            return
          }
          const file = fs.createWriteStream(avatarPath)
          response.pipe(file)
          file.on('finish', () => file.close(resolve))
        })
        .on('error', (err) => {
          fsPromises.unlink(avatarPath).catch(() => {})
          reject(err)
        })
    }
    doRequest(picture)
  })

  // 更新 DB
  await prisma.members.update({
    where: { id: memberId },
    data: { avatar: `/avatar/${memberId}${ext}` },
  })

  return `/avatar/${memberId}${ext}`
}

// === 帳密登入 API ===
router.post('/login', upload.none(), async (req, res) => {
  if (isDev) console.log('Login Body:', req.body)
  try {
    const user = await login(req.body)
    await generateAccessToken(res, {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    })
    successResponse(res, { user })
  } catch (error) {
    errorResponse(res, error)
  }
})

// === Google Firebase 登入 API ===
router.post('/google-firebase', async (req, res) => {
  try {
    const { idToken } = req.body
    if (!idToken) return errorResponse(res, new Error('缺少 idToken'))

    const decoded = await admin.auth().verifyIdToken(idToken)
    const { uid, email, name, picture } = decoded

    let member
    let boundExisting = false

    // 先檢查 Google 憑證
    const credential = await prisma.member_credentials.findFirst({
      where: {
        type: 'oauth',
        provider: 'google',
        oauth_uid: uid,
      },
      include: { members: true },
    })

    if (credential) {
      // ✅ 已有 Google 綁定
      member = credential.members
      if (!member.avatar && picture) {
        member.avatar = await saveOrUpdateAvatar(member.id, picture)
      }
    } else {
      // 檢查同 email 是否有現有帳號（密碼登入）
      const existingMember = await prisma.members.findFirst({
        where: { email: email || '' },
      })

      if (existingMember) {
        // 🔹 幫原本帳號加上 Google 綁定
        await prisma.member_credentials.create({
          data: {
            member_id: existingMember.id,
            type: 'oauth',
            provider: 'google',
            oauth_uid: uid,
            credential_hash: '',
          },
        })
        member = existingMember
        boundExisting = true
        if (!member.avatar && picture) {
          member.avatar = await saveOrUpdateAvatar(member.id, picture)
        }
      } else {
        // 🔹 全新帳號
        member = await prisma.members.create({
          data: {
            email: email || '',
            nickname: name || 'Google用戶',
            status: 'pending',
            avatar: null,
          },
        })
        await prisma.member_credentials.create({
          data: {
            member_id: member.id,
            type: 'oauth',
            provider: 'google',
            oauth_uid: uid,
            credential_hash: '',
          },
        })
        member.avatar = await saveOrUpdateAvatar(member.id, picture)
      }
    }

    await generateAccessToken(res, {
      id: member.id,
      email: member.email,
      nickname: member.nickname,
    })

    successResponse(res, {
      user: { ...member, status: member.status || 'pending' },
      boundExisting,
    })
  } catch (err) {
    console.error('Google 登入失敗:', err)
    errorResponse(res, new Error('Google 登入驗證失敗'))
  }
})

// === 登出 ===
router.post('/logout', (req, res) => {
  logoutClearCookie(res)
  successResponse(res, { message: '已登出' })
})

// === 檢查登入狀態 ===
router.get('/check', async (req, res) => {
  const token = req.cookies.accessToken
  if (!token)
    return res.status(401).json({ status: 'error', message: '未登入' })

  try {
    const payload = jsonwebtoken.verify(token, accessTokenSecret)
    const member = await prisma.members.findFirst({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        avatar: true,
        mobile: true,
        status: true,
      },
    })
    if (!member)
      return res.status(404).json({ status: 'error', message: '會員不存在' })
    successResponse(res, { user: member })
  } catch {
    res.status(403).json({ status: 'error', message: '存取令牌無效' })
  }
})

// === 重設密碼 ===
// export const resetPassword = async (email, newPassword) => {
//   authSchemaValidator({ resetPasswordData: { email, newPassword } })

//   const member = await prisma.members.findFirst({ where: { email } })
//   if (!member) throw new Error('使用者不存在')

//   const hash = await bcrypt.hash(newPassword, 10)

//   await prisma.member_credentials.update({
//     where: {
//       member_id_type: {
//         member_id: member.id,
//         type: 'password', // ✅ 只更新密碼登入類型
//       },
//     },
//     data: { credential_hash: hash },
//   })

//   await prisma.otp.deleteMany({ where: { email } })
// }

// === 1. 忘記密碼：產生 token + 寄信 ===
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body
  try {
    const member = await prisma.members.findUnique({ where: { email } })

    if (!member) {
      return res.status(400).json({ status: 'error', message: '此 Email 尚未註冊為會員' })
    }

    // 產生 token & 有效期限
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 1000 * 60 * 15) // 15 分鐘

    // 寫入 password_resets
    await prisma.password_resets.create({
      data: {
        member_id: member.id,
        token,
        expires_at: expires,
      },
    })

    // 生成 reset link
    const resetLink = `http://localhost:3000/member/reset-password?token=${token}`

    // 📧 用 Nodemailer 發送信件
    await transporter.sendMail({
      from: `"Petopia" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Petopia 密碼重設通知',
      html: `
        <p>您好，</p>
        <p>請點擊以下連結重設您的密碼（15 分鐘內有效）：</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>如果您沒有申請重設密碼，請忽略此信件。</p>
      `,
    })

    return res.json({ status: 'success', message: '重設密碼信已寄出' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ status: 'error', message: '寄信失敗' })
  }
})

// === 2. 重設密碼：驗證 token + 更新 DB ===
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body

  try {
    // 找到重設紀錄
    const resetRecord = await prisma.password_resets.findUnique({
      where: { token },
    })

    if (!resetRecord) {
      return res
        .status(400)
        .json({ status: 'error', message: '無效的連結，請重新申請' })
    }

    if (resetRecord.expires_at < new Date()) {
      return res
        .status(400)
        .json({ status: 'error', message: '連結已過期，請重新申請' })
    }

    // Hash 新密碼
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // 找會員的「密碼」憑證
    const cred = await prisma.member_credentials.findFirst({
      where: {
        member_id: resetRecord.member_id,
        type: 'password',
      },
    })

    if (!cred) {
      return res
        .status(400)
        .json({ status: 'error', message: '找不到密碼憑證' })
    }

    // 更新 credential_hash
    const updated = await prisma.member_credentials.update({
      where: { id: cred.id },
      data: {
        credential_hash: hashedPassword,
        updated_at: new Date(),
        is_force_reset: false,
      },
    })

    console.log('✅ 更新結果:', updated)

    // 刪掉 token
    await prisma.password_resets.delete({
      where: { token },
    })

    return res.json({ status: 'success', message: '密碼重設成功' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ status: 'error', message: '密碼重設失敗' })
  }
})

export default router
