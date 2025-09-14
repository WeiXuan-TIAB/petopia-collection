"use client"
import CatShopcart from "../icon/cat-shopcart"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { IoPaw } from "react-icons/io5"
import { useCart } from "@/hooks/use-cart-state/cart-provider"

export default function BtnShop({
  style = "",
  productId,
  productName = "",
  price = 0,
  qty=1,
  mainImage = "/images/product/placeholder.png",
  specs = {},   // 接收規格資料（可能有 flavor/size/color）
}) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    // 預設選第一個規格（如果有的話）
    const newItem = {
      id: productId,
      quantity: qty? qty:1,
      product_name: productName,
      price,
      mainImage,
      color: specs.color?  specs.color: "",
      size: specs.size? specs.size: "",
      flavor: specs.flavor?  specs.flavor: "",
    }

    addItem(newItem)

    toast(
      <div className="text-text-primary-primary pe-4 flex justify-between items-center">
        <div>
          <p>{productName}</p>
            {newItem.color && <p>顏色: {newItem.color}</p>}
            {newItem.size && <p>尺寸: {newItem.size}</p>}
            {newItem.flavor && <p>口味: {newItem.flavor}</p>}
          <p>已加入購物車!</p>
        </div>
        <IoPaw className="text-text-primary" />
      </div>,
      {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    )
  }

  return (
    <>
      {style === "icon" ?
        <button
          onClick={handleAddToCart}
          className="w-9 h-9  text-white hover:text-button-secondary bg-button-secondary hover:bg-white border-none hover:border-solid border-2 border-button-secondary  rounded-full flex justify-center items-center transition-colors duration-300">
          <CatShopcart className=" transition-colors duration-300" /></button>
        :
        <button
          onClick={handleAddToCart}
          className="w-fill h-fill  text-white hover:text-button-primary bg-button-primary  hover:bg-white border-2 border-solid   border-border-primary  rounded-full py-2 px-5  transition-colors duration-300">
          <p>加入購物車</p>
        </button>
      }

    </>

  )
}