// api/index.js
import { promises as fs } from 'fs'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import createError from 'http-errors'
import express from 'express'
import logger from 'morgan'
import path from 'path'
import session from 'express-session'
import RedisStore from 'connect-redis'
import { createClient } from 'redis'
import sessionFileStore from 'session-file-store'
import { serverConfig } from '../config/server.config.js'
import { pathToFileURL } from 'url'
import 'dotenv/config.js'

// 🚀 啟動日誌
console.log("🚀 Backend starting...")

// 建立 Express 應用程式
const app = express()

// ===== 基礎設定與中介層 =====
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
const whiteList = frontendUrl.split(',')

app.use(
  cors({
    origin: whiteList,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
)
app.use('/avatar', express.static(path.join(process.cwd(), 'public', 'avatar')))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(process.cwd(), 'public')))

let sessionStore = null

if (process.env.REDIS_URL) {
  console.log("ℹ️ Using Redis session store")
  const redisClient = createClient({
    url: process.env.REDIS_URL,
  })
  redisClient.connect().catch(console.error)
  sessionStore = new RedisStore({
    client: redisClient,
    prefix: 'express-vercel:',
  })
} else {
  console.log("ℹ️ Using FileStore session store")
  const FileStore = sessionFileStore(session)
  sessionStore = new FileStore({ logFn: () => { } })
}

const isDev = process.env.NODE_ENV === 'development'

// 修正 Cookie 設定
const cookieOptions = isDev
  ? { maxAge: 30 * 86400000, httpOnly: true, sameSite: 'lax', secure: false }
  : {
      domain: serverConfig.domain,
      maxAge: 30 * 86400000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
  }

if (!isDev) app.set('trust proxy', 1)

app.use(
  session({
    store: sessionStore,
    name: 'SESSION_ID',
    secret: '67f71af4602195de2450faeb6f8856c0',
    proxy: !isDev,
    cookie: cookieOptions,
    resave: false,
    saveUninitialized: false,
  })
)

// 健康檢查
app.get('/healthz', (req, res) => res.json({ ok: true }))
app.get('/', (req, res) => res.send('Express server is running.'))

// ===== 自動載入 routes =====
const apiPath = '/api'
const routePath = path.join(process.cwd(), 'routes')

try {
  console.log("🔄 Loading routes from:", routePath)
  const filenames = await fs.readdir(routePath)

  for (const filename of filenames) {
    const full = path.join(routePath, filename)
    const stats = await fs.stat(full)

    if (stats.isFile()) {
      const mod = await import(pathToFileURL(full))
      const slug = path.basename(filename, path.extname(filename))
      if (mod?.default) {
        console.log(`✅ Loaded route: ${apiPath}/${slug}`)
        app.use(`${apiPath}/${slug === 'index' ? '' : slug}`, mod.default)
      }
    }

    if (stats.isDirectory()) {
      const subFilenames = await fs.readdir(full)
      for (const subFilename of subFilenames) {
        const subFull = path.join(full, subFilename)
        const subStats = await fs.stat(subFull)
        if (subStats.isFile()) {
          const mod = await import(pathToFileURL(subFull))
          const subSlug = path.basename(subFilename, path.extname(subFilename))
          if (mod?.default) {
            console.log(
              `✅ Loaded route: ${apiPath}/${path.basename(full)}/${subSlug}`
            )
            app.use(
              `${apiPath}/${path.basename(full)}/${subSlug === 'index' ? '' : subSlug
              }`,
              mod.default
            )
          }
        }
      }
    }
  }
} catch (err) {
  console.error("❌ Error loading routes:", err)
}

// ===== 404 與錯誤處理 =====
app.use((req, res, next) => {
  next(createError(404, `Not Found: ${req.originalUrl}`))
})

app.use((err, req, res, next) => {
  console.error("❌ Error:", err)
  const status = err.status || 500
  res.status(status).json({
    status: 'error',
    message: err.message || 'Server Error',
  })
})

// ===== 啟動 =====
const port = process.env.PORT || 3005
app.listen(port, () => console.log(`✅ Server ready on port ${port}`))

export default app
