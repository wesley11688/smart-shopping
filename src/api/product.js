import instance from '@/utils/request'

export const getProList = (params) => {
  const { categoryId, goodsName, page } = params
  return instance.get('/goods/list', {
    params: {
      categoryId,
      goodsName,
      page
    }
  })
}

// 获取商品详情
// 寫法 B：參數直接收 id，比較簡單
export const getProDetail = (id) => {
  return instance.get('/goods/detail', {
    params: {
      goodsId: id
    }
  })
}

// 獲取商品評價
export const getProComment = (goodsId, limit) => {
  return instance.get('/comment/listRows', {
    params: {
      goodsId,
      limit
    }
  })
}
