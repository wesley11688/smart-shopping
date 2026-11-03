<template>
  <div class="cart">
    <!-- 1. 導覽列：fixed 固定在頂部，placeholder 在原位置留出同高的空白 -->
    <van-nav-bar @click-left="$router.go(-1)" title="購物車" left-arrow fixed placeholder />

    <!-- 2. 有商品時顯示（佔位：之後改成判斷購物車列表長度） -->
    <div v-if="true">
      <!-- 2-1. 資訊列：商品總數、編輯按鈕 -->
      <div class="cart-title">
        <span class="all">共 <i>{{ cartTotal }}</i> 件商品</span>
        <span @click="isEdit = !isEdit" class="edit">
          <van-icon name="edit" />
          編輯
        </span>
      </div>

      <!-- 2-2. 商品列表（佔位 2 筆，之後改成 v-for） -->
      <div class="cart-list">
        <div class="cart-item" v-for="item in cartList" :key="item.goods_id">
          <van-checkbox :value="item.isChecked" checked-color="#0071e3" @click="toggleCheck(item.goods_id)" />
          <div class="show">
            <img :src="item.goods.goods_image" alt="">
          </div>
          <div class="info">
            <span class="tit text-ellipsis-2">{{ item.goods.goods_name  }}</span>
            <span class="bottom">
              <div class="price">¥ <span>{{ item.goods.goods_price_min }}</span></div>
              <CountBox :value="item.goods_num" @input="(value) => { changeCount(value, item.goods_id, item.goods_sku_id) }"></CountBox>
            </span>
          </div>
        </div>
      </div>

      <!-- 2-3. 底部結算列：固定在 tabbar 上方 -->
      <div class="footer-fixed">
        <div class="all-check">
          <van-checkbox :value="isAllChecked" @click="toggleCheckAll" checked-color="#0071e3" icon-size="18" />
          全選
        </div>

        <div class="all-total">
          <div class="price">
            <span>合計：</span>
            <span>¥ <i class="totalPrice">{{ selCartPrice  }}</i></span>
          </div>
          <!-- 結算 / 刪除：isEdit 為 true 時顯示刪除 -->
          <div v-if="!isEdit" class="goPay" :class="{ disabled: selCartTotal === 0 }">結算({{ selCartTotal }})</div>
          <div v-else @click="handleDel" class="delete" :class="{ disabled: selCartTotal === 0 }">刪除({{ selCartTotal }})</div>
        </div>
      </div>
    </div>

    <!-- 3. 空購物車（佔位：先用 v-if="false" 藏起來） -->
    <div v-if="false" class="empty-cart">
      <van-icon name="shopping-cart-o" class="empty-icon" />
      <div class="tips">您的購物車是空的，快去逛逛吧</div>
      <div class="btn">去逛逛</div>
    </div>
  </div>
</template>

<script>
import CountBox from '@/components/CountBox.vue'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'CartIndex',
  components: {
    CountBox
  },
  data () {
    return {
      // 佔位：之後由編輯按鈕切換
      isEdit: false,
      count: 1
    }
  },
  created () {
    if (this.$store.getters.token) {
      this.$store.dispatch('cart/getCartAction')
    }
  },
  computed: {
    ...mapState('cart', ['cartList']),
    ...mapGetters('cart', ['cartTotal', 'selCartList', 'selCartTotal', 'selCartPrice', 'isAllChecked'])
  },
  methods: {
    // 編輯按鈕切換
    changeCount (goodsNum, goodsId, goodsSkuId) {
      this.$store.dispatch('cart/changeCountAction', { goodsNum, goodsId, goodsSkuId })
    },
    toggleCheck (goodsId) {
      this.$store.commit('cart/toggleCheckAction', goodsId)
    },
    // 全選：現在全勾就全部取消，否則全部勾上
    toggleCheckAll () {
      this.$store.commit('cart/toggleCheckAllAction', !this.isAllChecked)
    },
    handleDel () {
      if (this.selCartTotal === 0) return
      // 後端要的是每一筆購物車紀錄的 id 陣列
      const cartIds = this.selCartList.map(item => item.id)
      this.$store.dispatch('cart/deleteCartAction', { cartIds })
    }
  },
  watch: {
    // 進入編輯時全部取消勾選，離開編輯時全部勾回來
    isEdit (val) {
      this.$store.commit('cart/toggleCheckAllAction', !val)
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

.cart {
  min-height: 100vh;
  // 底部留出結算列（50px）+ tabbar（50px）的高度，最後一筆商品才不會被擋住
  padding-bottom: 100px;
  box-sizing: border-box;
  background: @card;
  color: @text;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang TC', 'Helvetica Neue', sans-serif;
}

// 加了 placeholder 後，組件最外層變成佔位的 div，.van-nav-bar 在它裡面，所以要從 .cart 往下穿透
.cart /deep/ .van-nav-bar {
  .van-nav-bar__title {
    color: @text;
    font-weight: 600;
  }
  // 返回箭頭：Vant 預設藍色，改成深色字
  .van-icon {
    color: @text;
  }
}

// 名稱最多兩行，超出用省略號
.text-ellipsis-2 {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

// 2-1. 資訊列
.cart-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  padding: 0 16px;
  font-size: 14px;
  color: @muted;
  .all i {
    font-style: normal;
    font-weight: 600;
    color: @text;
  }
  .edit {
    display: flex;
    align-items: center;
    gap: 4px;
    color: @blue;
  }
}

// 2-2. 商品列表
.cart-list {
  padding: 0 12px;
  .cart-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 12px;
    background: #fff;
    border-radius: 14px;
    .show {
      flex-shrink: 0;
      width: 90px;
      height: 90px;
      margin: 0 12px;
      overflow: hidden;
      background: @card;
      border-radius: 10px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 90px;
      .tit {
        font-size: 14px;
        line-height: 1.4;
      }
      .bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .price {
          font-size: 12px;
          color: @text;
          span {
            font-size: 17px;
            font-weight: 600;
          }
        }
      }
    }
  }
}

// 2-3. 底部結算列：tabbar 高 50px，所以 bottom 設 50px
.footer-fixed {
  position: fixed;
  left: 0;
  bottom: 50px;
  z-index: 9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  padding: 0 12px 0 16px;
  background: rgba(255, 255, 255, 0.92);
  border-top: 1px solid #e5e5ea;
  .all-check {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
  }
  .all-total {
    display: flex;
    align-items: center;
    .price {
      margin-right: 12px;
      font-size: 14px;
      .totalPrice {
        font-style: normal;
        font-size: 18px;
        font-weight: 600;
      }
    }
    .goPay,
    .delete {
      min-width: 90px;
      height: 36px;
      padding: 0 16px;
      line-height: 36px;
      text-align: center;
      font-size: 15px;
      color: #fff;
      border-radius: 18px;
    }
    .goPay {
      background: @blue;
    }
    // 刪除是危險操作，用 iOS 系統紅
    .delete {
      background: #ff3b30;
    }
    // 沒選商品時：變淡，也不能點
    .disabled {
      opacity: 0.4;
      pointer-events: none;
    }
  }
}

// 3. 空購物車
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 120px;
  .empty-icon {
    font-size: 72px;
    color: #c7c7cc;
  }
  .tips {
    margin: 16px 0 24px;
    font-size: 15px;
    color: @muted;
  }
  .btn {
    height: 40px;
    padding: 0 32px;
    line-height: 40px;
    font-size: 15px;
    color: #fff;
    background: @blue;
    border-radius: 20px;
  }
}
</style>
