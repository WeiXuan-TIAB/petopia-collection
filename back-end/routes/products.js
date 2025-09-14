import express from 'express'
import authenticate from '../middlewares/authenticate.js'
import { parseProductConditions } from '../utils/filter.js'
const router = express.Router()

// 導入服務層的函式
import {
  getProducts,
  getProductById,
  getProductsCount,
  getCategories,
  getMemberLikedProductIds,
  isProductLikedByMember,
  addProductLike,
  removeProductLike,
  getProductReviews,
  getHotProducts,
  getRecommendProducts,
  getMemberLikedProducts
} from '../services/product.js'
// 導入回應函式
import { successResponse, errorResponse } from '../lib/utils.js'

// 取得商品總筆數
router.get('/count', async (req, res) => {
  try {
    const { perPage, conditions } = parseProductConditions(req.query)
    const total = await getProductsCount(conditions)
    const pageCount = Math.ceil(total / perPage)

    res.json({
      status: 'success',
      data: {
        total,
        pageCount
      }
    })
  } catch (error) {
    res.status(500).json({ error: '取得商品總筆數失敗' })
  }
})

// 得到所有商品資料
// 網址: /api/products
router.get('/', async (req, res) => {
  const type = (req.query.type || 'all').toString()
  const { page, perPage, conditions, sortBy } = parseProductConditions(req.query)
  console.log("[CHECK] conditions =", conditions)

  try {
    const [products, productCount] = await Promise.all([
      type !== 'count'
        ? getProducts(conditions, page, perPage, sortBy.sort, sortBy.order)
        : Promise.resolve([]),
      type !== 'data'
        ? getProductsCount(conditions)
        : Promise.resolve(0),
    ])

    let data
    if (type === 'data') {
      data = { products }
    } else if (type === 'count') {
      data = { total: productCount, pageCount: Math.ceil(productCount / perPage), page, perPage }
    } else {
      data = { total: productCount, pageCount: Math.ceil(productCount / perPage), page, perPage, products }
    }

    successResponse(res, data)
  } catch (error) {
  errorResponse(res, error)
}
})


// 取得主分類＋子分類
// GET /api/products/categories
router.get('/categories', async (req, res) => {
  try {
    const { mainCategories, subCategories } = await getCategories()
    successResponse(res, { mainCategories, subCategories })
  } catch (error) {
    errorResponse(res, error)
  }
})


// --- 喜愛商品（Liked）---
// 取得會員喜愛的商品 ID 清單
// GET /api/products/liked?member_id=123
router.get('/liked',authenticate, async (req, res) => {
  try {
    const memberId = req.user.id;
    if (!Number.isInteger(memberId) || memberId <= 0) {
      throw new Error('member_id 無效或未提供');
    }

    const rows = await getMemberLikedProductIds(memberId);
    const productIds = rows.map(r => r.product_id);
    successResponse(res, { memberId, productIds });
  } catch (error) {
    errorResponse(res, error);
  }
});

// 我的喜愛商品清單
// GET /api/products/liked/list
router.get('/liked/list', authenticate, async (req, res) => {
  try {
    const memberId = req.user.id
    const products = await getMemberLikedProducts(memberId)
    successResponse(res, { products })
  } catch (error) {
    errorResponse(res, error)
  }
})

// 熱銷商品 API
// api/products/hot
router.get('/hot', async (req, res) => {
  try {
    const products = await getHotProducts();
    res.json({ status: 'success', data: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 推薦商品 API
// api/products/recommend
router.get('/recommend', async (req, res) => {
  try {
    const products = await getRecommendProducts();
    res.json({ status: 'success', data: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 查詢「某商品是否被該會員喜愛」
// GET /api/products/:pid/liked?member_id=123
router.get('/:pid/liked',authenticate,  async (req, res) => {
  try {
    const productId = Number(req.params.pid);
    const memberId = req.user.id;
    if (!Number.isInteger(productId) || productId <= 0) throw new Error('productId 無效');
    if (!Number.isInteger(memberId) || memberId <= 0) throw new Error('member_id 無效或未提供');

    const liked = await isProductLikedByMember(memberId, productId);
    successResponse(res, { productId, memberId, liked });
  } catch (error) {
    errorResponse(res, error);
  }
});

// 加到最愛（idempotent）
// POST /api/products/:pid/liked   { memberId: 123 }
router.post('/:pid/liked',authenticate, async (req, res) => {
  try {
    const productId = Number(req.params.pid);
    const memberId = req.user.id;

    if (!Number.isInteger(memberId) || memberId <= 0) {
      return res.status(400).json({ status: 'error', message: 'memberId 無效或未提供' });
    }

    const already = await isProductLikedByMember(memberId, productId);
    if (!already) {
      await addProductLike(memberId, productId);
    }
    res.json({ status: 'success' });
  } catch (err) {
    console.error("[API add like error]", err);
    res.status(500).json({ status: 'error', message: err.message });
  }
})

// 取消最愛（idempotent）
// DELETE /api/products/:pid/liked   （可傳 body.memberId 或 query.member_id）
router.delete('/:pid/liked',authenticate, async (req, res) => {
  try {
    const productId = Number(req.params.pid);
    const memberId = req.user.id;
    if (!Number.isInteger(productId) || productId <= 0) throw new Error('productId 無效');
    if (!Number.isInteger(memberId) || memberId <= 0) throw new Error('memberId 無效或未提供');

    const liked = await isProductLikedByMember(memberId, productId);
    if (liked) {
      await removeProductLike(memberId, productId);
    }
    successResponse(res, { productId, memberId, liked: false, alreadyRemoved: !liked });
  } catch (error) {
    errorResponse(res, error);
  }
});


// 取得單筆商品
// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  const productId = Number(req.params.pid)
  try {
    const product = await getProductById(productId)
    successResponse(res, { product })
  } catch (error) {
    errorResponse(res, error)
  }
})

// 取得商品評論
// GET /api/products/:pid/reviews
router.get('/:pid/reviews', async (req, res) => {
  const productId = Number(req.params.pid)
  try {
    const reviews = await getProductReviews(productId)
    successResponse(res, { reviews })
  } catch (error) {
    errorResponse(res, error)
  }
})

export default router