// 簡化版 HashtagButton - 純顯示用
const HashtagButton = ({ text = "標籤" }) => {
  return (
    <div
      className="inline-flex min-w-[88px] h-[38px] px-4 py-2 justify-center items-center rounded-[32px] bg-button-secondary"
    >
      <span 
        className="text-white text-center whitespace-nowrap"
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
};

export default function TitleHashtag({ 
  title = "", //"如何挑選優質貓咪飼料",
  hashtags = []//["健康", "衛生", "均衡"]
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* 標題 */}
      <h1 
        className="self-stretch text-black leading-[100%]"
        style={{
          fontFamily: 'FakePearl, sans-serif',
          fontSize: '32px',
          fontWeight: 400,
          lineHeight: '32px'
        }}
      >
        {title}
      </h1>
      
      {/* Hashtag 按鈕群組 */}
      <div className="flex items-center gap-4">
        {hashtags.map((tag, index) => (
          <HashtagButton key={index} text={tag} />
        ))}
      </div>
    </div>
  );
}