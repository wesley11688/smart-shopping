import instance from '@/utils/request'

export const userInfoDetail = () => {
  return instance.get('/user/info')
}
