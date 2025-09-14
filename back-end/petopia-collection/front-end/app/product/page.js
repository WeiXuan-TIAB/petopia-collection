'use client'
import '@/styles/globals.css'
import styles from '../../hooks/use-loader/assets/loader.module.scss'
import catAnimation from "../../hooks/use-loader/assets/loader-cat.json"
import dynamic from 'next/dynamic'
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })
import { useState, useMemo, useEffect } from 'react'
import ProductGrid from '@/app/_components/cards/product-grid'
import CardAnimalGroup from '@/app/_components/cards/card-animal-group'
import Banner from '@/app/_components/banner'
import Breadcrumb from '../_components/breadcrumb'
import CategorySidebar from '../_components/category-sidebar'
import LoadingGrid from '../_components/cards/loading-grid'
import { FaSearch } from "react-icons/fa";
import SelectedTags from '../_components/selected-tags'
import { PetopiaPagination } from '@/app/_components/petopia-pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/ui/select'
import { useGetProductList, useGetProductCategories } from '@/services/rest-client/use-product'

export default function ProductListPage() {
  const [selectedMainCatIds, setSelectedMainCatIds] = useState([])
  const [selectedSubCatNames, setSelectedSubCatNames] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [tempKeyword, setTempKeyword] = useState("")
  const [keyword, setKeyword] = useState("")
  const [sortBy, setSortBy] = useState("id")
  const [order, setOrder] = useState("asc")
  const [page, setPage] = useState(1)

  // 建立查詢字串
  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    if (selectedMainCatIds.length > 0) {
      params.set("mainCategoryId", selectedMainCatIds.join(","))
    }
    if (selectedSubCatNames.length > 0) {
      params.set("subCategoryName", selectedSubCatNames.join(","))
    }
    if (keyword) params.set("nameLike", keyword)
    if (sortBy) params.set("sort", sortBy)
    if (order) params.set("order", order)
    params.set("page", page)
    params.set("perPage", 16)
    return params.toString()
  }, [selectedMainCatIds, selectedSubCatNames, keyword, sortBy, order, page])

  const { products, total, pageCount, isLoading } = useGetProductList(queryString)
  useEffect(() => {
    setPage(1)
  }, [selectedMainCatIds, selectedSubCatNames, keyword, sortBy, order])

  useEffect(() => {
    // 切換分頁時自動捲回最上方
    window.scrollTo({
      top: 0,
      behavior: "smooth"   // 平滑捲動
    })
  }, [page])


  const handleSelectMainCategory = (mainId) => {
    // 找出主分類名稱
    const mainCat = mainCategories.find(c => c.id === mainId)
    if (!mainCat) return

    // 使用 toggleMainCat 來確保 tags 跟 sidebar 同步
    toggleMainCat(mainId, mainCat.name)
    // 切換動物卡片時清空子分類
    setSelectedSubCatNames([])
  }

  const { mainCategories, subCategories } = useGetProductCategories()

  const categories = [
    { name: '寵物專區', subCategories: mainCategories },
    { name: '商品類別', subCategories: subCategories }
  ]

  const toggleMainCat = (id, name) => {
    setSelectedMainCatIds(prev =>
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    )
    setSelectedTags(prev =>
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]
    )
  }

  const toggleSubCat = (id, name) => {
    setSelectedSubCatNames(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
    setSelectedTags(prev =>
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]
    )
  }

  const removeTag = (name) => {
    setSelectedTags(prev => prev.filter(t => t !== name))
    const mainCat = mainCategories.find(c => c.name === name)
    if (mainCat) setSelectedMainCatIds(prev => prev.filter(id => id !== mainCat.id))
    // 子分類這裡改用 name
    const subCat = subCategories.find(sc => sc.name === name)
    if (subCat) setSelectedSubCatNames(prev => prev.filter(n => n !== name))
  }
  useEffect(() => {
    if (tempKeyword === "") {
      setKeyword("")
    }
  }, [tempKeyword])

  const handleSearch = () => {
    if (!tempKeyword.trim()) return
    setKeyword(tempKeyword.trim())
  }


  return (
    <>
      <div className="w-full px-4 py-4 lg:py-8">
        <section className='container max-w-7xl mx-auto mb-16'>
          <div className='mb-16'>
            <Breadcrumb />
            <Banner imgUrl='/images/product/product_banner.png' title='' />
          </div>
          <CardAnimalGroup onSelect={handleSelectMainCategory} />
        </section>
        <section className='container max-w-7xl mx-auto mb-16 flex flex-row gap-6'>
          <div className='hidden md:block'>
            <CategorySidebar
              categoryInfos={categories}
              selectedMainCatIds={selectedMainCatIds}
              selectedSubCatNames={selectedSubCatNames}
              onToggleMainCat={toggleMainCat}
              onToggleSubCat={toggleSubCat}
            />
          </div>

          <div className='w-full'>
            <div className="w-full h-auto md:h-20 flex flex-row md:flex-col justify-center md:items-between">
              <div className='flex flex-col-reverse md:flex-row items-center md:justify-between gap-4 md:gap-0'>
                <div className="text-lg flex">{total} 項商品 / 共 {pageCount} 頁</div>
                <div className='pb-2 flex flex-col md:flex-row items-center gap-2 md:gap-6'>
                  <label htmlFor="keyword" className='relative'>
                    <input
                      id="keyword"
                      type="search"
                      value={tempKeyword}
                      placeholder="請輸入關鍵字搜尋"
                      onChange={(e) => setTempKeyword(e.target.value)}
                      onInput={(e) => {
                        const value = e.target.value
                        setTempKeyword(value)
                        if (value === "") {
                          handleSearch()
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleSearch()
                        }
                      }}
                      className=" h-9 w-full px-5 pe-10 rounded-full focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <FaSearch
                      onClick={handleSearch}
                      className="absolute right-4 top-[10px] text-primary2 transition-colors cursor-pointer" />
                  </label>
                  <Select
                    value={`${sortBy}-${order}`}
                    onValueChange={(value) => {
                      const [sort, ord] = value.split("-")
                      setSortBy(sort)
                      setOrder(ord)
                    }}
                  >
                    <SelectTrigger className="border-none bg-white rounded-full overflow-hidden px-4 py-2 outline-none text-sm text-gray-400 w-40">
                      <SelectValue placeholder="排序方式" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-sm">
                      <SelectItem className="hover:bg-primary/10" value="id-desc">最新上架</SelectItem>
                      <SelectItem className="hover:bg-primary/10" value="id-asc">熱門商品</SelectItem>
                      <SelectItem className="hover:bg-primary/10" value="price-asc">價格由低至高</SelectItem>
                      <SelectItem className="hover:bg-primary/10" value="price-desc">價格由高至低</SelectItem>
                    </SelectContent>
                  </Select>

                </div>
              </div>
              <div className='hidden md:block'>
                <SelectedTags selectedSubs={selectedTags} onRemoveTag={removeTag} />
              </div>

            </div>
            <div className="w-full flex flex-row flex-wrap">
              {isLoading ? (
                <LoadingGrid />
              ) :
                products.length > 0 ? (
                  <>
                    <ProductGrid products={products} />
                    <PetopiaPagination
                      currentPage={page}
                      pageCount={pageCount}
                      onPageChange={setPage}
                      className='pt-6'
                    />
                  </>
                ) : (
                  <div className="w-full text-center pt-24 text-gray-400">
                    <Lottie
                      className={styles['cat-loader']}
                      animationData={catAnimation}
                    />
                    <p className="text-lg">查無商品，請嘗試其他關鍵字或條件。</p>
                  </div>
                )}
            </div>
          </div>
        </section>

      </div>
    </>
  )
}



/*  {products.length > 0 ? (
    <>
      <ProductGrid products={products} />
      <PetopiaPagination
        currentPage={page}
        pageCount={pageCount}
        onPageChange={setPage}
        className='pt-6'
      />
    </>
  ) : (
    <div className="w-full text-center pt-24 text-gray-400">
      <Lottie
        className={styles['cat-loader']}
        animationData={catAnimation}
      />
      <p className="text-lg">查無商品，請嘗試其他關鍵字或條件。</p>
    </div>
  )}*/