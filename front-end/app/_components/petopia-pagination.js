'use client'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/_components/ui/pagination"
import { cn } from "@/lib/utils"

export function PetopiaPagination({ className, currentPage, pageCount, onPageChange }) {
  if (pageCount <= 1) return null

  const getPageNumbers = () => {
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = start + maxVisible - 1

    if (end > pageCount) {
      end = pageCount
      start = Math.max(1, end - maxVisible + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  return (
    <Pagination className={className}>
      <PaginationContent className="gap-1">
        {/* 上一頁 */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage > 1) onPageChange(currentPage - 1)
            }}
            className={cn(
              "w-10 h-10 flex items-center justify-center border-0 text-text-primary hover:bg-orange-600 hover:text-brand-light rounded-full",
              currentPage === 1 && "opacity-50 pointer-events-none"
            )}
          />
        </PaginationItem>

        {/* 動態頁碼 */}
        {getPageNumbers().map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onPageChange(page)
              }}
              className={cn(
                "w-10 h-10 flex items-center justify-center border-0 text-text-primary hover:bg-orange-600 rounded-full hover:text-brand-light",
                currentPage === page && "bg-orange-600 text-white "
              )}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* 下一頁 */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage < pageCount) onPageChange(currentPage + 1)
            }}
            className={cn(
              "w-10 h-10 flex items-center justify-center border-0 text-text-primary hover:bg-orange-600 hover:text-brand-light rounded-full",
              currentPage === pageCount && "opacity-50 pointer-events-none"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
