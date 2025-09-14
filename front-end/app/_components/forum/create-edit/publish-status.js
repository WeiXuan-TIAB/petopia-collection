'use client'

import { FaChevronDown } from 'react-icons/fa6';

export default function PublishStatus({
  label = "發文狀態",
  options = [
    { label: "草稿", value: "draft" },
    { label: "發布", value: "published" },
    { label: "存檔", value: "archived" }
  ],
  value = "",
  onChange = () => {},
  placeholder = "草稿"
}) {
  const handleStatusChange = (event) => {
    onChange(event.target.value);
  };

  // 找到當前選中的選項來顯示
  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className="flex flex-col items-start gap-2">
      {/* 上文字 */}
      <label 
        className="text-[#3E2E2E] text-center overflow-hidden text-ellipsis"
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 1,
          fontFamily: 'FakePearl, sans-serif',
          fontSize: '20px',
          fontWeight: 400,
          lineHeight: '150%'
        }}
      >
        {label}
      </label>
      
      {/* 狀態下拉框 */}
      <div className="flex w-[208px] py-2 px-4 justify-between items-center bg-white border border-gray-200 relative">
        {/* 隱形的 select，覆蓋整個區域 */}
        <select
          value={value}
          onChange={handleStatusChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option, index) => (
            <option 
              key={index} 
              value={option.value || option}
              className="text-[#3E2E2E] bg-white"
            >
              {option.label || option}
            </option>
          ))}
        </select>
        
        {/* 顯示層 - 顯示當前選中的值 */}
        <span
          className="flex-1 pointer-events-none"
          style={{
            color: value ? '#3E2E2E' : '#C8B8AC',
            fontFamily: 'FakePearl, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '150%'
          }}
        >
          {displayText}
        </span>
        
        {/* 框內下拉(右) */}
        <div className="w-4 h-4 flex-shrink-0 aspect-square pointer-events-none">
          <FaChevronDown 
            className="w-full h-full text-[#C8B8AC]"
          />
        </div>
      </div>
    </div>
  );
}