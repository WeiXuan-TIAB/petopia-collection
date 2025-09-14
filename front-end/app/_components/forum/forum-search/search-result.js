'use client'

import FilterSection from './fliter-section';

// 單個搜尋結果項目元件
function SearchResultItem({ result }) {
  // 正確的 Debug 程式碼（如果需要的話）
  console.log('SearchResultItem 收到的 result:', result);
  
  return (
    <div className="flex flex-col items-start self-stretch">
      {/* 標題 */}
      <h3 
        className="self-stretch text-[#EE5A36] cursor-pointer hover:underline"
        style={{
          fontFamily: 'FakePearl, sans-serif',
          fontSize: '18px',
          fontWeight: 400,
          lineHeight: '175%' // 24.5px
        }}
      >
        {result.title}
      </h3>
      
      {/* 下文字 - 內容預覽 */}
      <p 
        className="self-stretch overflow-hidden text-black text-ellipsis"
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          fontFamily: 'FakePearl, sans-serif',
          fontSize: '16px',
          fontWeight: 300,
          lineHeight: '16px'
        }}
      >
        {result.content}
      </p>
    </div>
  );
}

// 搜尋結果標題列元件
function SearchResultsHeader({ resultCount, sortBy, onSortChange }) {
  return (
    <div className="flex justify-between items-center mb-4 w-full">
      {/* 左側：搜尋結果數量 */}
      <div 
        className="text-[#3E2E2E] font-bold"
        style={{
          fontFamily: 'FakePearl, sans-serif',
          fontSize: '20px',
          fontWeight: 400,
          lineHeight: '150%'
        }}
      >
        約有 {resultCount.toLocaleString()} 個搜尋結果
      </div>
      
      {/* 右側：排序篩選 */}
      <FilterSection 
        sortBy={sortBy}
        onChange={onSortChange}
      />
    </div>
  );
}

// 主要搜尋結果元件
export default function SearchResults({ 
  results = [],
  totalResults = 0, 
  sortBy = "", 
  onSortChange = () => {},
  loading = false 
}) {
  const displayResults = results;
  
  if (loading) {
    return (
      <div className="flex py-4 flex-col items-start gap-4 self-stretch">
        <div className="text-center text-gray-500">載入中...</div>
      </div>
    );
  }

  return (
    <div className="flex py-4 flex-col items-start gap-4 self-stretch">
      {/* 搜尋結果標題列 */}
      <SearchResultsHeader 
        resultCount={totalResults}
        sortBy={sortBy}
        onSortChange={onSortChange}
      />
      
      {/* 搜尋結果列表 */}
      <div className="flex flex-col items-start self-stretch gap-4">
        {displayResults.map((result) => (
          <SearchResultItem key={result.id} result={result} />
        ))}
      </div>
    </div>
  );
}