'use client'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/app/_components/ui/pagination'
import { useMemo } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

function useRange(current, totalPages, sibling = 1) {
  return useMemo(() => {
    const DOTS = '...'
    const totalNumbers = sibling * 2 + 5
    if (totalNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const left = Math.max(current - sibling, 1)
    const right = Math.min(current + sibling, totalPages)
    const showLeftDots = left > 2
    const showRightDots = right < totalPages - 1

    if (!showLeftDots && showRightDots) {
      return [
        ...Array.from({ length: 3 + 2 * sibling }, (_, i) => i + 1),
        DOTS,
        totalPages,
      ]
    } else if (showLeftDots && !showRightDots) {
      const start = totalPages - (3 + 2 * sibling) + 1
      return [
        1,
        DOTS,
        ...Array.from({ length: 3 + 2 * sibling }, (_, i) => start + i),
      ]
    }
    return [
      1,
      DOTS,
      ...Array.from({ length: right - left + 1 }, (_, i) => left + i),
      DOTS,
      totalPages,
    ]
  }, [current, totalPages, sibling])
}

export function ReservationPagination({ total = 0, pageSize = 12 }) {
  const sp = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const page = Math.max(parseInt(sp.get('page') || '1', 10), 1)
  const totalPages = Math.max(Math.ceil(total / pageSize), 1)
  const range = useRange(page, totalPages, 1)

  const go = (p) => {
    const next = new URLSearchParams(sp.toString())
    next.set('page', String(p))
    next.set('pageSize', String(pageSize))
    router.push(`${pathname}?${next.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (totalPages <= 1) return null

  return (
    <Pagination>
      <PaginationContent className="gap-1">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (page > 1) go(page - 1)
            }}
            className={`w-10 h-10 flex items-center justify-center border-0 ${
              page === 1
                ? 'opacity-40 pointer-events-none'
                : 'text-text-primary hover:bg-orange-600 hover:text-brand-light'
            }`}
          />
        </PaginationItem>

        {range.map((p, i) =>
          p === '...' ? (
            <PaginationItem key={`dots-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (p !== page) go(p)
                }}
                aria-current={p === page ? 'page' : undefined}
                className={`w-10 h-10 flex items-center justify-center border-0 ${
                  p === page
                    ? 'bg-orange-600 text-brand-light'
                    : 'text-text-primary hover:bg-orange-600 hover:text-brand-light'
                }`}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (page < totalPages) go(page + 1)
            }}
            className={`w-10 h-10 flex items-center justify-center border-0 ${
              page === totalPages
                ? 'opacity-40 pointer-events-none'
                : 'text-text-primary hover:bg-orange-600 hover:text-brand-light'
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
