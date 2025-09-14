import prisma from '../lib/prisma.js'
import Joi from 'joi'

// Forum 資料驗證 Schema
export const forumSchema = Joi.object({
  member_id: Joi.number().integer().positive().required(),
  type: Joi.string().valid('blog', 'vlog').required(),
  title: Joi.string().max(200).trim().required(),
  content: Joi.string().min(2).trim().required(), // 移除 max(100)，因為內容應該可以更長
  status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
  image_url: Joi.string().allow(null, ''),
  hashtags: Joi.array().items(Joi.string()).default([]),
  // 移除以下欄位，因為這些是資料庫自動處理的
  // id, created_at, updated_at, deleted_at, members, @@index
}).options({
  stripUnknown: true,
  abortEarly: false
}).messages({
  'string.empty': '{#label}不能為空',
  'string.min': '{#label}至少需要{#limit}個字符',
  'string.max': '{#label}不能超過{#limit}個字符',
  'any.required': '{#label}為必填項目',
  'number.positive': '{#label}必須大於0',
  'any.only': '{#label}必須是有效的選項'
})

// 取得所有論壇文章
export const getForums = async (options = {}) => {
  const { 
    page = 1, 
    limit = 10, 
    type, 
    status = 'published',
    memberId,
    includeAllStatus = false 
  } = options

  const skip = (page - 1) * limit
  const take = parseInt(limit)

  // 建立查詢條件
  const where = {
    deleted_at: null, // 排除已刪除的文章
  }

  if (!includeAllStatus) {
    where.status = status
  }

  if (type) {
    where.type = type
  }

  if (memberId) {
    where.member_id = memberId
  }

  try {
    console.log('🔍 查詢條件:', where)
    
    const [forums, total] = await Promise.all([
      prisma.forum_contents.findMany({
        where,
        include: {
          members: {
            select: {
              id: true,
              name: true,
              avatar: true,
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        },
        skip,
        take,
      }),
      prisma.forum_contents.count({ where })
    ])

    return {
      data: forums,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / take),
        total_items: total,
        items_per_page: take,
      }
    }
  } catch (error) {
    console.error('Error in getForums:', error)
    throw error
  }
}

// 取得單筆論壇文章
export const getForumById = async (id) => {
  try {
    const forum = await prisma.forum_contents.findFirst({
      where: { 
        id,
        deleted_at: null 
      },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      }
    })

    if (!forum) {
      throw new Error('找不到此文章')
    }

    return forum
  } catch (error) {
    console.error('Error in getForumById:', error)
    throw error
  }
}

// 建立新的論壇文章
export const createForum = async (forumData) => {
  try {
    // 驗證資料格式
    const { error, value } = forumSchema.validate(forumData)
    if (error) {
      throw error
    }

    // 處理 hashtags 如果它是字串
    if (typeof value.hashtags === 'string') {
      value.hashtags = value.hashtags.split(',').map(tag => tag.trim()).filter(tag => tag)
    }

    const forum = await prisma.forum_contents.create({
      data: {
        ...value,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      }
    })

    return forum
  } catch (error) {
    console.error('Error in createForum:', error)
    throw error
  }
}

// 更新論壇文章
export const updateForumById = async (id, updateData) => {
  try {
    // 移除不能更新的欄位
    const { member_id, created_at, ...allowedUpdateData } = updateData

    // 處理 hashtags 如果它是字串
    if (typeof allowedUpdateData.hashtags === 'string') {
      allowedUpdateData.hashtags = allowedUpdateData.hashtags.split(',').map(tag => tag.trim()).filter(tag => tag)
    }

    const forum = await prisma.forum_contents.update({
      where: { id },
      data: {
        ...allowedUpdateData,
        updated_at: new Date(),
      },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      }
    })

    return forum
  } catch (error) {
    console.error('Error in updateForumById:', error)
    if (error.code === 'P2025') {
      throw new Error('找不到此文章')
    }
    throw error
  }
}

// 刪除論壇文章 (軟刪除)
export const deleteForumById = async (id) => {
  try {
    const forum = await prisma.forum_contents.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        status: 'archived',
        updated_at: new Date(),
      }
    })

    return forum
  } catch (error) {
    console.error('Error in deleteForumById:', error)
    if (error.code === 'P2025') {
      throw new Error('找不到此文章')
    }
    throw error
  }
}