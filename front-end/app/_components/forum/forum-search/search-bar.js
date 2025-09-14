'use client'

import { FaChevronDown } from 'react-icons/fa6';

export default function SearchBar({
  searchValue = "",
  onSearchChange = () => {},
  selectedCategory = "",
  onCategoryChange = () => {},
  categories = [
    { label: "請選擇類別", value: "" },
    { label: "貓貓", value: "cats" },
    { label: "狗狗", value: "dogs" },
    { label: "特寵", value: "special" }
  ],
  onSearch = () => {},
  placeholder = "請輸入關鍵字..."
}) {
  const handleSearchInputChange = (e) => {
    onSearchChange(e.target.value);
  };

  const handleCategoryChange = (e) => {
    onCategoryChange(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchValue, selectedCategory);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  // 找到當前選中的類別
  const selectedCategoryOption = categories.find(cat => cat.value === selectedCategory);
  const categoryDisplayText = selectedCategoryOption ? selectedCategoryOption.label : "請選擇類別";

  return (
    <div 
      className="flex items-center gap-0 self-stretch rounded-full border border-[#EE5A36]"
    >
      {/* 左側搜尋輸入框 */}
      <div className="flex h-10 px-6 py-2 items-center gap-2.5 flex-1 rounded-l-full bg-white">
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchInputChange}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 outline-none border-none bg-transparent placeholder-[#C8B8AC] text-[#3E2E2E]"
          style={{
            fontFamily: 'FakePearl, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '150%'
          }}
        />
      </div>

      {/* 中間類別選擇框 */}
      <div className="flex h-10 items-center flex-1 bg-white border-l border-r border-[#EE5A36] relative">
        {/* 隱形的 select */}
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        >
          {categories.map((category, index) => (
            <option 
              key={index} 
              value={category.value}
              className="text-[#3E2E2E] bg-white"
            >
              {category.label}
            </option>
          ))}
        </select>

        {/* 顯示層 */}
        <div className="flex items-center w-full">
          {/* 左側文字 */}
          <div className="flex px-6 py-2 items-center gap-2.5 flex-1 pointer-events-none">
            <span
              className="text-[#3E2E2E]"
              style={{
                fontFamily: 'FakePearl, sans-serif',
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: '150%'
              }}
            >
              {categoryDisplayText}
            </span>
          </div>

          {/* 右側箭頭 */}
          <div className="flex px-4 py-2 justify-end items-center self-stretch bg-white pointer-events-none">
            <FaChevronDown 
              className="w-4 h-4 text-[#C8B8AC]"
            />
          </div>
        </div>
      </div>

      {/* 右側搜尋按鈕 */}
      <button
        onClick={handleSearchClick}
        className="flex w-20 h-10 px-6 py-2 justify-center items-center gap-2.5 bg-[#EE5A36] text-white hover:bg-[#d94f2a] transition-colors rounded-r-full"
        style={{
          fontFamily: 'FakePearl, sans-serif',
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '150%'
        }}
      >
        搜尋
      </button>
    </div>
  );
}