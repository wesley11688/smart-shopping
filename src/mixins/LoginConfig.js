// 混入（mixin）：把多個組件都要用的 data、methods、生命週期抽出來，組件用 mixins: [LoginConfig] 引入後就像自己寫的一樣
// 這裡只放「判斷有沒有登入」的共用邏輯；加入購物車、立刻購買各自要做的事留在組件裡
export default {
  methods: {
    // 沒登入：跳提示框，回傳 true（呼叫的地方要 return，不要往下做）
    // 已登入：回傳 false
    loginConfirm () {
      if (!this.$store.getters.token) {
        this.$dialog.confirm({
          title: '溫馨提示',
          message: '需要先登入才能操作喔',
          confirmButtonText: '確認',
          cancelButtonText: '再逛逛'
        })
          .then(() => {
            // 帶上目前頁面的完整路徑，登入成功後跳回來
            this.$router.replace({
              path: '/login',
              query: {
                backUrl: this.$route.fullPath
              }
            })
          })
          .catch(() => {})
        return true
      }
      return false
    }
  }
}
