import prisma from '../lib/prisma.js'
import { z } from 'zod'
import { validatedParamId, safeParseBindSchema } from '../lib/utils.js'

// #region 建立驗證格式用函式
// 建立交友資料的驗證用的schema物件
const friendSchema = {}

// 寵物篩選條件的驗証用的schema
friendSchema.petFilters = z.object({
  species: z.number().optional(),
  ageMin: z.number().optional(),
  ageMax: z.number().optional(),
  gender: z.enum(['male', 'female', 'unknown']).optional(),
  isNeutered: z.boolean().optional(),
  limit: z.number().optional(),
})

// 訊息資料的驗証用的schema
friendSchema.message = z.object({
  matchId: z.number(),
  senderId: z.number(),
  messageText: z.string().min(1),
  messageType: z.enum(['text', 'image', 'sticker']).default('text'),
  imageUrl: z.string().optional(),
})

// 綁定驗證用的schema的檢查函式
const friendSchemaValidator = safeParseBindSchema(friendSchema)
// #endregion

const generatePetWhere = (memberId, filters) => {
  // 檢查從前端來的資料是否符合格式
  friendSchemaValidator({ petFilters: filters })

  let whereConditions = []
  let params = [memberId, memberId] // 基本參數：排除自己的寵物和已按愛心的寵物

  // 物種篩選
  if (filters.species) {
    whereConditions.push('AND pp.species = ?')
    params.push(filters.species)
  }

  // 性別篩選
  if (filters.gender) {
    whereConditions.push('AND pp.gender = ?')
    params.push(filters.gender)
  }

  // 結紮狀態篩選
  if (filters.isNeutered !== null && filters.isNeutered !== undefined) {
    whereConditions.push('AND pp.is_neutered = ?')
    params.push(filters.isNeutered)
  }

  return { whereConditions, params }
}

/**
 * 探索寵物
 * @param {number} memberId - 會員ID
 * @param {Object} filters - 篩選條件
 * @returns {Array} 寵物列表
 */
export const discoverPets = async (memberId, filters = {}) => {
  // 驗證參數
  validatedParamId(memberId)

  const { whereConditions, params } = generatePetWhere(memberId, filters)

  // 構建基本查詢
  let query = `
    SELECT 
      pp.*,
      ps.name as species_name,
      ps.icon_url as species_icon,
      m.nickname as owner_nickname,
      TIMESTAMPDIFF(YEAR, pp.birthday, CURDATE()) as age,
      GROUP_CONCAT(DISTINCT pers.personality SEPARATOR ', ') as personalities
    FROM pet_profiles pp
    LEFT JOIN pet_species ps ON pp.species = ps.id
    LEFT JOIN members m ON pp.member_id = m.id
    LEFT JOIN pet_profile_personalities ppp ON pp.id = ppp.pet_profile_id
    LEFT JOIN pet_personalities pers ON ppp.personality_id = pers.id
    WHERE pp.member_id != ?
      AND pp.id NOT IN (
        SELECT to_pet_profile_id 
        FROM pet_likes 
        WHERE from_member_id = ?
      )
  `

  // 加入篩選條件
  query += whereConditions.join(' ')
  query += ' GROUP BY pp.id'

  // 年齡篩選 (在 HAVING 子句中)
  const ageConditions = []
  if (filters.ageMin !== null && filters.ageMin !== undefined) {
    ageConditions.push('age >= ?')
    params.push(filters.ageMin)
  }
  if (filters.ageMax !== null && filters.ageMax !== undefined) {
    ageConditions.push('age <= ?')
    params.push(filters.ageMax)
  }

  if (ageConditions.length > 0) {
    query += ' HAVING ' + ageConditions.join(' AND ')
  }

  query += ' ORDER BY RAND()'

  if (filters.limit) {
    query += ' LIMIT ?'
    params.push(filters.limit)
  }

  const pets = await prisma.$queryRawUnsafe(query, ...params)

  // 為每個寵物取得照片
  for (const pet of pets) {
    const photos = await prisma.pet_profile_photos.findMany({
      where: { pet_profile_id: pet.id },
      select: { photo_url: true, photo_order: true },
      orderBy: { photo_order: 'asc' }
    })
    pet.photos = photos
    pet.main_photo = photos.length > 0 ? photos[0].photo_url : null
  }

  return pets
}

/**
 * 對寵物按愛心
 * @param {number} memberId - 會員ID
 * @param {number} petProfileId - 寵物檔案ID
 * @returns {Object} 結果包含是否配對成功
 */
