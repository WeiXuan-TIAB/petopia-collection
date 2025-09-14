import express from 'express'
const router = express.Router()
import { ZodError } from 'zod'
import prisma from '../lib/prisma.js'

import {
  discoverPets,
  likePet,
  getMatches,
  getChatMessages,
  sendMessage,
  markMessagesAsRead,
  getSentLikes,
  getReceivedLikes,
} from '../services/friend.js'

import { successResponse, errorResponse, isDev } from '../lib/utils.js'
import authenticate from '../middlewares/authenticate.js'
import multer from 'multer'

const upload = multer()

// #region GET
// 探索附近的寵物
// 網址: /api/friend/discover
router.get('/discover', authenticate, async (req, res) => {
  const memberId = req.user.id
  
  try {
    const filters = {
      species: req.query.species ? parseInt(req.query.species) : null,
      ageMin: req.query.age_min ? parseInt(req.query.age_min) : null,
      ageMax: req.query.age_max ? parseInt(req.query.age_max) : null,
      gender: req.query.gender,
      isNeutered: req.query.is_neutered !== undefined ? req.query.is_neutered === 'true' : null,
      limit: req.query.limit ? parseInt(req.query.limit) : 20
    }
    
    const pets = await discoverPets(memberId, filters)
    successResponse(res, { pets })
  } catch (error) {
    errorResponse(res, error)
  }
})

// 取得我的配對列表
// 網址: /api/friend/matches
router.get('/matches', authenticate, async (req, res) => {
  const memberId = req.user.id
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  
  try {
    const matches = await getMatches(memberId, page, limit)
    successResponse(res, matches)
  } catch (error) {
    errorResponse(res, error)
  }
})

// 取得聊天訊息
// 網址: /api/friend/matches/:matchId/messages
router.get('/matches/:matchId/messages', authenticate, async (req, res) => {
  const memberId = req.user.id
  const matchId = parseInt(req.params.matchId)
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 50
  
  try {
    const messages = await getChatMessages(memberId, matchId, page, limit)
    successResponse(res, messages)
  } catch (error) {
    if (error.message && error.message.includes('permission')) {
      return res.status(403).json({
        status: 'error',
        message: '無權限存取此聊天室'
      })
    }
    errorResponse(res, error)
  }
})

// 取得我送出的愛心列表
// 網址: /api/friend/likes/sent
router.get('/likes/sent', authenticate, async (req, res) => {
  const memberId = req.user.id
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  
  try {
    const likes = await getSentLikes(memberId, page, limit)
    successResponse(res, likes)
  } catch (error) {
    errorResponse(res, error)
  }
})

// 取得我收到的愛心列表
// 網址: /api/friend/likes/received
router.get('/likes/received', authenticate, async (req, res) => {
  const memberId = req.user.id
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  
  try {
    const likes = await getReceivedLikes(memberId, page, limit)
    successResponse(res, likes)
  } catch (error) {
    errorResponse(res, error)
  }
})
// #endregion

// #region POST
// 對寵物按愛心
// 網址: /api/friend/like
router.post('/like', upload.none(), authenticate, async (req, res) => {
  const memberId = req.user.id
  const { pet_profile_id } = req.body
  
  if (!pet_profile_id) {
    return res.status(400).json({ 
      status: 'error', 
      message: '請提供寵物檔案ID' 
    })
  }
  
  try {
    const result = await likePet(memberId, pet_profile_id)
    
    if (result.isMatch) {
      successResponse(res, { 
        message: '配對成功！',
        is_match: true,
        match_id: result.matchId
      }, 201)
    } else {
      successResponse(res, { 
        message: '愛心成功',
        is_match: false
      }, 201)
    }
  } catch (error) {
    if (error.message && error.message.includes('duplicate')) {
      return res.status(400).json({
        status: 'error',
        message: '已經按過愛心'
      })
    }
    if (error.message && error.message.includes('own pet')) {
      return res.status(400).json({
        status: 'error',
        message: '無法對自己的寵物按愛心'
      })
    }
    if (error.message && error.message.includes('not found')) {
      return res.status(404).json({
        status: 'error',
        message: '寵物檔案不存在'
      })
    }
    errorResponse(res, error)
  }
})

// 發送聊天訊息
// 網址: /api/friend/matches/:matchId/messages
router.post('/matches/:matchId/messages', upload.none(), authenticate, async (req, res) => {
  const memberId = req.user.id
  const matchId = parseInt(req.params.matchId)
  const { message_text, message_type = 'text', image_url } = req.body
  
  if (!message_text) {
    return res.status(400).json({ 
      status: 'error', 
      message: '請提供訊息內容' 
    })
  }
  
  try {
    const message = await sendMessage({
      matchId,
      senderId: memberId,
      messageText: message_text,
      messageType: message_type,
      imageUrl: image_url
    })
    
    successResponse(res, { message }, 201)
  } catch (error) {
    if (error.message && error.message.includes('permission')) {
      return res.status(403).json({
        status: 'error',
        message: '無權限存取此聊天室'
      })
    }
    errorResponse(res, error)
  }
})
// #endregion

// #region PUT
// 標記訊息為已讀
// 網址: /api/friend/matches/:matchId/read
router.put('/matches/:matchId/read', upload.none(), authenticate, async (req, res) => {
  const memberId = req.user.id
  const matchId = parseInt(req.params.matchId)
  const { last_message_id } = req.body
  
  if (!last_message_id) {
    return res.status(400).json({ 
      status: 'error', 
      message: '請提供最後已讀訊息ID' 
    })
  }
  
  try {
    await markMessagesAsRead(memberId, matchId, last_message_id)
    successResponse(res, { message: '標記已讀成功' })
  } catch (error) {
    if (error.message && error.message.includes('permission')) {
      return res.status(403).json({
        status: 'error',
        message: '無權限存取此聊天室'
      })
    }
    errorResponse(res, error)
  }
})
// #endregion

export default router