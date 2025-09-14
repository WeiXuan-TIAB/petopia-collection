'use client'

export default function AgreementCheckbox({
    text = "我同意著作權授權，且本篇內容為本人創作",
    linkText = "著作權授權",
    onLinkClick = () => {},
    checked = false,
    onChange = () => {}
  }) {
    const handleCheckboxChange = (event) => {
      onChange(event.target.checked);
    };
  
    const handleLinkClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      onLinkClick();
    };
  
    // 分割文字，找到連結部分
    const beforeLink = text.split(linkText)[0];
    const afterLink = text.split(linkText)[1];
  
    return (
      <div
        className="flex items-center gap-2 cursor-pointer"
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onChange(!checked);
          }
        }}
      >
        {/* 左邊選取圓點 */}
        <div className="flex w-[18px] h-[18px] items-center justify-center rounded-full bg-white border-2 border-gray-300 flex-shrink-0 relative">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleCheckboxChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {/* 選中時的圓點 */}
          {checked && (
            <div className="w-[12px] h-[12px] bg-orange-500 rounded-full flex-shrink-0" />
          )}
        </div>
        
        {/* 右邊文字 */}
        <div 
          className="flex-1 text-[#3E2E2E] overflow-hidden text-ellipsis"
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 1,
            fontFamily: 'FakePearl, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '150%'
          }}
        >
          {beforeLink}
          <span 
            className="text-sky-700 cursor-pointer hover:underline"
            role="button"
            tabIndex={0}
            onClick={handleLinkClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLinkClick(e);
              }
            }}
            style={{
              fontFamily: 'FakePearl, sans-serif',
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '150%'
            }}
            aria-pressed="false"
          >
            {linkText}
          </span>
          {afterLink}
        </div>
      </div>
    );
  }