export const likePet = async (memberId, petProfileId) => {
  // 驗證參數
  validatedParamId(memberId)
  validatedParamId(petProfileId)

  // 檢查寵物是否存在
  const pet = await prisma.pet_profiles.findUnique({
    where: { id: petProfileId },
    select: { member_id: true }
  })

  if (!pet) {
    throw new Error('Pet profile not found')
  }

  // 檢查是否是自己的寵物
  if (pet.member_id === memberId) {
    throw new Error('Cannot like own pet')
  }

  const petOwnerId = pet.member_id

  try {
    // 檢查是否已經按過愛心
    const existingLike = await prisma.pet_likes.findFirst({
      where: {
        from_member_id: memberId,
        to_pet_profile_id: petProfileId
      }
    })

    if (existingLike) {
      throw new Error('duplicate like')
    }

    // 新增愛心記錄
    await prisma.pet_likes.create({
      data: {
        from_member_id: memberId,
        to_pet_profile_id: petProfileId
      }
    })

    // 檢查是否有互相愛心（配對）
    const mutualLikes = await prisma.$queryRaw`
      SELECT pl1.id
      FROM pet_likes pl1
      JOIN pet_likes pl2 ON pl1.from_member_id = pl2.to_pet_profile_id
      JOIN pet_profiles pp1 ON pl1.to_pet_profile_id = pp1.id
      JOIN pet_profiles pp2 ON pl2.to_pet_profile_id = pp2.id
      WHERE pl1.from_member_id = ${memberId}
        AND pl1.to_pet_profile_id = ${petProfileId}
        AND pl2.from_member_id = ${petOwnerId}
        AND pp2.member_id = ${memberId}
    `

    if (mutualLikes.length > 0) {
      // 創建配對記錄
      const myPet = await prisma.pet_profiles.findFirst({
        where: { member_id: memberId },
        select: { id: true }
      })

      if (myPet) {
        const match = await prisma.pet_matches.create({
          data: {
            member1_id: memberId,
            member2_id: petOwnerId,
            pet1_profile_id: myPet.id,
            pet2_profile_id: petProfileId
          }
        })

        return {
          isMatch: true,
          matchId: match.id
        }
      }
    }

    return {
      isMatch: false
    }
  } catch (error) {
    if (error.message.includes('duplicate')) {
      throw new Error('duplicate like')
    }
    throw error
  }
}

/**
 * 取得配對列表
 * @param {number} memberId - 會員ID
 * @param {number} page - 頁碼
 * @param {number} limit - 每頁筆數
 * @returns {Object} 配對列表和分頁資訊
 */
export const getMatches = async (memberId, page = 1, limit = 20) => {
  // 驗證參數
  validatedParamId(memberId)
  validatedParamId(page)
  validatedParamId(limit)

  const offset = (page - 1) * limit

  const matches = await prisma.$queryRaw`
    SELECT 
      pm.*,
      CASE 
        WHEN pm.member1_id = ${memberId} THEN m2.nickname
        ELSE m1.nickname
      END as other_member_nickname,
      CASE 
        WHEN pm.member1_id = ${memberId} THEN m2.avatar_url
        ELSE m1.avatar_url
      END as other_member_avatar,
      CASE 
        WHEN pm.member1_id = ${memberId} THEN pp2.name
        ELSE pp1.name
      END as other_pet_name,
      CASE 
        WHEN pm.member1_id = ${memberId} THEN pp2.id
        ELSE pp1.id
      END as other_pet_id
    FROM pet_matches pm
    LEFT JOIN members m1 ON pm.member1_id = m1.id
    LEFT JOIN members m2 ON pm.member2_id = m2.id
    LEFT JOIN pet_profiles pp1 ON pm.pet1_profile_id = pp1.id
    LEFT JOIN pet_profiles pp2 ON pm.pet2_profile_id = pp2.id
    WHERE (pm.member1_id = ${memberId} OR pm.member2_id = ${memberId})
      AND pm.is_active = 1
    ORDER BY pm.matched_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `

  // 為每個配對取得最後訊息和未讀數量
  for (const match of matches) {
    // 取得最後訊息
    const lastMessage = await prisma.pet_chat_messages.findFirst({
      where: { match_id: match.id },
      orderBy: { sent_at: 'desc' },
      select: { message_text: true, sent_at: true }
    })

    if (lastMessage) {
      match.last_message = lastMessage.message_text
      match.last_message_time = lastMessage.sent_at
    }

    // 取得未讀數量
    const readStatus = await prisma.pet_chat_read_status.findFirst({
      where: {
        match_id: match.id,
        member_id: memberId
      },
      select: { last_read_message_id: true }
    })

    const unreadCount = await prisma.pet_chat_messages.count({
      where: {
        match_id: match.id,
        sender_member_id: { not: memberId },
        id: {
          gt: readStatus?.last_read_message_id || 0
        }
      }
    })

    match.unread_count = unreadCount

    // 取得對方寵物照片
    const otherPetPhoto = await prisma.pet_profile_photos.findFirst({
      where: { pet_profile_id: match.other_pet_id },
      select: { photo_url: true },
      orderBy: { photo_order: 'asc' }
    })

    match.other_pet_photo = otherPetPhoto?.photo_url || null
  }

  const countResult = await prisma.$queryRaw`
    SELECT COUNT(*) as total
    FROM pet_matches
    WHERE (member1_id = ${memberId} OR member2_id = ${memberId})
      AND is_active = 1
  `

  const total = Number(countResult[0].total)

  return {
    matches,
    pagination: {
      current_page: page,
      per_page: limit,
      total,
      total_pages: Math.ceil(total / limit)
    }
  }
}

