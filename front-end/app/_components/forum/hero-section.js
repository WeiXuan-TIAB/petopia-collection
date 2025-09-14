// components/forum/HeroSection.js
'use client'
import { useState } from 'react'
import * as motion from "motion/react-client"
import Link from "next/link";

export default function HeroSection() { const [imagesLoaded, setImagesLoaded] = useState({
    main: false,
    top: false,
    bottom: false
  })

  // 統一的過渡配置
  const transitionConfig = {
    type: "spring",
    damping: 20,
    stiffness: 100,
    mass: 0.8
  }

  // 優化的緩動函數
  const easeConfig = [0.25, 0.46, 0.45, 0.94] // cubic-bezier for smooth animation

  const handleImageLoad = (imageKey) => {
    setImagesLoaded(prev => ({ ...prev, [imageKey]: true }))
  }

  return (
    <div className="flex gap-4 pb-6">
      {/* 大圖區塊 */}
      <motion.div
        className="flex-[2] rounded-l-4xl p-6 text-white flex flex-col justify-end relative overflow-hidden h-96"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          ...transitionConfig,
          delay: 0.5,
        }}
        style={{ willChange: 'transform, opacity' }} // 硬體加速
      >
        <motion.img 
          src="images/forum/IMG_6778.JPG" 
          alt="薩摩耶犬" 
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ 
            scale: imagesLoaded.main ? 1 : 1.1, 
            opacity: imagesLoaded.main ? 1 : 0 
          }}
          transition={{
            duration: 0.8,
            delay: 0.4,
            ease: easeConfig,
          }}
          onLoad={() => handleImageLoad('main')}
          style={{ willChange: 'transform, opacity' }}
        />
        
        <motion.div 
          className="relative z-10 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-lg cursor-pointer"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.8,
            ease: easeConfig,
          }}
          whileHover={{ 
            y: -5,
            transition: { duration: 0.2 }
          }}
        >
          <motion.h3 
            className="text-xl mb-1 drop-shadow-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 1.2,
            }}
          >
            Q萌的薩摩耶店長上班啦~
          </motion.h3>
          <motion.p 
            className="text-xl drop-shadow-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 1.4,
            }}
          >
            炎炎夏日來杯冰涼飲品吧!
          </motion.p>
        </motion.div>
      </motion.div>
      
      {/* 小圖區塊容器 */}
      <div className="flex-1 flex flex-col justify-between h-96">
        {/* 右上小圖 */}
        <motion.div
          className="p-4 text-white relative overflow-hidden h-[calc(50%-0.5rem)] flex flex-col justify-end rounded-tr-4xl"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            ...transitionConfig,
            delay: 0.5,
          }}
          style={{ willChange: 'transform, opacity' }}
        >
          <motion.img 
            src="images/forum/IMG_2457.JPG" 
            alt="點點" 
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ 
              scale: imagesLoaded.top ? 1 : 1.1, 
              opacity: imagesLoaded.top ? 1 : 0 
            }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              ease: easeConfig,
            }}
            onLoad={() => handleImageLoad('top')}
            style={{ willChange: 'transform, opacity' }}
          />
          
          <motion.div 
            className="relative z-10 bg-gradient-to-t from-black/60 to-transparent p-2 rounded-lg cursor-pointer"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 1.0,
              ease: easeConfig,
            }}
            whileHover={{ 
              y: -3,
              transition: { duration: 0.2 }
            }}
          >
            <motion.p 
              className="text-base drop-shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: 1.6,
              }}
            >
              貓貓一天睡超過15小時？
            </motion.p>
          </motion.div>
        </motion.div>
        
        {/* 右下小圖 */}
        <motion.div
          className="p-4 text-white relative overflow-hidden h-[calc(50%-0.5rem)] flex flex-col justify-end rounded-br-4xl"
          initial={{ opacity: 0, x: 50, y: 50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{
            ...transitionConfig,
            delay: 0.7,
          }}
          style={{ willChange: 'transform, opacity' }}
        >
          <Link href="http://localhost:3000/forum/article/15">
            <motion.img 
              src="images/forum/IMG_6081.JPG" 
              alt="HOHO" 
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ 
                scale: imagesLoaded.bottom ? 1 : 1.1, 
                opacity: imagesLoaded.bottom ? 1 : 0 
              }}
              transition={{
                duration: 0.8,
                delay: 0.8,
                ease: easeConfig,
              }}
              onLoad={() => handleImageLoad('bottom')}
              style={{ willChange: 'transform, opacity' }}
            />
            
            <motion.div 
              className="relative z-10 bg-gradient-to-t from-black/60 to-transparent p-2 rounded-lg cursor-pointer"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 1.2,
                ease: easeConfig,
              }}
              whileHover={{ 
                y: -3,
                transition: { duration: 0.2 }
              }}
            >
              <motion.p 
                className="text-base drop-shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 1.8,
                }}
              >
                伍宮me吉/HO家的三寶日常
              </motion.p>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}