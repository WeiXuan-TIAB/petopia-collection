import express from 'express'
const router = express.Router()
import { ZodError } from 'zod'
// import prisma from '../lib/prisma.js'

import {
  getForums,
  getForumById,
  createForum,
  updateForumById,
  deleteForumById,
  forumSchema,
  getFirstLevelCommentsByForumId,//修改double留言
  getFirstLevelComments,     //新增2層留言
  getRepliesByCommentIds,    //新增2層留言
  createReply,               //新增2層留言
  deleteComment,              //刪留言
  updateComment,              //更新留言
  getInteractionStats,        //interaction
  getUserInteraction,         //interaction
  toggleInteraction,          //interaction
} from '../services/forum.js'

import { successResponse, errorResponse, isDev } from '../lib/utils.js'
import authenticate from '../middlewares/authenticate.js'
import path from 'path'
import multer from 'multer'

import { getCommentsByForumId } from '../services/forum.js'
import { createComment } from '../services/forum.js'

// multer 設定 - 用於上傳圖片
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/forum/')
  },
  filename: function (req, file, callback) {
    const timestamp = Date.now()
    const userId = req.user?.id || 'guest'
    callback(null, `${userId}_${timestamp}${path.extname(file.originalname)}`)
  },
})
const upload = multer({ storage: storage })

// #region GET
// 取得所有論壇文章 (可加入分頁、篩選)
// 網址: /api/forum
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status = 'published' } = req.query
    const forums = await getForums({ page, limit, type, status })
    successResponse(res, { forums })
  } catch (error) {
    errorResponse(res, error)
  }
})

// 取得單筆論壇文章
// 網址: /api/forum/:forumId
router.get('/:forumId', async (req, res) => {
  const forumId = Number(req.params.forumId)
  try {
    const forum = await getForumById(forumId)
    successResponse(res, { forum })
  } catch (error) {
    errorResponse(res, error)
  }
})

// 取得目前使用者的所有文章
// 網址: /api/forum/me/posts
router.get('/me/posts', authenticate, async (req, res) => {
  const memberId = req.user.id
  try {
    const forums = await getForums({ memberId, includeAllStatus: true })
    successResponse(res, { forums })
  } catch (error) {
    errorResponse(res, error)
  }
})
// #endregion

// #region POST
// 建立新的論壇文章
// 網址: /api/forum
router.post('/', authenticate, upload.single('image'), async (req, res) => {

  //check hashtags api
  console.log('📩 後端收到的 req.body.hashtags:', req.body.hashtags);
  try {
    const forumData = {
      ...req.body,
      member_id: req.user.id,
      image_url: req.file ? `/forum/${req.file.filename}` : null
    }
    
    const forum = await createForum(forumData)
    successResponse(res, { forum }, 201)
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: 'error',
        message: '資料格式不正確',
        issues: error.issues,
      })
    }

    if (error.message) {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    }

    errorResponse(res, error)
  }
})
// #endregion

// #region PUT
// 更新論壇文章 (只有作者本人可以更新)
// 網址: /api/forum/:forumId
router.put('/:forumId', authenticate, upload.single('image'), async (req, res) => {
  const forumId = Number(req.params.forumId)
  const memberId = req.user.id

  try {
    //check hashtags api
  console.log('📩 後端收到的 req.body.hashtags:', req.body.hashtags);
    // 檢查文章是否存在且屬於當前使用者
    const existingForum = await getForumById(forumId)
    if (existingForum.member_id !== memberId) {
      return res.status(403).json({ 
        status: 'error', 
        message: '無權限修改此文章' 
      })
    }

    const updateData = {
      ...req.body,
      updated_at: new Date()
    }

    // 👈 完全重新處理 hashtags，不使用 ...req.body
    if (req.body.hashtags) {
      if (typeof req.body.hashtags === 'string') {
        try {
          const parsed = JSON.parse(req.body.hashtags)
          // 確保是純淨的陣列
          updateData.hashtags = Array.isArray(parsed) ? parsed : []
          console.log('📩 解析並設定 hashtags:', updateData.hashtags)
        } catch (error) {
          console.error('解析 hashtags 失敗:', error)
          updateData.hashtags = []
        }
      } else if (Array.isArray(req.body.hashtags)) {
        updateData.hashtags = req.body.hashtags
      } else {
        updateData.hashtags = []
      }
    } else {
      updateData.hashtags = []
    }

    console.log('📩 最終 updateData:', updateData)

    // 如果有上傳新圖片
    if (req.file) {
      updateData.image_url = `/forum/${req.file.filename}`
    }

    await updateForumById(forumId, updateData)
    successResponse(res, { message: '文章更新成功' })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: 'error',
        message: '資料格式不正確',
        issues: error.issues,
      })
    }

    errorResponse(res, error)
  }
})

