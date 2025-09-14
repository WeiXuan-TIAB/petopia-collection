'use client'

export default function SubmitButton({
  text = "送出",
  onClick = () => { },
  disabled = false,
  type = "button",
  variant = "primary", // "primary" | "secondary" | "danger"
  size = "default"     // "small" | "default" | "large"
}) {

  // 根據 variant 返回對應的背景色和 hover 效果
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return "bg-gray-500 hover:bg-gray-600";
      case "danger":
        return "bg-red-500 hover:bg-red-600";
      case "primary":
      default:
        return "bg-orange-500 hover:bg-orange-600";
    }
  };

  // 根據 size 返回對應的 padding 和字體大小
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return "py-1 px-4 text-sm";
      case "large":
        return "py-3 px-8 text-xl";
      case "default":
      default:
        return "py-2 px-6";
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
         flex justify-center items-center gap-2.5 
         rounded-full text-white transition-all duration-200
         ${getVariantStyles()}  // 動態顏色樣式
         ${getSizeStyles()}     // 動態尺寸樣式
         ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}  // 禁用狀態樣式
       `}
      style={{
        // 統一字體設定（覆蓋 getSizeStyles 的字體大小，保持設計一致性）
        fontFamily: 'FakePearl, sans-serif',
        fontSize: '20px',
        fontWeight: 400,
        lineHeight: '150%'
      }}
    >
      {text}
    </button>
  );
}