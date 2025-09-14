// item 基本模型（初始欄位）
export const itemTemplate = {
  id: "",
  quantity: 0,
  product_name: "",
  price: 0,
  mainImage: "/images/product/placeholder.png",
  color: "",
  size: "",
  flavor: "",
}

// 確保 item 擁有完整結構
export const normalizeItem = (item) => {
  return { ...itemTemplate, ...item }
}

// 初始化狀態
export const initItems = []

export const initState = {
  items: initItems,
  isEmpty: true,
  totalItems: 0,
  cartTotal: 0,
}

// 找 item by id
export const findOneById = (items, id) =>
  items.find((item) => String(item.id) === String(id)) || {}

// 更新 item
export const updateOne = (items, updateItem) => {
  return items.map((item) =>
    String(item.id) === String(updateItem.id) ? normalizeItem(updateItem) : item
  )
}

// 數量 +1
export const incrementOne = (items, id) => {
  return items.map((item) =>
    String(item.id) === String(id)
      ? { ...item, quantity: item.quantity + 1 }
      : item
  )
}

// 數量 -1 (最少為 1)
export const decrementOne = (items, id) => {
  return items.map((item) =>
    String(item.id) === String(id)
      ? { ...item, quantity: item.quantity - 1 > 0 ? item.quantity - 1 : 1 }
      : item
  )
}

// 加入 item
export const addOne = (items, newItem) => {
  const normalized = normalizeItem(newItem)

  const foundIndex = items.findIndex(
    (item) => String(item.id) === String(normalized.id)
  )

  if (foundIndex > -1) {
    const item = items[foundIndex]
    const newQuantity = item.quantity + (normalized.quantity || 1)
    return updateOne(items, { ...item, quantity: newQuantity })
  }

  return [...items, normalized]
}

// 移除 item
export const removeOne = (items, id) =>
  items.filter((item) => String(item.id) !== String(id))

// 小計
export const subtotalPrice = (items) =>
  items.map((item) => ({
    ...item,
    subtotal: item.price * item.quantity,
  }))

// 總價
export const totalPrice = (items) =>
  items.reduce((total, item) => total + item.quantity * item.price, 0)

// 總數量
export const totalItems = (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0)

// 產生最新的購物車狀態
export const generateCartState = (state, items) => {
  const isEmpty = items.length === 0
  return {
    ...initState,
    ...state,
    items: subtotalPrice(items),
    totalItems: totalItems(items),
    totalPrice: totalPrice(items),
    isEmpty,
  }
}

// 初始化
export const init = (items) => generateCartState({}, items)
