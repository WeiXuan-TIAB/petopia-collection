import prisma from '../lib/prisma.js'
import _ from 'lodash'
import { z } from 'zod'

import { validatedParamId, safeParseBindSchema } from '../lib/utils.js'

// #region 建立驗證格式用函式
// 建立商品資料的驗證用的schema物件
const productSchema = {}
// 條件的驗証用的schema
productSchema.conditions = z.object({
  nameLike: z.string().optional(),
  mainCategoryId: z.union([z.string(), z.number()]).optional(),
  subCategoryId: z.union([z.string(), z.number()]).optional(),
  mainCategoryName: z.string().optional(),
  subCategoryName: z.string().optional(),
  priceGte: z.union([z.string(), z.number()]).optional(),
  priceLte: z.union([z.string(), z.number()]).optional(),
});
// 排序的驗証用的schema
productSchema.sortBy = z.object({
  sort: z.enum(['id', 'price']),
  order: z.enum(['asc', 'desc']),
})
const sortMap = {
  newDescend: { sort: 'id', order: 'desc' },
  soldDescend: { sort: 'sold_count', order: 'desc' },
  priceAsc: { sort: 'price', order: 'asc' },
  priceAscend: { sort: 'price', order: 'desc' }
}

// 綁定驗證用的schema的檢查函式
const productSchemaValidator = safeParseBindSchema(productSchema)
// #endregion

// --- 條件生成器 ---
const generateWhere = (conditions) => {
  const andConditions = []

  // 商品名稱模糊搜尋
  if (conditions.nameLike) {
    andConditions.push({
      product_name: {
        contains: conditions.nameLike
      }
    })
  }

  // 主分類多選
  if (conditions.mainCategoryId) {
    const ids = Array.isArray(conditions.mainCategoryId)
      ? conditions.mainCategoryId
      : conditions.mainCategoryId.toString().split(',').map(Number)

    andConditions.push({
      OR: ids.map(id => ({
        OR: [
          { cat_id: id },
          { categories: { parent_id: id } }
        ]
      }))
    })
  }

  // 子分類多選
  if (conditions.subCategoryName) {
    const names = Array.isArray(conditions.subCategoryName)
      ? conditions.subCategoryName
      : conditions.subCategoryName.toString().split(',')

    andConditions.push({
      OR: names.map(name => ({
        categories: { name, parent_id: { not: null } }
      }))
    })
  }

  // --- 確保正確輸出 ---
  if (andConditions.length === 0) {
    return {}
  }
  if (andConditions.length === 1) {
    return andConditions[0]   // 只有一個條件就直接回傳
  }
  return { AND: andConditions }
}


// 取得商品總筆數
export const getProductsCount = async (conditions = {}) => {
  if (conditions.subCategoryName && !conditions.mainCategoryId) {
    const mains = await prisma.categories.findMany({
      where: { parent_id: null },
      select: { id: true }
    })
    conditions.mainCategoryId = mains.map(m => m.id)
  }

  const where = generateWhere(conditions)

  // 先找出符合條件的商品 ID
  const ids = await prisma.products.findMany({
    where,
    select: { id: true },
  })

  // 再用 id count，避免 Prisma relation 條件計算膨脹
  const count = await prisma.products.count({
    where: { id: { in: ids.map(p => p.id) } }
  })

  // 🔍 Debug
  console.log(`[DEBUG getProductsCount] conditions=`, conditions)
  console.log(`[DEBUG getProductsCount] foundIds=`, ids.length, `count=`, count)

  return count
}


// 取得所有商品資料
// --- getProducts ---
export const getProducts = async (conditions, page, perPage, sort, order) => {
  const where = generateWhere(conditions)

  const products = await prisma.products.findMany({
    where,
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { [sort]: order },
    include: {
      categories: true,
      product_images: {
        where: { img_type: 'main' },
        select: { img_url: true }
      },
      product_variants: {
        include: {
          product_colors: { select: { color_name: true } },
          product_sizes: { select: { size_name: true } },
          product_flavors: { select: { flav_name: true } },
        }
      }
    }
  })

  return products.map(p => {
    const firstVariant = p.product_variants[0]
    const firstColor = firstVariant?.product_colors?.color_name || ""
    const firstSize = firstVariant?.product_sizes?.size_name || ""
    const firstFlavor = firstVariant?.product_flavors?.flav_name || ""

    return {
      id: p.id,
      product_name: p.product_name,
      price: p.price,
      categories: p.categories,
      mainImage: p.product_images[0]?.img_url || "/images/product/placeholder.png",
      defaultSpec: {
        color: firstColor,
        size: firstSize,
        flavor: firstFlavor
      }
    }
  })
}

// 取得單筆商品資料
export const getProductById = async (productId) => {
  // 驗證參數是否為正整數
  validatedParamId(productId)

  const p = await prisma.products.findUnique({
    where: { id: productId },
    include: {
      product_variants: {
        include: {
          product_colors: { select: { color_name: true } },
          product_sizes: { select: { size_name: true } },
          product_flavors: { select: { flav_name: true } },
          product_images: { select: { img_url: true, img_type: true } },
        },
      },
    },
  })

  if (!p) throw new Error('資料不存在');

  // 規格去重聚合
  const colors = Array.from(
    new Set(
      p.product_variants
        .filter(v => v.product_colors)
        .map(v => v.product_colors.color_name)
    )
  )

  const sizes = Array.from(
    new Set(
      p.product_variants
        .filter(v => v.product_sizes)
        .map(v => v.product_sizes.size_name)
    )
  )

  const flavors = Array.from(
    new Set(
      p.product_variants
        .filter(v => v.product_flavors)
        .map(v => v.product_flavors.flav_name)
    )
  )

  // 依 img_type 分組
  const allImgs = p.product_variants.flatMap(v => v.product_images);
  const mainImage =
    allImgs.find(img => img.img_type === 'main')?.img_url || null;
  const minorImages =
    allImgs.filter(img => img.img_type === 'minor').map(i => i.img_url);
  const descImages =
    allImgs.filter(img => img.img_type === 'desc').map(i => i.img_url);

  return {
    id: p.id,
    product_name: p.product_name,
    product_desc: p.product_desc,
    price: p.price,
    specs: { colors, sizes, flavors }, // 規格選項
    images: {
      main: mainImage,       // 主圖（單張）
      minor: minorImages,    // 副圖（多張）
      desc: descImages,      // 商品介紹圖（多張）
    },
  };
};