// 更新文章狀態 (發布/草稿/封存)
// 網址: /api/forum/:forumId/status
router.put('/:forumId/status', authenticate, upload.none(), async (req, res) => {
  const forumId = Number(req.params.forumId)
  const memberId = req.user.id
  const { status } = req.body

  try {
    // 檢查權限
    const existingForum = await getForumById(forumId)
    if (existingForum.member_id !== memberId) {
      return res.status(403).json({ 
        status: 'error', 
        message: '無權限修改此文章' 
      })
    }

    await updateForumById(forumId, { 
      status, 
      updated_at: new Date() 
    })
    
    successResponse(res, { message: '狀態更新成功' })
  } catch (error) {
    errorResponse(res, error)
  }
})
// #endregion

// #region DELETE
// 刪除論壇文章 (軟刪除)
// 網址: /api/forum/:forumId
router.delete('/:forumId', authenticate, async (req, res) => {
  const forumId = Number(req.params.forumId)
  const memberId = req.user.id

  try {
    // 檢查權限
    const existingForum = await getForumById(forumId)
    if (existingForum.member_id !== memberId) {
      return res.status(403).json({ 
        status: 'error', 
        message: '無權限刪除此文章' 
      })
    }

    await deleteForumById(forumId)
    successResponse(res, { message: '文章刪除成功' })
  } catch (error) {
    errorResponse(res, error)
  }
})
// #endregion

// COMMENTS
// 取得文章的所有留言
// 網址: /api/forum/:forumId/comments
router.get('/:forumId/comments', async (req, res) => {
  const forumId = Number(req.params.forumId)
  try {
    const comments = await getFirstLevelCommentsByForumId(forumId)  // 👈 使用新函數
    successResponse(res, { comments })
  } catch (error) {
    errorResponse(res, error)
  }
})

// 新增文章留言
// 網址: /api/forum/:forumId/comments
router.post('/:forumId/comments', authenticate, async (req, res) => {
  const forumId = Number(req.params.forumId)
  const memberId = req.user.id
  
  try {
    const commentData = {
      content: req.body.content,
      target_type: 'blog',
      target_id: forumId,
      content_id: forumId,
      member_id: memberId
    }
    
    const comment = await createComment(commentData)
    successResponse(res, { comment }, 201)
  } catch (error) {
    errorResponse(res, error)
  }
})

// 取得回覆
// 網址: POST /api/forum/comments/replies
router.post('/comments/replies', async (req, res) => {
  try {
    const { commentIds } = req.body
    console.log('📝 取得回覆，留言IDs:', commentIds)
    
    if (!commentIds || !Array.isArray(commentIds)) {
      return res.status(400).json({ 
        success: false, 
        message: '無效的留言ID陣列' 
      })
    }
    
    const replies = await getRepliesByCommentIds(commentIds)
    successResponse(res, { replies })
  } catch (error) {
    errorResponse(res, error)
  }
})

