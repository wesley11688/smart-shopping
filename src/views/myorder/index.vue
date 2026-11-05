<template>
  <div class="order">
    <!-- 1. 導覽列：fixed 固定在頂部，placeholder 在原位置留出同高的空白 -->
    <van-nav-bar @click-left="$router.go(-1)" title="我的訂單" left-arrow fixed placeholder />

    <!-- 2. 分類標籤：sticky 捲動時黏在導覽列下方（offset-top 是導覽列高度）
         v-model 綁目前的分類 active，name 就是接口的 dataType -->
    <van-tabs v-model="active" sticky :offset-top="46" color="#0071e3" title-active-color="#0071e3">
      <van-tab title="全部" name="all"></van-tab>
      <van-tab title="待支付" name="payment"></van-tab>
      <van-tab title="待發貨" name="delivery"></van-tab>
      <van-tab title="待收貨" name="received"></van-tab>
      <van-tab title="待評價" name="comment"></van-tab>
    </van-tabs>

    <!-- 3. 訂單列表：每筆訂單交給 OrderListItem 組件渲染 -->
    <div class="list">
      <OrderListItem v-for="item in list" :key="item.order_id" :item="item" />
    </div>

    <!-- 4. 沒有訂單時顯示 -->
    <div class="empty" v-if="list.length === 0">
      <van-icon name="orders-o" class="empty-icon" />
      <p>還沒有訂單</p>
    </div>
  </div>
</template>

<script>
import OrderListItem from '@/components/OrderListItem.vue'
import { getOrderList } from '@/api/order.js'

export default {
  name: 'MyorderIndex',
  components: {
    OrderListItem
  },
  data () {
    return {
      active: this.$route.query.dataType || 'all', // 目前的分類標籤，預設是「全部」
      page: 1,
      list: []
    }
  },
  methods: {
    async getList () {
      const { data: { list } } = await getOrderList(this.active, this.page)
      list.data.forEach(item => {
        item.total_num = 0
        item.goods.forEach(goods => {
          item.total_num += goods.total_num
        })
      })
      this.list = list.data
    }
  },
  watch: {
    active: {
      immediate: true,
      handler () {
        this.page = 1
        this.getList()
      }
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

.order {
  min-height: 100vh;
  padding-bottom: 24px;
  box-sizing: border-box;
  background: @card;
  color: @text;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang TC', 'Helvetica Neue', sans-serif;
}

// 加了 placeholder 後，組件最外層變成佔位的 div，.van-nav-bar 在它裡面，所以要從頁面根往下穿透
.order /deep/ .van-nav-bar {
  .van-nav-bar__title {
    color: @text;
    font-weight: 600;
  }
  .van-icon {
    color: @text;
  }
}

// 2. 分類標籤：未選中用灰字，選中用 Apple 藍（顏色寫在 van-tabs 的屬性上）
.order /deep/ .van-tabs {
  .van-tab {
    color: @muted;
    font-size: 14px;
  }
  .van-tab--active {
    font-weight: 600;
  }
}

// 3. 訂單列表（卡片樣式在 OrderListItem 組件）
.list {
  padding: 0 12px;
}

// 4. 空狀態
.empty {
  padding-top: 120px;
  text-align: center;
  color: @muted;
  font-size: 15px;
  .empty-icon {
    margin-bottom: 12px;
    font-size: 56px;
    color: #c7c7cc;
  }
  p {
    margin: 0;
  }
}
</style>
