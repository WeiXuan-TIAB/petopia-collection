// threedots-menu.js
'use client'
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const ThreedotsMenu = ({ 
  isContentOwner, 
  onShare, 
  articleId,
  onReport,
  buttonSize = "w-10 h-10",
  iconSize = 16 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 點擊外部關閉
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex ${buttonSize} px-2 py-2 justify-center items-center gap-2.5 flex-shrink-0 aspect-square rounded-full border border-brand-warm bg-transparent cursor-pointer hover:bg-gray-50`}
      >
        <span style={{ fontSize: `${iconSize}px` }} className="flex-shrink-0 text-brand-warm">⋮</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button 
            onClick={() => { onShare(); setIsOpen(false); }} 
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
          >
            📤 分享
          </button>
          {isContentOwner ? (
            <Link 
              href={`/forum/create-edit?mode=edit&id=${articleId}`}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg"
              onClick={()=>setIsOpen(false)}
            >
              ✏️ 編輯/刪除
            </Link>
          ) : (
            <button 
              onClick={() => { onReport(); setIsOpen(false); }} 
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg"
            >
              🚩 檢舉
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ThreedotsMenu;