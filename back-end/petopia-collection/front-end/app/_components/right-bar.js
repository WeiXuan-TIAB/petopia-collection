import {
  FaBagShopping,
  FaPersonWalkingLuggage,
  FaUtensils,
  FaMapLocationDot,
  FaComments,
} from 'react-icons/fa6'

import Link from 'next/link'
import React from 'react'

export default function Rightbar() {
  return (
    <>
      <div className="hidden xl:flex fixed top-0 right-0 z-40 h-screen flex-col justify-center items-center px-2 py-4 right-bar">
        <div className="flex flex-col justify-center items-center gap-2 bg-background-primary/50 backdrop-blur py-6 rounded-full">
          <Link
            href="/product"
            className="group flex flex-col items-center text-2xl p-2 hover:text-primary"
          >
            <div className="flex flex-col gap-1 items-center">
              <FaBagShopping />
              <span className="leading-none">買買</span>
            </div>
            <span className="text-xs/3 text-text-secondary group-hover:text-primary">
              mall
            </span>
          </Link>



          <Link href="/travel" className="group flex flex-col items-center text-2xl p-2 hover:text-primary">

            <div className="flex flex-col gap-1 items-center">
              <FaPersonWalkingLuggage />
              <span className="leading-none">玩玩</span>
            </div>
            <span className="text-xs/3 text-text-secondary group-hover:text-primary">
              travel
            </span>
          </Link>

          <Link
            href="/restaurant"
            className="group flex flex-col items-center text-2xl p-2 hover:text-primary"
          >
            <div className="flex flex-col gap-1 items-center">
              <FaUtensils />
              <span className="leading-none">吃吃</span>
            </div>
            <span className="text-xs/3 text-text-secondary group-hover:text-primary">
              restaurant
            </span>
          </Link>


          <Link href="/map" className="group flex flex-col items-center text-2xl p-2 hover:text-primary">

            <div className="flex flex-col gap-1 items-center">
              <FaMapLocationDot />
              <span className="leading-none">逛逛</span>
            </div>
            <span className="text-xs/3 text-text-secondary group-hover:text-primary">
              map
            </span>
          </Link>

          <Link href="/forum" className="group flex flex-col items-center text-2xl p-2 hover:text-primary">
            <div className="flex flex-col gap-1 items-center">
              <FaComments />
              <span className="leading-none">聊聊</span>
            </div>
            <span className="text-xs/3 text-text-secondary group-hover:text-primary">
              forum
            </span>
          </Link>
        </div>
      </div>
    </>
  )
}