/**
 * 取得聊天訊息
 * @param {number} memberId - 會員ID
 * @param {number} matchId - 配對ID
 * @param {number} page - 頁碼
 * @param {number} limit - 每頁筆數
 * @returns {Object} 訊息列表和分頁資訊
 */
export const getChatMessages = async (memberId, matchId, page = 1, limit = 50) => {
  // 驗證參數
  validatedParamId(memberId)
  validatedParamId(matchId)
  validatedParamId(page)
  validatedParamId(limit)

  // 檢查權限
  const hasPermission = await checkMatchPermission(memberId, matchId)
  if (!hasPermission) {
    throw new Error('No permission to access this match')
  }

  const offset = (page - 1) * limit

  const messages = await prisma.$queryRaw`
    SELECT 
      pcm.*,
      m.nickname as sender_nickname,
      m.avatar_url as sender_avatar
    FROM pet_chat_messages pcm
    LEFT JOIN members m ON pcm.sender_member_id = m.id
    WHERE pcm.match_id = ${matchId}
    ORDER BY pcm.sent_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `

  const countResult = await prisma.$queryRaw`
    SELECT COUNT(*) as total
    FROM pet_chat_messages
    WHERE match_id = ${matchId}
  `

  const total = Number(countResult[0].total)

  return {
    messages: messages.reverse(), // 反轉以時間順序顯示
    pagination: {
      current_page: page,
      per_page: limit,
      total,
      total_pages: Math.ceil(total / limit)
    }
  }
}

/**
 * 發送訊息
 * @param {Object} messageData - 訊息資料
 * @returns {Object} 新發送的訊息
 */
export const sendMessage = async (messageData) => {
  // 檢查從前端來的資料是否符合格式
  friendSchemaValidator({ message: messageData })

  const { matchId, senderId, messageText, messageType = 'text', imageUrl } = messageData

  // 檢查權限
  const hasPermission = await checkMatchPermission(senderId, matchId)
  if (!hasPermission) {
    throw new Error('No permission to send message to this match')
  }

  const message = await prisma.pet_chat_messages.create({
    data: {
      match_id: matchId,
      sender_member_id: senderId,
      message_text: messageText,
      message_type: messageType,
      image_url: imageUrl
    }
  })

  // 取得新發送的訊息詳細資料
  const messageDetail = await prisma.$queryRaw`
    SELECT 
      pcm.*,
      m.nickname as sender_nickname,
      m.avatar_url as sender_avatar
    FROM pet_chat_messages pcm
    LEFT JOIN members m ON pcm.sender_member_id = m.id
    WHERE pcm.id = ${message.id}
  `

  return messageDetail[0]
}

/**
 * 標記訊息為已讀
 * @param {number} memberId - 會員ID
 * @param {number} matchId - 配對ID
 * @param {number} lastMessageId - 最後已讀訊息ID
 */
export const markMessagesAsRead = async (memberId, matchId, lastMessageId) => {
  // 驗證參數
  validatedParamId(memberId)
  validatedParamId(matchId)
  validatedParamId(lastMessageId)

  // 檢查權限
  const hasPermission = await checkMatchPermission(memberId, matchId)
  if (!hasPermission) {
    throw new Error('No permission to access this match')
  }

  await prisma.pet_chat_read_status.upsert({
    where: {
      match_id_member_id: {
        match_id: matchId,
        member_id: memberId
      }
    },
    update: {
      last_read_message_id: lastMessageId,
      last_read_at: new Date()
    },
    create: {
      match_id: matchId,
      member_id: memberId,
      last_read_message_id: lastMessageId
    }
  })
}

