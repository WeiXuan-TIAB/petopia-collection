'use client'

// 顯示路線資訊彈窗
export function showRouteInfo(summary, name) {
  const distance = (summary.totalDistance / 1000).toFixed(2)
  const el = document.createElement('div')
  el.innerHTML = `
    <div style="position:fixed;top:20px;right:20px;background:#fff;padding:14px 16px;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,.15);z-index:1000;font-family:system-ui,Arial">
      <div style="font-weight:700;color:#3E2E2E;margin-bottom:6px;">導航到 ${
        name ?? ''
      }</div>
      <div style="color:#666">距離 ${distance} 公里</div>
    </div>`
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 7000)
}

// 顯示路線規劃失敗的備用提示
export function showFallback(name) {
  const el = document.createElement('div')
  el.innerHTML = `
    <div style="position:fixed;top:20px;right:20px;background:#FFF3CD;color:#856404;padding:14px 16px;border:1px solid #FFEAA7;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,.15);z-index:1000;font-family:system-ui,Arial">
      ⚠️ 路線規劃暫時無法使用，已顯示「${
        name ?? '目的地'
      }」，可點標記用 Google/Apple 導航
    </div>`
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 7000)
}

// 顯示一般提示訊息
export function showMessage(message, type = 'info') {
  const el = document.createElement('div')
  const bgColor = type === 'error' ? '#FFF3CD' : '#fff'
  const textColor = type === 'error' ? '#856404' : '#3E2E2E'
  const borderColor = type === 'error' ? '#FFEAA7' : 'transparent'
  
  el.innerHTML = `
    <div style="position:fixed;top:20px;right:20px;background:${bgColor};color:${textColor};padding:14px 16px;border:1px solid ${borderColor};border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,.15);z-index:1000;font-family:system-ui,Arial">
      ${message}
    </div>`
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 5000)
}