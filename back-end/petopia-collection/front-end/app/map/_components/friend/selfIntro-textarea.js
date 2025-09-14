'use client'
import React, { useState } from 'react'

export default function SelfIntroTextarea() {
  const [text, setText] = useState('')
  const maxChars = 500

  return (
    <div className="flex flex-col gap-2 w-full max-w-lg">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={maxChars}
        placeholder="填寫自我介紹"
        className="w-full h-48 rounded-2xl border border-[#3B2F2F] p-4 text-lg text-[#B8A89B] focus:outline-none focus:ring-2 focus:ring-orange-300"
      />
      <div className="text-right text-sm text-gray-500">
        {text.length}/{maxChars}
      </div>
    </div>
  )
}