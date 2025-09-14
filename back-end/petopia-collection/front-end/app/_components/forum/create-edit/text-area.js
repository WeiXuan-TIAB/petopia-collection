'use client'

export default function TextArea({
    label = "內容",
    placeholder = "請輸入內容，僅字數為500字以內",
    value = "",
    onChange = () => {},
    maxLength = 500,
    rows = 12
  }) {
    const handleTextareaChange = (event) => {
      onChange(event.target.value);
    };
  
    return (
      <div className="flex flex-col items-start gap-2 self-stretch">
        {/* 上排文字 */}
        <label 
          className="text-[#3E2E2E]"
          style={{
            fontFamily: 'FakePearl, sans-serif',
            fontSize: '20px',
            fontWeight: 400,
            lineHeight: '150%'
          }}
        >
          {label}
        </label>
        
        {/* 內容框 */}
        <div className="flex h-[366px] p-5 items-start gap-2.5 self-stretch rounded-3xl border border-orange-500 bg-white">
          {/* 框內文字區域 */}
          <textarea
            value={value}
            onChange={handleTextareaChange}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={rows}
            className="w-full h-full bg-transparent outline-none border-none resize-none placeholder:text-[#C8B8AC]"
            style={{
              fontFamily: 'FakePearl, sans-serif',
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '150%',
              color: value ? '#3E2E2E' : '#C8B8AC'  // 有內容時顯示深色，空白時顯示淡色
            }}
          />
        </div>
        
        {/* 字數提示（可選） */}
        {maxLength && (
          <div className="text-xs text-gray-400 self-end">
            {value.length}/{maxLength} 字
          </div>
        )}
      </div>
    );
  }