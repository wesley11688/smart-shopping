<template>
  <div class="user">
    <!-- 1. 個人資訊：已登入顯示暱稱、手機號碼；沒登入顯示「點擊登入」，點了跳登入頁
         （user/info 的 avatar 目前是 null，頭像先固定用圖示） -->
    <div class="head-page" v-if="isLogin">
      <div class="head-img">
        <van-icon name="contact" class="avatar-icon" />
      </div>
      <div class="info">
        <p class="name">{{ detail.nick_name }}</p>
        <p class="mobile">{{ detail.mobile }}</p>
      </div>
    </div>
    <div class="head-page" v-else @click="$router.push('/login')">
      <div class="head-img">
        <van-icon name="contact" class="avatar-icon" />
      </div>
      <div class="info">
        <p class="name">點擊登入</p>
        <p class="mobile">登入後查看訂單和資產</p>
      </div>
      <van-icon name="arrow" class="arrow" />
    </div>

    <!-- 2. 我的資產：餘額、積分來自 user/info；接口沒有優惠券數量，先固定 0
         沒登入時 detail 是空物件，用 || 顯示 0 -->
    <div class="card my-asset">
      <div class="asset-item">
        <span class="num">{{ detail.balance || '0.00' }}</span>
        <span class="label">帳戶餘額</span>
      </div>
      <div class="asset-item">
        <span class="num">{{ detail.points || 0 }}</span>
        <span class="label">積分</span>
      </div>
      <div class="asset-item">
        <span class="num">0</span>
        <span class="label">優惠券</span>
      </div>
      <div class="asset-item">
        <van-icon name="balance-pay" class="asset-icon" />
        <span class="label">我的錢包</span>
      </div>
    </div>

    <!-- 3. 我的訂單：點擊跳 /myorder，用 query.dataType 帶分類，訂單頁的 active 會讀它
         沒登入時，/myorder 在 authUrls 裡，路由守衛會擋下並跳登入頁 -->
    <div class="card order-navbar">
      <div class="card-head">
        <span class="title">我的訂單</span>
        <span class="more" @click="$router.push('/myorder?dataType=all')">全部訂單<van-icon name="arrow" /></span>
      </div>
      <div class="order-grid">
        <div class="order-item" @click="$router.push('/myorder?dataType=all')">
          <van-icon name="orders-o" class="order-icon" />
          <span>全部</span>
        </div>
        <div class="order-item" @click="$router.push('/myorder?dataType=payment')">
          <van-icon name="balance-list-o" class="order-icon" />
          <span>待支付</span>
        </div>
        <div class="order-item" @click="$router.push('/myorder?dataType=delivery')">
          <van-icon name="logistics" class="order-icon" />
          <span>待發貨</span>
        </div>
        <div class="order-item" @click="$router.push('/myorder?dataType=received')">
          <van-icon name="send-gift-o" class="order-icon" />
          <span>待收貨</span>
        </div>
      </div>
    </div>

    <!-- 4. 我的服務：一列四個；目前只有「收貨地址」有頁面，其他還沒做 -->
    <div class="card service">
      <div class="card-head">
        <span class="title">我的服務</span>
      </div>
      <div class="service-grid">
        <div class="service-item" @click="$router.push('/address')">
          <van-icon name="location-o" class="service-icon" />
          <span>收貨地址</span>
        </div>
        <div class="service-item">
          <van-icon name="gift-o" class="service-icon" />
          <span>領券中心</span>
        </div>
        <div class="service-item">
          <van-icon name="coupon-o" class="service-icon" />
          <span>優惠券</span>
        </div>
        <div class="service-item">
          <van-icon name="question-o" class="service-icon" />
          <span>我的幫助</span>
        </div>
        <div class="service-item">
          <van-icon name="balance-o" class="service-icon" />
          <span>我的積分</span>
        </div>
        <div class="service-item">
          <van-icon name="refund-o" class="service-icon" />
          <span>退換／售後</span>
        </div>
      </div>
    </div>

    <!-- 5. 登出按鈕：登入後才顯示，點擊先確認，再清掉使用者資料和購物車 -->
    <div class="logout-btn" v-if="isLogin">
      <button @click="logout">登出</button>
    </div>
  </div>
</template>

<script>
import { userInfoDetail } from '@/api/user.js'

