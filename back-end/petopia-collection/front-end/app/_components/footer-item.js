'use client'

import Link from 'next/link'
import { FaChevronRight } from 'react-icons/fa6'

export default function FooterItem({ href, title }) {
  return (
    <Link href={href} className="w-full flex justify-between p-4 hover:bg-brand-warm/10 transition duration-300">
      <span>{title}</span>
      <FaChevronRight className="w-6 h-6 text-text-secondary" />
    </Link>
  )
}
