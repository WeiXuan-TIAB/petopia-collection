// app/_components/MapEmbed.js (或任意位置)
export default function MapEmbed({
  embedUrl,
  address,
  lat,
  lng,
  className = '',
}) {
  // 1) 若你從 Google Maps「分享→嵌入地圖」複製的 src，直接用
  let src = embedUrl

  // 2) 沒有 embedUrl 時，用座標生成（不需 API key）
  if (!src && lat != null && lng != null) {
    // 介面中文、縮放 16
    src = `https://www.google.com/maps?q=${lat},${lng}&z=16&hl=zh-TW&output=embed`
  }

  // 3) 或用地址生成（不需 API key；精準度取決於地址可見度）
  if (!src && address) {
    src = `https://www.google.com/maps?q=${encodeURIComponent(
      address
    )}&z=16&hl=zh-TW&output=embed`
  }

  if (!src) return null

  return (
    <div
      className={`w-full aspect-video rounded-2xl overflow-hidden ${className}`}
    >
      <iframe
        src={src}
        className="w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="map-embed"
      />
    </div>
  )
}
