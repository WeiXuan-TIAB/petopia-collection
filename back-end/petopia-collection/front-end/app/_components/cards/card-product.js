import Image from "next/image"
import BtnLike from "../buttons/btn-like"
import BtnShop from "../buttons/btn-shop"
import Link from "next/link"

export default function CardProduct({ id, mainImage, product_name, price, productVar }) {

  const handleButtonClick = (e) => {
    e.preventDefault(); // 阻止 Link 的默認行為
    e.stopPropagation(); // 阻止事件冒泡
  };
  return (
    <Link
      href={`/product/info/${id}`}
      title={product_name}>
      <div className="flex flex-col items-center justify-center p-4 gap-2">
        <div className="relative w-full aspect-square rounded-2xl md:rounded-5xl overflow-hidden group">
          <Image
            src={mainImage ?? '/images/placeholder.png'}
            alt={product_name}
            width={600}
            height={600}
            className="w-full select-none hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute hidden md:flex bottom-2 left-1/2 -translate-x-1/2 gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => handleButtonClick(e, 'shop')}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleButtonClick(e, "shop");
                }
              }}>
              <BtnShop
                style="icon"
                productId={id}
                productName={product_name}
                price={price}
                mainImage={mainImage}
                specs={productVar}   // 只有顏色+尺寸
              />
            </div>
            <div
              role="button"
              tabIndex={0} onClick={(e) => handleButtonClick(e, 'like')}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleButtonClick(e, "like");
                }
              }}>
              <BtnLike
                productId={id}
                productName={product_name}
                productData={{
                  id,
                  product_name,
                  price,
                  mainImage,
                }}
              />
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-center">
          <div className="w-full text-fp-h5 text-center truncate">{product_name}</div>
          <div className="w-full text-fp-body text-center">NT$ {price}</div>
        </div>
      </div>
    </Link>
  )
}