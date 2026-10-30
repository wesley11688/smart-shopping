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
