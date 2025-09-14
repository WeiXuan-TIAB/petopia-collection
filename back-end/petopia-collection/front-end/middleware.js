import { NextResponse } from 'next/server'

export function middleware(req) {
  const token = req.cookies.get('accessToken')?.value
  const pathname = req.nextUrl.pathname

  // 不需登入即可訪問的路由
  const publicPaths = ['/member/login', '/member/register', '/member/forget-password', '/member/reset-password']
  const isPublic = publicPaths.some((path) => pathname.startsWith(path))

  if (pathname.startsWith('/member') && !isPublic && !token) {
    return NextResponse.redirect(new URL('/member/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/member/:path*'],
}
