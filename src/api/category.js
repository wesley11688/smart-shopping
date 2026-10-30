import instance from '@/utils/request'

export const getCatList = () => {
  return instance.get('/category/list')
}