// 新增回覆
// 網址: POST /api/forum/comments/:commentId/reply
router.post('/comments/:commentId/reply', authenticate, async (req, res) => {
  const commentId = Number(req.params.commentId)
  const memberId = req.user.id
  
  try {
    // 檢查層級
    const parentComment = await prisma.forum_comments.findUnique({
      where: { id: commentId },
      select: { 
        target_type: true,
        content_id: true  // 👈 取得父留言的 content_id
      }
    })
    
    if (parentComment?.target_type === 'comment') {
      return res.status(400).json({ 
        success: false, 
        message: '留言最多只能回覆到第二層' 
      })
    }
    
    // 👈 關鍵修改：使用父留言的 content_id
    const createdReply = await prisma.forum_comments.create({
      data: {
        content: req.body.content,
        target_type: 'comment',
        target_id: commentId,
        member_id: memberId,
        content_id: parentComment.content_id  // 👈 使用父留言的 content_id
      }
    })
    
    // 查詢完整資料
    const reply = await prisma.forum_comments.findUnique({
      where: { id: createdReply.id },
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
    
    successResponse(res, { reply }, 201)
  } catch (error) {
    console.error('回覆錯誤:', error)
    errorResponse(res, error)
  }
})
// #endregion:COMMENTS

// INTERACTIONS
// 取得互動統計
// 網址: GET /api/forum/:targetType/:targetId/stats
router.get('/:targetType/:targetId/stats', async (req, res) => {
  const { targetType, targetId } = req.params
  
  try {
    const stats = await getInteractionStats(parseInt(targetId), targetType)
    successResponse(res, { stats })
  } catch (error) {
    errorResponse(res, error)
  }
})

// 取得用戶互動狀態
// 網址: GET /api/forum/:targetType/:targetId/user-interaction
router.get('/:targetType/:targetId/user-interaction', authenticate, async (req, res) => {
  const { targetType, targetId } = req.params
  const memberId = req.user.id
  
  try {
    const interaction = await getUserInteraction(memberId, parseInt(targetId), targetType)
    successResponse(res, { interaction })
  } catch (error) {
    errorResponse(res, error)
  }
})

// 切換互動（按讚/倒讚）
// 網址: POST /api/forum/:targetType/:targetId/interact
router.post('/:targetType/:targetId/interact', authenticate, async (req, res) => {
  const { targetType, targetId } = req.params
  const { interactionType } = req.body // 'like' 或 'dislike'
  const memberId = req.user.id
  
  try {
    if (!['like', 'dislike'].includes(interactionType)) {
      return res.status(400).json({
        success: false,
        message: '無效的互動類型'
      })
    }
    
    const result = await toggleInteraction(memberId, parseInt(targetId), targetType, interactionType)
    
    // 回傳更新後的統計
    const stats = await getInteractionStats(parseInt(targetId), targetType)
    const userInteraction = await getUserInteraction(memberId, parseInt(targetId), targetType)
    
    successResponse(res, { 
      result, 
      stats, 
      userInteraction 
    })
  } catch (error) {
    errorResponse(res, error)
  }
})

// 刪除留言
// 網址: DELETE /api/forum/comments/:id
router.delete('/comments/:id',authenticate,async(req,res)=>{
  try{
    const {id} =req.params
    const memberId = req.user?.id
    //1.驗證留言ID
    const commentId = parseInt(id)
    if(isNaN(commentId)||commentId<=0){
      return res.status(400).json({
        success:false,
        message:'無效留言的ID'
      })
    }
    //2.呼叫service刪留言
    const result = await deleteComment(commentId,memberId)
    //3.回傳結果
    successResponse(res,{
      message:result.message,
      deleteComment:result.deletedComment
    })
  }catch(error){
    console.error('❌ DELETE /comments/:id 錯誤:', error)
     // 根據錯誤類型回傳適當的狀態碼和訊息
    if (error.message === '找不到此留言或留言已被刪除' || 
        error.message === '找不到此留言') {
      return res.status(404).json({
        success: false,
        message: error.message
      })
    }
    
    if (error.message === '您只能刪除自己的留言') {
      return res.status(403).json({
        success: false,
        message: error.message
      })
    }
    
    // 使用你現有的 errorResponse 函數處理其他錯誤
    errorResponse(res, error)
  }
})
// #END-INTERACTIONS

// 編輯留言
// 網址: PUT /api/forum/comments/:id
router.put('/comments/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const memberId = req.user?.id;
    
    const commentId = parseInt(id);
    if (isNaN(commentId) || commentId <= 0) {
      return res.status(400).json({
        success: false,
        message: '無效的留言ID'
      });
    }

    // 呼叫 service 編輯留言
    const result = await updateComment(commentId, memberId, content);
    
    successResponse(res, {
      message: '留言編輯成功',
      comment: result.updatedComment
    });

  } catch (error) {
    console.error('❌ PUT /comments/:id 錯誤:', error);
    
    if (error.message === '找不到此留言' || 
        error.message === '您只能編輯自己的留言') {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }
    
    errorResponse(res, error);
  }
});
//END-編輯留言

//上傳img_url
router.post('/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '沒有檔案' });
    }
    
    // 🔥 回傳完整的後端 URL
    const imageUrl = `http://localhost:3005/forum/${req.file.filename}`;
    console.log('🖼️ 回傳圖片路徑:', imageUrl);
    
    res.json({ location: imageUrl });
    
  } catch (error) {
    console.error('圖片上傳錯誤:', error);
    res.status(500).json({ error: '上傳失敗' });
  }
});
//END-img_url

export default router