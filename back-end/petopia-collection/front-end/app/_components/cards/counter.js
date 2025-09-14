'use client'

import React from 'react'
import { FaMinus, FaPlus } from "react-icons/fa";

export default function Counter({ value = 1, onChange = () => {} }) {
  const handleChange = (e) => {
    const val = parseInt(e.target.value, 10)
    if (!isNaN(val) && val >= 1 && val <= 100) {
      onChange(val)
    }
  }

  const handleDecrease = () => {
    if (value > 1) {
      onChange(value - 1)
    }
  }

  const handleIncrease = () => {
    if (value < 100) {
      onChange(value + 1)
    }
  }

  return (
    <div className='bg-white py-2 px-3 w-48 text-fp-h6 rounded-2xl flex justify-between items-center border-solid border-button-secondary border-2'>
      <button onClick={handleDecrease}><FaMinus /></button>
      <input
        type='number'
        className="text-center focus:outline-none w-16 h-6"
        value={value}
        onChange={handleChange}
      />
      <button onClick={handleIncrease}><FaPlus /></button>
    </div>
  )
}
