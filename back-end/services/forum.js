import prisma from '../lib/prisma.js'
import Joi from 'joi'

// Forum 資料驗證 Schema
export const forumSchema = Joi.object({
  member_id: Joi.number().integer().positive().required(),
  type: Joi.string().valid('text', 'blog', 'vlog').required(),
  title: Joi.string().max(200).trim().required(),
  content: Joi.string().min(2).trim().required(), // 移除 max(100)，因為內容應該可以更長
  status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
  image_url: Joi.string().allow(null, ''),
  hashtags: Joi.array().items(Joi.string()).default([]),
  // 移除以下欄位，因為這些是資料庫自動處理的
  // id, created_at, updated_at, deleted_at, members, @@index
  //字定義分類(不外連了)   
  pet_category: Joi.string().valid('貓貓', '狗狗', '特寵').allow(null, '')
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

    // 👈 在這裡加入 hashtags 清理邏輯
    const cleanedForums = forums.map(forum => {
      if (forum.hashtags && Array.isArray(forum.hashtags)) {
        forum.hashtags = forum.hashtags.filter(tag => {
          return typeof tag === 'string' && 
                 !tag.includes('"') && 
                 !tag.includes('[') && 
                 !tag.includes(']') &&
                 tag.trim().length > 0
        })
      } else {
        forum.hashtags = []
      }
      return forum
    })

    return {
      data: cleanedForums,
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

        if (!forum) {
      throw new Error('找不到此文章')
    }

     // 👈 加入更詳細的 log
     console.log('🔍 資料庫原始 hashtags:', forum.hashtags)
     console.log('🔍 hashtags 類型:', typeof forum.hashtags)

// 👈 hashtags 處理邏輯應該放在這裡
if (forum.hashtags) {
  if (Array.isArray(forum.hashtags)) {
    console.log('✅ hashtags 已經是陣列:', forum.hashtags)
  } else if (typeof forum.hashtags === 'string') {
    try {
      forum.hashtags = JSON.parse(forum.hashtags)
      console.log('✅ 解析字串 hashtags 成功:', forum.hashtags)
    } catch (error) {
      console.error('❌ 解析 hashtags 失敗，保持原樣:', error)
      forum.hashtags = []
    }
  } else {
    console.log('⚠️ hashtags 格式未知，設定為空陣列')
    forum.hashtags = []
  }
} else {
  console.log('⚠️ hashtags 為空，設定為 []')
  forum.hashtags = []
}

console.log('🎯 最終回傳的 forum.hashtags:', forum.hashtags)
return forum
} catch (error) {
console.error('Error in getForumById:', error)
throw error
}
}

// 建立新的論壇文章
export const createForum = async (forumData) => {
  try {
    console.log('🔍 收到的原始資料:', forumData)
    
    // 處理 hashtags - 如果是字串就解析成陣列
   // 修正 hashtags 處理
if (forumData.hashtags) {
    if (typeof forumData.hashtags === 'string') {
      try {
        // 如果是字串，嘗試解析
        forumData.hashtags = JSON.parse(forumData.hashtags)
      } catch (e) {
        console.log('📝 hashtags 解析失敗，設為空陣列')
        forumData.hashtags = []
      }
    }
    
    // 確保是陣列且不是巢狀結構
    if (!Array.isArray(forumData.hashtags)) {
      forumData.hashtags = []
    }
  } else {
    forumData.hashtags = []
  }
    
    console.log('🔍 處理後的 hashtags:', forumData.hashtags)
    
    // 驗證資料格式
    const { error, value } = forumSchema.validate(forumData)
    if (error) {
      console.error('❌ Joi 驗證錯誤:', error.details)
      throw error
    }

    console.log('✅ 驗證通過的資料:', value)

    const forum = await prisma.forum_contents.create({
      data: {
        ...value,
        hashtags: value.hashtags, //  直接使用陣列，不要 JSON.stringify
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
    console.log('🔄 Service 收到的資料:', updateData)
    
    const { member_id, created_at, ...allowedUpdateData } = updateData
    
    // 👈 新的簡化邏輯
    if (allowedUpdateData.hashtags && Array.isArray(allowedUpdateData.hashtags)) {
      allowedUpdateData.hashtags = JSON.stringify(allowedUpdateData.hashtags)
      console.log('🔄 最終儲存的 hashtags:', allowedUpdateData.hashtags)
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

// COMMENTS
// 新增：只取第一層留言的函數（不要修改原有的 getCommentsByForumId）
export const getFirstLevelCommentsByForumId = async (forumId) => {
  try {
    const comments = await prisma.forum_comments.findMany({
      where: {
        content_id: forumId,
        target_type: 'blog',  // 只取對文章的留言
        deleted_at: null
      },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: {
        created_at: 'asc'
      }
    })
    
    return comments
  } catch (error) {
    console.error('Error in getFirstLevelCommentsByForumId:', error)
    throw error
  }
}

// 1. 取得文章的所有留言（包含回覆）
export const getCommentsByForumId = async (forumId) => {
  try {
    const comments = await prisma.forum_comments.findMany({
      where: {
        content_id: forumId,
        deleted_at: null
      },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: {
        created_at: 'asc'
      }
    })
    
    return comments
  } catch (error) {
    console.error('Error in getCommentsByForumId:', error)
    throw error
  }
}



// 2. 新增留言
export const createComment = async (commentData) => {
    try {
    const comment = await prisma.forum_comments.create({
      data: commentData,  // 👈 直接使用傳入的資料
      include: {
        members: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })
    
    return comment
  } catch (error) {
    console.error('Error in createComment:', error)
    throw error
  }
}

// 3. 取得第一層留言（對文章的留言）
export const getFirstLevelComments = async (forumId) => {
  try {
    const comments = await prisma.forum_comments.findMany({
      where: {
        content_id: forumId,
        target_type: 'blog',  // 只取對文章的留言
        deleted_at: null
      },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: {
        created_at: 'asc'
      }
    })
    
    return comments
  } catch (error) {
    console.error('Error in getFirstLevelComments:', error)
    throw error
  }
}

// 4. 取得回覆（根據留言ID陣列）
export const getRepliesByCommentIds = async (commentIds) => {
  try {
    if (!commentIds || commentIds.length === 0) return []
    
    const replies = await prisma.forum_comments.findMany({
      where: {
        target_id: {
          in: commentIds
        },
        target_type: 'comment',  // 只取對留言的回覆
        deleted_at: null
      },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: {
        created_at: 'asc'
      }
    })
    
    return replies
  } catch (error) {
    console.error('Error in getRepliesByCommentIds:', error)
    throw error
  }
}

// 5. 新增回覆（有層級檢查）
// 替換整個 createReply 函數
export const createReply = async (commentData) => {
  try {
    const { target_id, target_type, content, member_id } = commentData
    
    // 如果是回覆留言，檢查不能超過二層
    if (target_type === 'comment') {
      const parentComment = await prisma.forum_comments.findUnique({
        where: { id: target_id },
        select: { 
          target_type: true,
          content_id: true  // 👈 取得父留言的 content_id
        }
      })
      
      if (parentComment?.target_type === 'comment') {
        throw new Error('留言最多只能回覆到第二層')
      }
      
      // 👈 關鍵修改：創建回覆時使用父留言的 content_id
      const reply = await prisma.forum_comments.create({
        data: {
          target_id,
          target_type,
          content,
          member_id,
          content_id: parentComment.content_id  // 👈 使用父留言的 content_id
        },
        include: {
          members: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      })
      
      return reply
    }
    
    // 如果不是回覆（理論上不會到這裡）
    throw new Error('Invalid reply target')
  } catch (error) {
    console.error('Error in createReply:', error)
    throw error
  }
}

// #endregion:COMMENTS

// #region:INTERACTIONS

// 1. 取得互動統計（按讚/倒讚數量）
export const getInteractionStats = async (targetId, targetType) => {
  try {
    const stats = await prisma.forum_interactions.groupBy({
      by: ['interaction_type'],
      where: {
        target_id: targetId,
        target_type: targetType,
        deleted_at: null
      },
      _count: {
        interaction_type: true
      }
    })
    
    const result = {
      like: 0,
      dislike: 0
    }
    
    stats.forEach(stat => {
      result[stat.interaction_type] = stat._count.interaction_type
    })
    
    return result
  } catch (error) {
    console.error('Error in getInteractionStats:', error)
    throw error
  }
}

// 2. 取得用戶對特定目標的互動狀態
export const getUserInteraction = async (memberId, targetId, targetType) => {
  try {
    const interaction = await prisma.forum_interactions.findFirst({
      where: {
        member_id: memberId,
        target_id: targetId,
        target_type: targetType,
        deleted_at: null
      }
    })
    
    return interaction
  } catch (error) {
    console.error('Error in getUserInteraction:', error)
    throw error
  }
}

// 3. 新增或更新互動
export const toggleInteraction = async (memberId, targetId, targetType, interactionType) => {
  try {
    // 檢查是否已存在相同的互動
    const existingInteraction = await prisma.forum_interactions.findFirst({
      where: {
        member_id: memberId,
        target_id: targetId,
        target_type: targetType,
        interaction_type: interactionType,
        deleted_at: null
      }
    })
    
    if (existingInteraction) {
      // 如果已存在，就軟刪除（取消）
      const updated = await prisma.forum_interactions.update({
        where: { id: existingInteraction.id },
        data: { 
          deleted_at: new Date(),
        
        }
      })
      console.log('🔍 軟刪除結果:', updated); // 👈 debug
      return { action: 'removed', interactionType }
    } else {
      // 檢查是否有相反的互動（like <-> dislike）
      const oppositeType = interactionType === 'like' ? 'dislike' : 'like'
      const oppositeInteraction = await prisma.forum_interactions.findFirst({
        where: {
          member_id: memberId,
          target_id: targetId,
          target_type: targetType,
          interaction_type: oppositeType,
          deleted_at: null  
        }
      })
      
      if (oppositeInteraction) {
        // 軟刪除相反的互動
        await prisma.forum_interactions.update({
          where: { id: oppositeInteraction.id },
          data: { 
            deleted_at: new Date(),
          }
        })
        console.log('🔍 刪除相反互動:', oppositeInteraction.id); // 👈 debug
      }
      
      // 新增新的互動
      const newInteraction = await prisma.forum_interactions.create({
        data: {
          member_id: memberId,
          target_id: targetId,
          target_type: targetType,
          interaction_type: interactionType,
        }
      })
      console.log('🔍 新增互動:', newInteraction); // 👈 debug
      
      return { action: 'added', interactionType }
    }
  } catch (error) {
    console.error('Error in toggleInteraction:', error)
    throw error
  }
}


//留言刪除(垃圾桶)
export const deleteComment = async (commentId, memberId)=>{
  try{
    //1.查詢留言與權限
    const comment =  await prisma.forum_comments.findFirst({
      where:{
        id:commentId,
        deleted_at:null// 確保留言尚未被刪除
      },
      select:{
        id:true,
        member_id:true,
        content:true,
        target_type:true,
      }
    })
    //2.檢查留言存在與否
    if(!comment){
      throw new Error('找不到該留言或已刪除')
    }
    //3.檢查權限
    if(comment.member_id != memberId){
      throw new Error('您並無此權限')
    }
    //4.軟刪除
    const deletedComment = await prisma.forum_comments.update({
      where:{id:commentId},
      data:{
        deleted_at:new Date(),
        updated_at:new Date()
      }
    })
    console.log(`✅ 留言已刪除: ID ${commentId}, 刪除者: ${memberId}`);
    
    return {
      success: true,
      message: '留言已成功刪除',
      deletedComment: {
        id: deletedComment.id,
        deleted_at: deletedComment.deleted_at
      }
    }

  } catch (error) {
    console.error('❌ Error in deleteComment:', error)
    
    // 根據錯誤類型返回適當的錯誤訊息
    if (error.code === 'P2025') {
      throw new Error('找不到此留言')
    }
    
    throw error
  }
}
// END-INTERACTIONS

// 編輯留言
export const updateComment = async (commentId, memberId, newContent) => {
  try {
    // 檢查權限
    const comment = await prisma.forum_comments.findFirst({
      where: { id: commentId, deleted_at: null }
    });

    if (!comment) {
      throw new Error('找不到此留言');
    }

    if (comment.member_id !== memberId) {
      throw new Error('您只能編輯自己的留言');
    }

    // 更新留言
    const updatedComment = await prisma.forum_comments.update({
      where: { id: commentId },
      data: {
        content: newContent,
        updated_at: new Date()
      },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    return { updatedComment };
  } catch (error) {
    console.error('編輯留言失敗:', error);
    throw error;
  }
};
//END-編輯留言