export default {
  name: 'UserIndex',
  data () {
    return {
      detail: {} // user/info 回來的使用者資料（nick_name、mobile、balance、points…）
    }
  },
  computed: {
    // 有 token 就算已登入（token 在根 store 的 getters）
    isLogin () {
      return this.$store.getters.token
    }
  },
  created () {
    // 沒登入時不發請求，否則後端會回「請先登入」
    if (this.isLogin) {
      this.getUserInfoDetail()
    }
  },
  methods: {
    async getUserInfoDetail () {
      const { data: { userInfo } } = await userInfoDetail()
      this.detail = userInfo
    },
    logout () {
      this.$dialog.confirm({
        title: '溫馨提示',
        message: '確定要登出嗎？'
      }).then(() => {
        // 清掉使用者資料（store 和 localStorage）和購物車，畫面會因為 isLogin 變成 false 切回「點擊登入」
        this.$store.dispatch('user/logout')
        this.detail = {}
      }).catch(() => {
        // 按取消時 Promise 會 reject，這裡接住，不然會跳出錯誤遮罩
      })
    }
  }
}
</script>

<style lang="less" scoped>
// Apple 風格：白底、系統字、淺灰圓角，強調色只用 Apple 藍
@text: #1d1d1f;
@muted: #6e6e73;
@card: #f5f5f7;
@blue: #0071e3;

.user {
  min-height: 100vh;
  // 底部留出 tabbar 的高度（50px），內容才不會被蓋住
  padding: 0 12px 74px;
  box-sizing: border-box;
  background: @card;
  color: @text;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang TC', 'Helvetica Neue', sans-serif;
}

p {
  margin: 0;
}

// 1. 個人資訊：頭像靠左、文字在中間、箭頭靠右
.head-page {
  display: flex;
  align-items: center;
  padding: 40px 4px 24px;
  .head-img {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    margin-right: 14px;
    overflow: hidden;
    background: #fff;
    border-radius: 50%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .avatar-icon {
      font-size: 36px;
      color: #c7c7cc;
    }
  }
  .info {
    flex: 1;
    min-width: 0;
    .name {
      font-size: 22px;
      font-weight: 600;
      letter-spacing: -0.3px;
    }
    .mobile {
      margin-top: 4px;
      font-size: 14px;
      color: @muted;
    }
  }
  .arrow {
    font-size: 16px;
    color: #c7c7cc;
  }
}

// 白色圓角卡片（資產、訂單、服務共用）
.card {
  margin-bottom: 12px;
  padding: 0 16px;
  background: #fff;
  border-radius: 14px;
}

// 卡片標題列：標題靠左、「全部訂單」靠右
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0 4px;
  .title {
    font-size: 16px;
    font-weight: 600;
  }
  .more {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: @muted;
  }
}

// 2. 我的資產：四欄平分，數字在上、文字在下
.my-asset {
  display: flex;
  padding: 18px 0;
  .asset-item {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    min-width: 0; // flex 子項預設不會縮到比內容窄，餘額數字很長時會撐出卡片
    .num {
      max-width: 100%;
      height: 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 17px;
      font-weight: 600;
      line-height: 24px;
    }
    .asset-icon {
      height: 24px;
      font-size: 22px;
      line-height: 24px;
      color: @blue;
    }
    .label {
      margin-top: 6px;
      font-size: 12px;
      color: @muted;
    }
  }
}

// 3. 我的訂單：四欄平分，圖示在上、文字在下
.order-grid {
  display: flex;
  padding: 12px 0 16px;
  .order-item {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    font-size: 13px;
    &:active {
      opacity: 0.6;
    }
    .order-icon {
      margin-bottom: 8px;
      font-size: 26px;
      color: @text;
    }
  }
}

// 4. 我的服務：一列四個，多的自動換行
.service-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 8px 0 4px;
  .service-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 25%;
    padding: 10px 0 14px;
    font-size: 12px;
    color: @text;
    &:active {
      opacity: 0.6;
    }
    .service-icon {
      margin-bottom: 8px;
      font-size: 24px;
      color: @blue;
    }
  }
}

// 5. 登出按鈕：白底膠囊、紅字（Apple 設定頁的危險操作用紅色）
.logout-btn {
  margin-top: 24px;
  button {
    display: block;
    width: 100%;
    height: 46px;
    font-size: 16px;
    color: #ff3b30;
    background: #fff;
    border: none;
    border-radius: 14px;
    &:active {
      opacity: 0.7;
    }
  }
}
</style>
