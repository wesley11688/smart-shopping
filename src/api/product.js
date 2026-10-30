import instance from '@/utils/request'

export const getProList = (params) => {
  const { categroyId, goodsName, page } = params
  return instance.get('/goods/list', {
    params: {
      categroyId,
      goodsName,
      page
    }
  })
}
