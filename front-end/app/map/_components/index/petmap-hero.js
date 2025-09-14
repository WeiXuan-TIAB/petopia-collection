'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'

const MotionImage = motion(Image)

export default function PetMapHero({
  humanSrc,
  dogSrc,
  catSrc,
  pins = [],
}) {
  const prefersReducedMotion = useReducedMotion()
  const floatY = prefersReducedMotion ? 0 : 8

  const floatTransition = {
    duration: 2.8,
    repeat: Infinity,
    repeatType: 'reverse',
    ease: 'easeInOut',
  }

  const pinVariants = {
  hidden: { y: -25, opacity: 0, scale: 0.8, rotate: -8 },
  show: (i) => ({
    y: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { delay: 0.15 * i, type: 'spring', stiffness: 260, damping: 18 },
  }),
  wiggle: prefersReducedMotion
    ? {}
    : {
        rotate: [0, -8, 8, -4, 4, 0],
      y: [0, -12, 12, -8, 8, 0],
        transition: { 
          delay: 0.5, 
          duration: 2.2, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        },
      },
}

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative mx-auto max-w-[1100px] aspect-[16/9]">

        {/* 角色 */}
        <div className="absolute bottom-[14%] left-1/2 -translate-x-1/2">
          <MotionImage
            src={dogSrc}
            alt="狗狗"
            width={115}
            height={115}
            className="absolute right-[95px] bottom-[4px] h-auto w-[95px] md:w-[115px]"
            initial={{ y: 12 }}
            animate={{
              y: [0, -floatY / 1.5, 0],
              scaleX: [1, 1.02, 1, 1.02, 1],
            }}
            transition={{ ...floatTransition, duration: 2.2 }}
            draggable={false}
          />
          <MotionImage
            src={humanSrc}
            alt="旅人"
            width={190}
            height={190}
            className="h-auto w-[150px] md:w-[190px] drop-shadow"
            initial={{ y: 18 }}
            animate={{ y: [0, -floatY, 0] }}
            transition={floatTransition}
            priority
            draggable={false}
          />
          <MotionImage
            src={catSrc}
            alt="貓咪"
            width={200}
            height={200}
            className="absolute left-[110px] bottom-0 h-auto w-[85px] md:w-[100px]"
            initial={{ y: 12, rotate: -3 }}
            animate={{ y: [0, -floatY / 2, 0], rotate: [-3, 2, -1, 0] }}
            transition={{ ...floatTransition, duration: 2.6 }}
            draggable={false}
          />
        </div>

        {/* Pins */}
        <motion.div initial="hidden" animate="show" className="absolute inset-0 pointer-events-none">
          {pins.map((p, i) => (
            <MotionImage
              key={p.id || i}
              custom={i}
              variants={pinVariants}
              animate={['show', 'wiggle']}
              src={p.src}
              alt=""
              width={p.size ?? 32}
              height={p.size ?? 32}
              className="absolute select-none"
              style={{ left: p.left, top: p.top }}
              aria-hidden
            />
          ))}
        </motion.div>

      </div>
    </section>
  )
}
