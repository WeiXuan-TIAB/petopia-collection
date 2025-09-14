'use client'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/_components/ui/pagination"

export function PetopiaPaginationV1({ 
  currentPage = 1, 
  totalPages = 5, 
  onPageChange,
  className 
}) {
  
  // 處理頁面點擊
  const handlePageClick = (page, e) => {
    e.preventDefault()
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange?.(page)
    }
  }

  // 處理上一頁
  const handlePrevious = (e) => {
    e.preventDefault()
    if (currentPage > 1) {
      onPageChange?.(currentPage - 1)
    }
  }

  // 處理下一頁
  const handleNext = (e) => {
    e.preventDefault()
    if (currentPage < totalPages) {
      onPageChange?.(currentPage + 1)
    }
  }

  // 生成頁碼數組
  const getPageNumbers = () => {
    const pages = []
    
    if (totalPages <= 7) {
      // 如果總頁數少於7頁，顯示所有頁面
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 複雜的分頁邏輯
      if (currentPage <= 4) {
        // 顯示 1, 2, 3, 4, 5, ..., last
        pages.push(1, 2, 3, 4, 5, '...', totalPages)
      } else if (currentPage >= totalPages - 3) {
        // 顯示 1, ..., last-4, last-3, last-2, last-1, last
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        // 顯示 1, ..., current-1, current, current+1, ..., last
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <Pagination className={className}>
      <PaginationContent className="gap-1">
        <PaginationItem>
          <PaginationPrevious 
            href="#" 
            onClick={handlePrevious}
            className={`w-10 h-10 flex items-center justify-center border-0 text-text-primary hover:bg-orange-600 hover:text-brand-light ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          />
        </PaginationItem>
        
        {pageNumbers.map((page, index) => (
          <PaginationItem key={index}>
            {page === '...' ? (
              <PaginationEllipsis className="w-10 h-10 flex items-center justify-center" />
            ) : (
              <PaginationLink 
                href="#" 
                onClick={(e) => handlePageClick(page, e)}
                className={`w-10 h-10 flex items-center justify-center border-0 cursor-pointer ${
                  currentPage === page 
                    ? 'bg-orange-600 text-brand-light' 
                    : 'text-text-primary hover:bg-orange-600 hover:text-brand-light'
                }`}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <PaginationNext 
            href="#" 
            onClick={handleNext}
            className={`w-10 h-10 flex items-center justify-center border-0 text-text-primary hover:bg-orange-600 hover:text-brand-light ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}