'use client'
import CustomerFeedback from "./customer-feedback"
import { motion } from 'framer-motion'
import { useState } from "react"


const cardVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.3,
      duration: 1.5,
      ease: 'easeOut',
    },
  }),
}

export default function FeedbackGroup({ customerInfos = [] }) {
  const [visibleCount, setVisibleCount] = useState(3)
  const visibleFeedbacks = customerInfos.slice(0, visibleCount)
  const hasMore = visibleCount < customerInfos.length

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3)
  }

  return (
    <div className="flex flex-col items-center gap-4 px-0 md:px-16 mb-10 md:mb-16">
      <div className="flex flex-wrap justify-center gap-6 w-full">
        {visibleFeedbacks.map((info, index) => {
          const baseIndex = visibleCount - 3 < 0 ? 0 : visibleCount - 3
          const localIndex = index >= baseIndex ? index - baseIndex : 0
          return (
            <motion.div
              key={index}
              className="w-full "
              custom={localIndex}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <CustomerFeedback customerInfo={info} />
            </motion.div>
          )
        })}
      </div>

      {hasMore && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLoadMore}
          className="mt-4 text-sm font-medium px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
        >
          顯示更多
        </motion.button>
      )}
    </div>
  )
}
