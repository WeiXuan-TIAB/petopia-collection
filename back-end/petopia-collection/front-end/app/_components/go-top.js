'use client'

import React from 'react'
import CatHand from "./cat-hand";

export default function GoTop() {
const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}


  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-[-75px] right-5 md:right-24 z-50 cursor-pointer transition-transform duration-300 hover:-translate-y-8 overflow-visible p-4"
      aria-label="Scroll to top"
    >
      <CatHand />
    </button>
  )
}
