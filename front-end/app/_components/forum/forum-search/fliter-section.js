'use client'

import { BiSolidSortAlt } from 'react-icons/bi';
import { FaChevronDown } from 'react-icons/fa6';

export default function FilterSection({
  sortBy = "",
  onChange = () => {},
  options = [
    { label: "排序方式", value: "" },
    { label: "最新發布", value: "最新發布" },
    { label: "最多回覆", value: "最多回覆" },  // 改成中文值
    { label: "最多按讚", value: "最多按讚" },  // 改成中文值
    { label: "熱門度", value: "熱門度" }      // 改成中文值
  ]
}) {
  const handleSortChange = (e) => {
    onChange(e.target.value);
  };

  // 找到當前選中的排序選項
  const selectedOption = options.find(opt => opt.value === sortBy);
  const displayText = selectedOption ? selectedOption.label : "排序方式";

  return (
    <div className="flex w-[213px] items-center rounded-full border border-white overflow-hidden">
      {/* 左側 - 圖標和文字 */}
      <div className="flex px-6 py-2 items-center gap-2.5 flex-1 bg-white pointer-events-none rounded-l-full">
        {/* 左側圖標 */}
        <BiSolidSortAlt 
          className="w-4 h-4 aspect-square text-[#3E2E2E]"
        />
        
        {/* 左側文字 */}
        <span
          className="text-[#3E2E2E]"
          style={{
            fontFamily: 'FakePearl, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '150%'
          }}
        >
          {displayText}
        </span>
      </div>

      {/* 右框 - 下拉箭頭 */}
      <div className="flex px-4 py-2 items-center gap-2.5 self-stretch bg-white relative rounded-r-full">
        {/* 隱形的 select，覆蓋整個元件 */}
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="absolute opacity-0 cursor-pointer z-10"
          style={{ 
            left: '-180px', 
            top: '0',
            width: '213px', 
            height: '100%'
          }}
        >
          {options.map((option, index) => (
            <option 
              key={index} 
              value={option.value}
              className="text-[#3E2E2E] bg-white"
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* 右框圖標 */}
        <FaChevronDown 
          className="w-4 h-4 aspect-square text-[#3E2E2E] pointer-events-none"
        />
      </div>
    </div>
  );
}