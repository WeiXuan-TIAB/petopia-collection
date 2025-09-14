import Image from "next/image";
import BtnShop from "../../_components/buttons/btn-shop";
import Link from "next/link";

export default function ProductItem({ product = {} }) {
  const { id = 1, mainImage = "/images/placeholder.png", product_name = "", price = "", specs } = product
  const handleButtonClick = (e) => {
    e.preventDefault(); // 阻止 Link 的默認行為
    e.stopPropagation(); // 阻止事件冒泡
  };
  return (
    <Link href={`/product/info/${id}`}>
      <div className="w-fill lg:w-[350px] flex flex-row items-center justify-center">
        <Image
          src={mainImage}
          alt={product_name}
          width={150}
          height={150}
          className="w-[150px] h-[150px] select-none hover:scale-105 transition-transform duration-500 rounded-3xl me-4 shadow-lg shadow-primary/20"
        />
        <div className="w-[45%]  h-[150px] flex flex-col justify-between items-start pt-4">
          <div className="self-stretch flex flex-col justify-start">
            <div className="text-start text-base font-fp-semibold ">{product_name}</div>
            <div className="text-start font-fp-semibold text-fp-h5 text-primary">NT$ {price}</div>
          </div>
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
              style="text"
              productName={product_name}
              productId={id}
              price={price}
              mainImage={mainImage}
              specs={specs}
            />
          </div>

        </div>
      </div>
    </Link>
  )
}