'use client'

import { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa6';

export default function SelectField({
  label = "標籤文字",
  options = [],
  value = "",
  onChange = () => {},
  placeholder = "請選擇選項",
  width = "w-[400px]"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => (opt.value || opt) === value);
  const displayText = selectedOption ? (selectedOption.label || selectedOption) : placeholder;

  return (
    <div className={`flex ${width} flex-col items-start gap-2.5`} ref={dropdownRef}>
      {/* 上部文字 */}
      <label 
        className="text-[#3E2E2E] text-center"
        style={{
          fontFamily: 'FakePearl, sans-serif',
          fontSize: '20px',
          fontWeight: 400,
          lineHeight: '150%'
        }}
      >
        {label}
      </label>
      
      {/* 下拉選單容器 */}
      <div className="relative w-full">
        <button 
          className="flex items-center justify-between self-stretch rounded-full border border-orange-500 bg-white cursor-pointer"
          onClick={handleToggle}
        >
          <span 
            className="flex-1 text-left"
            style={{
              color: value ? '#EE5A36' : '#9CA3AF',
              fontFamily: 'FakePearl, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '150%',
              padding: '8px 16px'
            }}
          >
            {displayText}
          </span>
          
          <div className="flex py-2 px-4 items-center">
            <FaChevronDown 
              className={`text-orange-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              size={12}
            />
          </div>
        </button>

        {/* 下拉選項 */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-orange-500 rounded-2xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {options.map((option, index) => {
              const optionValue = option.value || option;
              const optionLabel = option.label || option;
              
              return (
                <button
                  key={index}
                  className="px-4 py-2 hover:bg-orange-50 cursor-pointer first:rounded-t-2xl last:rounded-b-2xl"
                  onClick={() => handleOptionClick(optionValue)}
                  style={{
                    color: '#3E2E2E',
                    fontFamily: 'FakePearl, sans-serif',
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: '150%'
                  }}
                >
                  {optionLabel}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}