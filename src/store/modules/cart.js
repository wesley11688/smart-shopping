import { getCartList, updateCart, deleteCart } from '@/api/cart'
export default {
  namespaced: true,
  state () {
    return {
      cartList: []
    }
  },
  actions: {
    async getCartAction (context) {
      const { data } = await getCartList()
      data.list.forEach(item => {
        item.isChecked = true
      })
      context.commit('setCartList', data.list)
    },
    async changeCountAction (context, { goodsNum, goodsId, goodsSkuId }) {
      await updateCart(goodsId, goodsNum, goodsSkuId)
      context.commit('changeCount', { goodsNum, goodsId })
    },
    async deleteCartAction (context, { cartIds }) {
      await deleteCart(cartIds)
      context.commit('deleteCart', { cartIds })
    }
  },
  mutations: {
    setCartList (state, newList) {
      state.cartList = newList
    },
    // 修改某一筆商品的數量
    changeCount (state, { goodsNum, goodsId }) {
      const item = state.cartList.find(item => item.goods_id === goodsId)
      if (item) {
        item.goods_num = goodsNum
      }
    },
    // 把 id 在 cartIds 裡的那幾筆從列表移除
    deleteCart (state, { cartIds }) {
      state.cartList = state.cartList.filter(item => !cartIds.includes(item.id))
    },
    toggleCheckAction (state, goodsId) {
      const item = state.cartList.find(item => item.goods_id === goodsId)
      if (item) {
        item.isChecked = !item.isChecked
      }
    },
    toggleCheckAllAction (state, value) {
      state.cartList.forEach(item => {
        item.isChecked = value
      })
    }
  },
  getters: {
    // 求所有商品累加和
    cartTotal (state) {
      return state.cartList.reduce((sum, item) => {
        return sum + item.goods_num
      }, 0)
    },
    selCartList (state) {
      return state.cartList.filter(item => item.isChecked)
    },
    selCartTotal (state, getters) {
      return getters.selCartList.reduce((sum, item) => {
        return sum + item.goods_num
      }, 0)
    },
    selCartPrice (state, getters) {
      return getters.selCartList.reduce((sum, item) => {
        return sum + item.goods_num * item.goods.goods_price_min
      }, 0).toFixed(2)
    },
    isAllChecked (state) {
      return state.cartList.every(item => item.isChecked)
    }
  }
}
