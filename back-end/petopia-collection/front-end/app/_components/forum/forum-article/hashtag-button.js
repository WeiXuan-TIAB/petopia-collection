'use client'

export default function HashtagButton({ 
  text = "標籤"
}) {
  return (
    <div
      className="inline-flex min-w-[88px] h-[38px] px-4 py-2 justify-center items-center rounded-[32px] bg-button-secondary"
    >
      <span 
        className="text-text-light text-center whitespace-nowrap"
        style={{
          fontFamily: 'FakePearl, sans-serif',
          fontSize: '20px',
          fontWeight: 400,
          writingMode: 'horizontal-tb'
        }}
      >
        {text}
      </span>
    </div>
  );
}