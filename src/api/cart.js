import instance from '@/utils/request'

export const addCart = (goodsId, goodsNum, goodsSkuId) => {
  return instance.post('/cart/add', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}

export const getCartList = () => {
  return instance.get('/cart/list')
}
