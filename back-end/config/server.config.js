import 'dotenv/config.js'

const env = process.env.NODE_ENV || 'development'

export const serverConfig = {
  // 如果要使用redis session store類型，必需要在 .env 檔案中設定 REDIS_URL
  // 這裡判斷是否為開發環境，如果是開發環境，就使用file session store
  sessionStoreType: env === 'development' ? 'file' : 'redis', // file | redis
  // 前端網址
  nextUrl:
    env === 'development'
      ? 'http://localhost:3000'
      : 'https://petopia-frontend-git-main-tiabs-projects.vercel.app',
  // 後端伺服器佈置後的網域名稱，與cookie有關
  domain: env === 'development' ? '' : 'petopia-frontend-lake.vercel.app',
  // ethereal
  smtp: {
    provider: 'ethereal',
    host: 'smtp.ethereal.email',
    user: 'mittie.daniel91@ethereal.email',
    pass: 'b6en9s7EqjP9EPVKkd',
  },
  jwt: {
    secret: 'access_token_secret',
  },
  otp: {
    secret: 'otp_secret',
    expire: 5 * 60 * 1000, // 5 分鐘
  },
  // local development
  lineLogin: {
    development: {
      channelId: '123456789',
      channelSecret: 'xxxxxxxxxxxx',
      callbackUrl: 'http://localhost:3000/member/line-login',
    },
    production: {
      channelId: '',
      channelSecret: '',
      callbackUrl: 'https://petopia-frontend-lake.vercel.app/member/line-login',
    },
  },
  // 前端接回導向的網址
  ship711: {
    development: {
      callbackUrl: 'http://localhost:3000/ship/callback',
    },
    production: {
      callbackUrl: 'https://petopia-frontend-lake.vercel.app/ship/callback',
    },
  },
  linePay: {
    development: {
      channelId: process.env.LINEPAY_DEV_CHANNEL_ID,
      channelSecret: process.env.LINEPAY_DEV_CHANNEL_SECRET,
      confirmUrl: process.env.LINEPAY_DEV_CONFIRM_URL,
      cancelUrl: process.env.LINEPAY_DEV_CANCEL_URL,
    },
    production: {
      channelId: process.env.LINEPAY_PROD_CHANNEL_ID,
      channelSecret: process.env.LINEPAY_PROD_CHANNEL_SECRET,
      confirmUrl: process.env.LINEPAY_PROD_CONFIRM_URL,
      cancelUrl: process.env.LINEPAY_PROD_CANCEL_URL,
    },
  },
}
