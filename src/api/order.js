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

// 取消訂單／申請取消（同一支接口）：還沒付款會直接取消（order_status 20），
// 已付款還沒發貨會變成待取消（order_status 21），等商家審核
export const cancelOrder = (orderId) => {
  return instance.post('/order/cancel', {
    orderId
  })
}
