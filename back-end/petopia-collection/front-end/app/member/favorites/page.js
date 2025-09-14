'use client'
import { useProductState } from '@/services/rest-client/use-product'
import ProductGrid from '@/app/_components/cards/product-grid'

export default function FavoritesPage() {
  const { likedProducts } = useProductState()
  console.log(likedProducts)
  return (
    <div className="container max-w-3xl mx-auto p-6">
      <h1 className="text-3xl text-center mb-4">我的收藏</h1>

      {likedProducts.length > 0 ? (
        <ProductGrid products={likedProducts} />
      ) : (
        <div className="text-gray-500 text-lg text-center py-36">目前沒有收藏的商品 ( ´•̥̥̥ω•̥̥̥` )</div>
      )}
    </div>
  )
}