/**
 * 取得送出的愛心列表
 * @param {number} memberId - 會員ID
 * @param {number} page - 頁碼
 * @param {number} limit - 每頁筆數
 * @returns {Object} 愛心列表和分頁資訊
 */
export const getSentLikes = async (memberId, page = 1, limit = 20) => {
  // 驗證參數
  validatedParamId(memberId)
  validatedParamId(page)
  validatedParamId(limit)

  const offset = (page - 1) * limit

  const likes = await prisma.$queryRaw`
    SELECT 
      pl.*,
      pp.name as pet_name,
      pp.gender,
      ps.name as species_name,
      m.nickname as owner_nickname,
      TIMESTAMPDIFF(YEAR, pp.birthday, CURDATE()) as age
    FROM pet_likes pl
    LEFT JOIN pet_profiles pp ON pl.to_pet_profile_id = pp.id
    LEFT JOIN pet_species ps ON pp.species = ps.id
    LEFT JOIN members m ON pp.member_id = m.id
    WHERE pl.from_member_id = ${memberId}
    ORDER BY pl.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `

  // 為每個愛心取得寵物主照片
  for (const like of likes) {
    const mainPhoto = await prisma.pet_profile_photos.findFirst({
      where: { pet_profile_id: like.to_pet_profile_id },
      select: { photo_url: true },
      orderBy: { photo_order: 'asc' }
    })
    like.main_photo = mainPhoto?.photo_url || null
  }

  const countResult = await prisma.$queryRaw`
    SELECT COUNT(*) as total
    FROM pet_likes
    WHERE from_member_id = ${memberId}
  `

  const total = Number(countResult[0].total)

  return {
    likes,
    pagination: {
      current_page: page,
      per_page: limit,
      total,
      total_pages: Math.ceil(total / limit)
    }
  }
}

/**
 * 取得收到的愛心列表
 * @param {number} memberId - 會員ID
 * @param {number} page - 頁碼
 * @param {number} limit - 每頁筆數
 * @returns {Object} 愛心列表和分頁資訊
 */
export const getReceivedLikes = async (memberId, page = 1, limit = 20) => {
  // 驗證參數
  validatedParamId(memberId)
  validatedParamId(page)
  validatedParamId(limit)

  const offset = (page - 1) * limit

  const likes = await prisma.$queryRaw`
    SELECT 
      pl.*,
      pp_from.name as from_pet_name,
      pp_from.gender as from_pet_gender,
      ps_from.name as from_species_name,
      m_from.nickname as from_owner_nickname,
      TIMESTAMPDIFF(YEAR, pp_from.birthday, CURDATE()) as from_pet_age,
      pp_to.name as to_pet_name
    FROM pet_likes pl
    LEFT JOIN pet_profiles pp_to ON pl.to_pet_profile_id = pp_to.id
    LEFT JOIN pet_profiles pp_from ON pl.from_member_id = pp_from.member_id
    LEFT JOIN pet_species ps_from ON pp_from.species = ps_from.id
    LEFT JOIN members m_from ON pl.from_member_id = m_from.id
    WHERE pp_to.member_id = ${memberId}
    ORDER BY pl.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `

  // 為每個愛心取得寵物主照片
  for (const like of likes) {
    const fromPetPhoto = await prisma.pet_profile_photos.findFirst({
      where: { pet_profile_id: like.from_pet_id },
      select: { photo_url: true },
      orderBy: { photo_order: 'asc' }
    })
    like.from_pet_photo = fromPetPhoto?.photo_url || null
  }

  const countResult = await prisma.$queryRaw`
    SELECT COUNT(*) as total
    FROM pet_likes pl
    LEFT JOIN pet_profiles pp ON pl.to_pet_profile_id = pp.id
    WHERE pp.member_id = ${memberId}
  `

  const total = Number(countResult[0].total)

  return {
    likes,
    pagination: {
      current_page: page,
      per_page: limit,
      total,
      total_pages: Math.ceil(total / limit)
    }
  }
}

/**
 * 檢查會員是否有權限存取指定的配對
 * @param {number} memberId - 會員ID
 * @param {number} matchId - 配對ID
 * @returns {boolean} 是否有權限
 */
const checkMatchPermission = async (memberId, matchId) => {
  const match = await prisma.pet_matches.findFirst({
    where: {
      id: matchId,
      OR: [
        { member1_id: memberId },
        { member2_id: memberId }
      ]
    }
  })

  return !!match
}