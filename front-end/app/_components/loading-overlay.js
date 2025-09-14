'use client'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingOverlay({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.05 } }} // 👈 進場幾乎即時
          exit={{ opacity: 0, transition: { duration: 0.3 } }}     // 👈 淡出順暢
          className="loading-overlay absolute top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center"
        >
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