// 取得單筆商品評論
export const getProductReviews = async (productId) => {
  validatedParamId(productId)
  const reviews = await prisma.product_reviews.findMany({
    where: { product_id: productId },
    select: {
      rating: true,
      review: true,
      created_at: true,
      members: {
        select: {
          nickname: true,
          avatar: true
        }
      }
    },
    orderBy: { created_at: 'asc' }
  })
  return reviews
}

// 熱銷商品
export const getHotProducts = async () => {
  const products = await prisma.products.findMany({
    where: {
      id: { in: [1, 2, 3] }
    },
    select: {
      id: true,
      product_name: true,
      price: true,
      product_images: {
        where: { img_type: "main" },
        select: { img_url: true }
      },
      product_variants: {
        select: {
          product_colors: { select: { color_name: true } },
          product_sizes: { select: { size_name: true } },
          product_flavors: { select: { flav_name: true } },
          product_images: { select: { img_url: true, img_type: true } }
        }
      }
    }
  })

  return products.map(product => {
    const firstVariant = product.product_variants[0]
    const firstColor = firstVariant?.product_colors?.color_name || ""
    const firstSize = firstVariant?.product_sizes?.size_name || ""
    const firstFlavor = firstVariant?.product_flavors?.flav_name || ""

    return {
      id: product.id,
      product_name: product.product_name,
      price: product.price,
      mainImage: product.product_images[0]?.img_url || null,
      defaultSpec: {
        color: firstColor,
        size: firstSize,
        flavor: firstFlavor
      }
    }
  })
}

// 推薦商品
export const getRecommendProducts = async () => {
  const recommendProducts = await prisma.products.findMany({
    where: { id: { in: [301, 302, 303, 304] } },
    select: {
      id: true,
      product_name: true,
      price: true,
      product_images: {
        where: { img_type: "main" },
        select: { img_url: true }
      },
      product_variants: {
        select: {
          product_colors: { select: { color_name: true } },
          product_sizes: { select: { size_name: true } },
          product_flavors: { select: { flav_name: true } },
          product_images: { select: { img_url: true, img_type: true } }
        }
      }
    }
  })

  return recommendProducts.map(product => {
    const firstVariant = product.product_variants[0]
    const firstColor = firstVariant?.product_colors?.color_name || ""
    const firstSize = firstVariant?.product_sizes?.size_name || ""
    const firstFlavor = firstVariant?.product_flavors?.flav_name || ""

    return {
      id: product.id,
      product_name: product.product_name,
      price: product.price,
      mainImage: product.product_images[0]?.img_url || null,
      defaultSpec: {
        color: firstColor,
        size: firstSize,
        flavor: firstFlavor
      }
    }
  })
}

// 取得會員喜愛商品
export const getMemberLikedProductIds = async (memberId) => {
  return await prisma.member_likes.findMany({
    where: { member_id: memberId },
    select: { product_id: true }
  });
};

// 取得會員喜愛商品（含主圖、id、名稱、價格）
export const getMemberLikedProducts = async (memberId) => {
  const likedRows = await prisma.member_likes.findMany({
    where: { member_id: memberId },
    include: {
      products: {
        select: {
          id: true,
          product_name: true,
          price: true,
          product_images: {
            where: { img_type: 'main' },
            select: { img_url: true }
          }
        }
      }
    }
  })

  return likedRows.map(r => ({
    id: r.products.id,
    product_name: r.products.product_name,
    price: r.products.price,
    mainImage: r.products.product_images[0]?.img_url || "/images/product/placeholder.png"
  }))
}

// 是否喜愛某商品（布林值）
export const isProductLikedByMember = async (memberId, productId) => {
  const liked = await prisma.member_likes.findUnique({
    where: { member_id_product_id: { member_id: memberId, product_id: productId } }
  });
  return !!liked; // true = 喜愛, false = 沒喜愛
};

// 加到最愛
export const addProductLike = async (memberId, productId) => {
  try {
    console.log("[addProductLike] 寫入", { memberId, productId })
    return await prisma.member_likes.create({
      data: { member_id: memberId, product_id: productId }
    })
  } catch (err) {
    console.error("[addProductLike] error", err)
    throw err
  }
}

// 取消最愛
export const removeProductLike = async (memberId, productId) => {
  return await prisma.member_likes.delete({
    where: {
      member_id_product_id: { member_id: memberId, product_id: productId }
    }
  });
};

// 取得所有分類資料（主分類 + 固定六個子分類）
export const getCategories = async () => {
  const mainCategories = await prisma.categories.findMany({
    where: { parent_id: null },
    select: { id: true, name: true },
    orderBy: { id: 'asc' }
  })

  const fixedSubNames = [
    '優質主食', '精選罐頭', '美味零食',
    '健康營養', '寵物用品', '美容護理'
  ]

  const rawSubs = await prisma.categories.findMany({
    where: { name: { in: fixedSubNames } },
    select: { id: true, name: true },
    orderBy: { id: 'asc' }
  })

  const subCategories = _.uniqBy(rawSubs, 'name')

  return { mainCategories, subCategories }
}