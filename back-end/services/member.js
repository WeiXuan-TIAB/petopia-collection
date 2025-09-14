import prisma from '../lib/prisma.js'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import {
  isDev,
  isEmpty,
  validatedParamId,
  safeParseBindSchema,
} from '../lib/utils.js'

// #region Schema 檢查
const memberSchema = {}

memberSchema.newMember = z.object({
  email: z.string().email(),
  password: z.string().min(6), // 前端送明碼，後端負責 hash
  name: z.string().min(1).max(32),
  nickname: z.string().min(1).max(32).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  mobile: z.string().optional(),
  birthday: z.string().optional(),
})

memberSchema.updateMember = z.object({
  name: z.string().min(1).max(32),
  birthday: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  mobile: z.string().optional(),
  avatar: z.string().optional(),
})

const memberSchemaValidator = safeParseBindSchema(memberSchema)
// #endregion

// 取得所有會員
export const getMembers = async () => {
  const members = await prisma.members.findMany()
  members.forEach((m) => {
    for (const key in m) {
      if (m[key] === null) m[key] = ''
    }
  })
  return members
}

// 取得單一會員
export const getMemberById = async (id) => {
  validatedParamId(id)

  const member = await prisma.members.findUnique({
    where: { id },
  })

  if (!member) throw new Error('會員資料不存在')

  for (const key in member) {
    if (member[key] === null) member[key] = ''
  }

  if (member.birthday)
    member.birthday = member.birthday.toISOString().split('T')[0]

  return member
}

// 用任一欄位取得會員
export const getMemberByField = async (where = {}) => {
  if (isEmpty(where)) throw new Error('缺少必要參數')

  const member = await prisma.members.findUnique({ where })

  if (member) {
    for (const key in member) {
      if (member[key] === null) member[key] = ''
    }
    if (member.birthday)
      member.birthday = member.birthday.toISOString().split('T')[0]
  }

  return member
}

// 新增會員
export async function createMember(data) {
  // 驗證資料
  const { email, password, name, nickname, gender, mobile, birthday } =
    memberSchema.newMember.parse(data)

  // 1. 檢查 email 或 nickname 是否已存在
  const existMember = await prisma.members.findFirst({
    where: {
      OR: [
        { email },
        ...(nickname ? [{ nickname }] : []), // 有填 nickname 才檢查
      ],
    },
  })

  if (existMember) {
    throw new Error('Email 或暱稱已被註冊')
  }

  // 2. 建立 members 資料
  const newMember = await prisma.members.create({
    data: {
      email,
      name,
      nickname: nickname || null,
      gender: gender || null,
      mobile: mobile || null,
      birthday: birthday ? new Date(birthday) : null,
    },
  })

  // 3. 儲存密碼到 member_credentials
  await prisma.member_credentials.create({
    data: {
      member_id: newMember.id,
      credential_hash: bcrypt.hashSync(password, 10), // 使用 credential_hash
    },
  })

  // 4. 回傳必要資訊（不包含密碼）
  return {
    id: newMember.id,
    email: newMember.email,
    name: newMember.name,
    nickname: newMember.nickname || '',
    gender: newMember.gender || '',
    mobile: newMember.mobile || '',
    birthday: newMember.birthday
      ? newMember.birthday.toISOString().split('T')[0]
      : '',
  }
}



// 更新會員
export const updateMemberById = async (id, updateMember) => {
  validatedParamId(id)
  memberSchema.updateMember.parse(updateMember) // ✅ 直接用 Zod 驗證物件

  if (updateMember.birthday) {
    updateMember.birthday = new Date(updateMember.birthday)
  }

  return await prisma.members.update({
    where: { id },
    data: updateMember,
  })
}

// 更新會員密碼
export const updateMemberPassword = async (memberId, newHash) => {
  validatedParamId(memberId)

  if (!newHash || typeof newHash !== 'string') {
    throw new Error('新密碼雜湊值無效')
  }

  const updated = await prisma.member_credentials.update({
    where: { member_id: memberId },
    data: { credential_hash: newHash },
  })

  return updated
}


// 刪除會員
export const deleteMemberById = async (id) => {
  validatedParamId(id)
  return await prisma.members.delete({ where: { id } })
}

// 判斷某商品是否已加入我的最愛
export const isUserFavorite = async (member_id, product_id) => {
  // 驗證參數是否為正整數
  validatedParamId(member_id)
  validatedParamId(product_id)

  // 使用findUnique方法取得單筆最愛商品資料
  const favorite = await prisma.favorite.findFirst({
    where: {
      member_id: member_id,
      product_id: product_id,
    },
  })

  return favorite ? true : false
}

// 取得會員的加入我的最愛的商品id
export const getUserFavorites = async (member_id) => {
  // 驗證參數是否為正整數
  validatedParamId(member_id)

  // 使用findMany方法取得所有使用者的最愛商品資料
  const favorites = await prisma.favorite.findMany({
    where: {
      member_id: member_id,
    },
  })

  // console.log(favorites)

  // 將結果中的pid取出變為一個純資料的陣列
  return favorites.map((v) => v.product_id)
}

// 新增商品到我的最愛
export const addUserFavorite = async (member_id, product_id) => {
  // 驗證參數是否為正整數
  validatedParamId(member_id)
  validatedParamId(product_id)

  // 查詢是否有相同的最愛商品資料
  const existFav = await isUserFavorite(member_id, product_id)

  // 如果有重覆的最愛商品資料，拋出錯誤
  if (existFav) {
    throw new Error('資料已經存在，新增失敗')
  }

  // 查詢是否有此商品資料
  const existProduct = await prisma.product.findUnique({
    where: {
      id: product_id,
    },
  })

  // 如果無此商品資料，拋出錯誤
  if (!existProduct) {
    throw new Error('商品資料不存在，新增失敗')
  }

  // 建立最愛商品資料
  return await prisma.favorite.create({
    data: {
      member_id: member_id,
      product_id: product_id,
    },
  })
}

// 刪除我的最愛的商品
export const deleteUserFavorite = async (member_id, product_id) => {
  // 驗證參數是否為正整數
  validatedParamId(member_id)
  validatedParamId(product_id)

  // 查詢此資料是否存在
  const existFav = await isUserFavorite(member_id, product_id)

  // 如果無此最愛商品資料，拋出錯誤
  if (!existFav) {
    throw new Error('資料不存在，刪除失敗')
  }

  return await prisma.favorite.delete({
    where: {
      // 複合主鍵(預設名稱為兩個欄位名稱以_相加)
      member_id_product_id: {
        member_id: member_id,
        product_id: product_id,
      },
    },
  })
}

// 匯出 schema 給 routes 使用
export { memberSchema }
