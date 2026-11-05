<template>
  <!-- 訂單卡片：props item 是一筆訂單（order/list 的 data.list.data 其中一筆） -->
  <div class="order-item">
    <!-- 訂單頭：下單時間、訂單狀態 -->
    <div class="head">
      <span class="time">{{ item.create_time }}</span>
      <span class="status">{{ item.state_text }}</span>
    </div>

    <!-- 商品：一筆訂單可能有多件商品，迴圈變數叫 goods，避免蓋掉外面的訂單 item -->
    <div class="goods">
      <div class="goods-item" v-for="goods in item.goods" :key="goods.order_goods_id">
        <div class="left">
          <img :src="goods.goods_image" alt="">
        </div>
        <div class="right">
          <p class="tit text-ellipsis-2">{{ goods.goods_name }}</p>
          <p class="info">
            <span class="count">x{{ goods.total_num }}</span>
            <span class="price">¥ {{ goods.goods_price }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- 合計：total_num 是 myorder/index.vue 把每件商品數量加總後放進訂單的 -->
    <div class="total">
      共 {{ item.total_num }} 件商品，總金額 <span class="money">¥ {{ item.pay_price }}</span>
    </div>

    <!-- 操作按鈕：依訂單狀態顯示（判斷寫在 computed 的 status）
         待支付：取消訂單、立刻付款；待發貨：申請取消；待收貨：確認收貨；待評價：評價
         待取消、已取消、已完成：沒有按鈕，整列藏起來（點擊功能還沒接） -->
    <div class="actions" v-if="status !== 'none'">
      <template v-if="status === 'payment'">
        <span class="btn">取消訂單</span>
        <span class="btn primary">立刻付款</span>
      </template>
      <span class="btn" v-else-if="status === 'delivery'">申請取消</span>
      <span class="btn primary" v-else-if="status === 'received'">確認收貨</span>
      <span class="btn primary" v-else-if="status === 'comment'">評價</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderListItem',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    // 用狀態碼判斷訂單在哪個階段（10 = 還沒、20 = 已經）
    // order_status：10 進行中、20 已取消、21 待取消（申請取消中）、30 已完成
    status () {
      const { order_status: order, pay_status: pay, delivery_status: delivery, receipt_status: receipt, is_comment: isComment } = this.item
      if (order === 20 || order === 21) return 'none' // 已取消、待取消
      if (pay === 10) return 'payment' // 還沒付款
      if (delivery === 10) return 'delivery' // 已付款、還沒發貨
      if (receipt === 10) return 'received' // 已發貨、還沒收貨
      if (order === 30 && isComment === 0) return 'comment' // 已完成、還沒評價
      return 'none'
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

// 名稱最多兩行，超出用省略號
.text-ellipsis-2 {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.order-item {
  margin-top: 12px;
  padding: 0 16px;
  background: #fff;
  border-radius: 14px;
  color: @text;

  // 訂單頭：時間靠左、狀態靠右
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0 10px;
    font-size: 13px;
    .time {
      color: @muted;
    }
    .status {
      font-weight: 600;
      color: @blue;
    }
  }

  // 商品
  .goods-item {
    display: flex;
    padding: 10px 0;
    & + .goods-item {
      border-top: 1px solid #e5e5ea;
    }
    .left {
      flex-shrink: 0;
      width: 72px;
      height: 72px;
      margin-right: 12px;
      overflow: hidden;
      background: @card;
      border-radius: 10px;
      img,
      .img-placeholder {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      min-width: 0;
      .tit {
        margin: 0;
        font-size: 14px;
        line-height: 1.4;
      }
      .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        font-size: 13px;
        .count {
          color: @muted;
        }
        .price {
          font-weight: 600;
        }
      }
    }
  }

  // 合計：靠右
  .total {
    padding: 10px 0;
    text-align: right;
    font-size: 13px;
    color: @muted;
    border-top: 1px solid #e5e5ea;
    .money {
      margin-left: 4px;
      font-size: 16px;
      font-weight: 600;
      color: @text;
    }
  }

  // 操作按鈕：靠右排列，膠囊形
  .actions {
    display: flex;
    justify-content: flex-end;
    padding: 4px 0 14px;
    .btn {
      margin-left: 10px;
      padding: 6px 14px;
      font-size: 13px;
      color: @text;
      border: 1px solid #d2d2d7;
      border-radius: 999px;
      &:active {
        opacity: 0.7;
      }
    }
    .primary {
      color: #fff;
      background: @blue;
      border-color: @blue;
    }
  }
}
</style>
