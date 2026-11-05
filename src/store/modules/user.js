import { getInfo, setInfo } from '@/utils/storages'

export default {
  namespaced: true,
  state () {
    return {
      userInfo: getInfo()
    }
  },
  mutations: {
    setUserInfo (state, obj) {
      state.userInfo = obj
      setInfo(obj)
    }
  },
  actions: {
    // 登出：使用者資料重設成預設值（同時寫回 localStorage），購物車清空
    // cart 是另一個模組，commit 它的 mutation 要加 { root: true }，名稱從根開始寫
    logout (context) {
      context.commit('setUserInfo', { token: '', userId: '' })
      context.commit('cart/setCartList', [], { root: true })
    }
  },
  getters: {
  }
}
