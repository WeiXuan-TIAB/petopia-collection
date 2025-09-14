"use client"
import { createContext, useContext, useReducer, useEffect, useRef } from "react"
import {
  initState,
  addOne,
  removeOne,
  updateOne,
  findOneById,
  incrementOne,
  decrementOne,
  generateCartState,
  normalizeItem
} from "./cart-reducer-state"

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      return generateCartState(state, addOne(state.items, normalizeItem(action.payload)))
    case "REMOVE_ITEM":
      return generateCartState(state, removeOne(state.items, action.payload))
    case "UPDATE_ITEM":
      return generateCartState(state, updateOne(state.items, normalizeItem(action.payload)))
    case "UPDATE_QTY": {
      const item = findOneById(state.items, action.payload.id)
      if (!item.id) return state
      return generateCartState(
        state,
        updateOne(state.items, { ...item, quantity: action.payload.quantity })
      )
    }
    case "INCREMENT":
      return generateCartState(state, incrementOne(state.items, action.payload))
    case "DECREMENT":
      return generateCartState(state, decrementOne(state.items, action.payload))
    case "CLEAR":
      return initState
    default:
      return state
  }
}

export function CartProvider({ children, localStorageKey = "cart" }) {
  // 初始化 state：先讀 localStorage，如果格式錯誤就用 initState
  const [state, dispatch] = useReducer(
    cartReducer,
    initState,
    (init) => {
      if (typeof window !== "undefined") {
        try {
          const stored = JSON.parse(window.localStorage.getItem(localStorageKey))

          if (stored && typeof stored === "object" && Array.isArray(stored.items)) {
            return stored
          }
        } catch (e) {
          console.error("Failed to load cart from localStorage", e)
        }
      }
      return init
    }
  )
  const skipNextPersistRef = useRef(false)


  // 每次 state 改變就同步到 localStorage
  useEffect(() => {
    if (skipNextPersistRef.current) {
      skipNextPersistRef.current = false
      return // ← 這一輪不寫入 localStorage
    }
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(localStorageKey, JSON.stringify(state))
      } catch (e) {
        console.error("Failed to save cart to localStorage", e)
      }
    }
  }, [state, localStorageKey])

  return (
    <CartContext.Provider
      value={{
        cart: state,
        items: state.items ?? [],   // ⬅ 防呆，保證至少是 []
        addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
        removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
        updateItem: (item) => dispatch({ type: "UPDATE_ITEM", payload: item }),
        updateItemQty: (id, quantity) =>
          dispatch({ type: "UPDATE_QTY", payload: { id, quantity } }),
        increment: (id) => dispatch({ type: "INCREMENT", payload: id }),
        decrement: (id) => dispatch({ type: "DECREMENT", payload: id }),
        clearCart: () => dispatch({ type: "CLEAR" }),
        clearCartViewOnly: () => {
          // 下次 state 變動不要寫回 localStorage
          skipNextPersistRef.current = true
          dispatch({ type: "CLEAR" })
        },
        }}>
        { children }
    </ CartContext.Provider>
      )
}
export const useCart = () => useContext(CartContext)
