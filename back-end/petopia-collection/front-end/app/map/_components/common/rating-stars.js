'use client'

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

export default function RatingStars({ rating = 0, max = 5, className = '' }) {
  return (
    <div className={`flex ${className}`}>
      {[...Array(max)].map((_, index) => {
        const star = index + 1
        return (
          <FontAwesomeIcon
            key={star}
            icon={faStar}
            className={`w-4 h-4 mr-1 ${
              star <= rating ? 'text-[#F5AB54]' : 'text-gray-300'
            }`}
          />
        )
      })}
    </div>
  )
}