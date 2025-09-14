// 本檔案是用來設定環境變數的檔案，這裡的變數會被其他檔案引入使用
export const PORT = 3000
// 直接從環境變數取得NODE_ENV(npm run dev or npm run start)
const env = process.env.NODE_ENV
// 本機環境 OR 營運環境 (true: 本機環境, false: 營運環境)
export const isDev = env === 'development'

// // 本機環境
// const local = {
//   apiURL: 'http://localhost:3005/api',
//   serverURL: 'http://localhost:3005',
//   avatarURL: 'http://localhost:3005/avatar',
//   nextUrl: 'http://localhost:3000',
// }

// // 營運環境設定(部署至Vercel)
// const production = {
//   apiURL: 'https://petopia-backend-production.up.railway.app/api',
//   serverURL: 'https://petopia-backend-production.up.railway.app/',
//   avatarURL: 'https://petopia-backend-production.up.railway.app/avatar',
//   nextUrl: 'https://petopia-frontend-lake.vercel.app/',
// }

// config/index.js

// API 伺服器位置
export const apiURL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api'

// 靜態檔案伺服器位置（例如圖片）
export const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3005'

// 頭像/大頭貼 URL
export const avatarURL =
  process.env.NEXT_PUBLIC_AVATAR_URL || 'http://localhost:3005/avatar'

// 前端網址（通常是 Next.js 本身的網址）
export const nextUrl =
  process.env.NEXT_PUBLIC_NEXT_URL || 'http://localhost:3000'

  
// 這裡是設定不需要Layout的路由
export const noLayoutPaths = ['/ship/callback']
// 登入頁路由
export const loginRoute = '/member'
// 隱私頁面路由，未登入時會，檢查後跳轉至登入頁路由
export const protectedRoutes = [
  // 這代表/dashboard/底下的所有路由都會被保護
  '/dashboard/',
  // 設定各別的路由
  '/member/status',
  '/member/profile',
  '/member/profile-password',
]
