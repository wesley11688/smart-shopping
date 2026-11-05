import instance from '@/utils/request'

export const checkOrder = (mode, obj) => {
  return instance.get('/checkout/order', {
    params: {
      mode,
      delivery: 10,
      couponId: 0,
      isUsePoint: false,
      ...obj
    }
  })
}

export const submitOrder = (mode, obj) => {
  return instance.post('/checkout/submit', {
    mode,
    delivery: 10,
    couponId: 0,
    isUsePoint: false,
    payType: 10,
    ...obj
  })
}

export const getOrderList = (dataType, page) => {
  return instance.get('/order/list', {
    params: {
      dataType,
      page
    }
  })
}
