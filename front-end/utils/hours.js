// utils/hours.js
export const pad = (n) => String(n).padStart(2, '0')

export function toDateInputValue(d = new Date()) {
  const tz = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return tz.toISOString().split('T')[0] // yyyy-mm-dd
}

export function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

// 取未來 N 天（含今日），且「有營業時段的日子」
export function getOpenDatesNextNDays(byWeekday, n = 30, base = new Date()) {
  const list = []
  for (let i = 0; i <= n; i++) {
    const d = addDays(base, i)
    const wd = d.getDay() // 0..6
    if (byWeekday?.[wd]?.length) list.push(d)
  }
  return list
}

// 產生某日可選時段（半小時粒度）；若是今天，只提供「現在時間往後」的時段
export function generateTimeOptionsForDate(targetDate, byWeekday, stepMin = 30) {
  const wd = targetDate.getDay()
  const spans = byWeekday?.[wd] ?? []
  if (!spans.length) return []

  // today cutoff：下一個半小時整
  const now = new Date()
  const isToday = targetDate.toDateString() === now.toDateString()
  const cutoffMin = isToday
    ? Math.ceil((now.getHours() * 60 + now.getMinutes()) / stepMin) * stepMin
    : 0

  const out = []
  for (const { start, end } of spans) {
    const [sh, sm] = start.split(':').map(Number)
    const [eh, em] = end.split(':').map(Number)
    let t = sh * 60 + sm
    const endMin = eh * 60 + em
    for (; t <= endMin - stepMin; t += stepMin) {
      if (t >= cutoffMin) {
        out.push(`${pad(Math.floor(t / 60))}:${pad(t % 60)}`)
      }
    }
  }
  return out
}
