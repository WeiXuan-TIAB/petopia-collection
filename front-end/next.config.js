/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    // 若要在 build 時忽略 ESLint 錯誤，取消註解下面這行
    // ignoreDuringBuilds: true,
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'loremflickr.com' },
      { protocol: 'http',  hostname: 'localhost' }, // 需要指定 port 時可加上：port: '3000'
      { protocol: 'https', hostname: 'images.unsplash.com' }, // Unsplash
    ],
  },
  // 如需反向代理再開
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'https://petopia-backend-production.up.railway.app/api/:path*' },
    ]
  },
}

module.exports = nextConfig