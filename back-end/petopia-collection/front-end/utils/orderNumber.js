/**
 * 產生訂單編號
 * 格式: ORDYYYYMMDDHHmmssSSS
 * @param {string} prefix - 訂單編號前綴 (預設 "ORD")
 * @returns {string} 訂單編號
 */
export function generateOrderNumber(prefix = "ORD") {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");
  const millisecond = String(now.getMilliseconds()).padStart(3, "0"); // 毫秒補 3 位

  return `${prefix}${year}${month}${day}${hour}${minute}${second}${millisecond}`;
}