import 'react-datepicker/dist/react-datepicker.css'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/globals.css'
import { Providers } from './providers'
import { Suspense } from 'react'
import CatLoaderFallback from './_components/cat-loader-fallback'
import AppShell from './AppShell'

export const metadata = {
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant" data-theme="light" className="scroll-smooth">
      <body>
        <Suspense fallback={
          <div className="w-full h-screen flex flex-col justify-center items-center ">
            <div className="w-16 h-16 border-[10px] border-t-transparent border-primary rounded-full animate-spin" />
            <p className="mt-4 text-lg text-gray-500">頁面載入中，請稍候...</p>
          </div>
          }>
          <Providers>
            <AppShell>{children}</AppShell>
          </Providers>
        </Suspense>
      </body>
    </html>
  )
}
