import jsonwebtoken from 'jsonwebtoken'
import { serverConfig } from '../config/server.config.js'

const accessTokenSecret = serverConfig.jwt.secret

export default function authenticate(req, res, next) {
  const token = req.cookies.accessToken

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: '授權失敗，沒有存取令牌',
    })
  }

  jsonwebtoken.verify(token, accessTokenSecret, (err, payload) => {
    if (err) {
      return res.status(403).json({
        status: 'error',
        message: '不合法的存取令牌',
      })
    }

    // 將 members 專用的資料解出來，例如 id、email、nickname
    const { id, email, nickname } = payload

    req.user = {
      id,
      email,
      nickname,
    }

    next()
  })
}
