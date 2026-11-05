<template>
  <div class="order">
    <!-- 1. 導覽列：fixed 固定在頂部，placeholder 在原位置留出同高的空白 -->
    <van-nav-bar @click-left="$router.go(-1)" title="我的訂單" left-arrow fixed placeholder />

    <!-- 2. 分類標籤：sticky 捲動時黏在導覽列下方（offset-top 是導覽列高度）
         （佔位：之後用 v-model 綁目前的分類，name 對應接口的 dataType） -->
    <van-tabs sticky :offset-top="46" color="#0071e3" title-active-color="#0071e3">
      <van-tab title="全部" name="all"></van-tab>
      <van-tab title="待支付" name="payment"></van-tab>
      <van-tab title="待發貨" name="delivery"></van-tab>
      <van-tab title="待收貨" name="received"></van-tab>
      <van-tab title="待評價" name="comment"></van-tab>
    </van-tabs>

    <!-- 3. 訂單列表（佔位 2 筆，之後改成 v-for 渲染訂單接口的資料） -->
    <div class="list">
      <div class="order-item" v-for="(item, index) in 2" :key="index">
        <!-- 訂單頭：下單時間、訂單狀態 -->
        <div class="head">
          <span class="time">2026-11-06 12:00:00</span>
          <span class="status">待支付</span>
        </div>

        <!-- 商品：一筆訂單可能有多件商品（佔位 1 件） -->
        <div class="goods">
          <div class="goods-item" v-for="(goods, i) in 1" :key="i">
            <div class="left">
              <!-- 佔位圖：之後換成 <img :src="商品圖片"> -->
              <div class="img-placeholder"></div>
            </div>
            <div class="right">
              <p class="tit text-ellipsis-2">商品名稱佔位文字，最多顯示兩行，超出的部分用省略號</p>
              <p class="info">
                <span class="count">x1</span>
                <span class="price">¥ 9899.00</span>
              </p>
            </div>
          </div>
        </div>

        <!-- 合計 -->
        <div class="total">
          共 1 件商品，總金額 <span class="money">¥ 9899.00</span>
        </div>

        <!-- 操作按鈕：之後依訂單狀態顯示不同按鈕（待支付：立刻付款；待收貨：確認收貨；待評價：評價） -->
        <div class="actions">
          <span class="btn">申請取消</span>
          <span class="btn primary">立刻付款</span>
        </div>
      </div>
    </div>

    <!-- 4. 沒有訂單時顯示（佔位：先用 v-if="false" 藏起來，之後改成判斷列表長度） -->
    <div class="empty" v-if="false">
      <van-icon name="orders-o" class="empty-icon" />
      <p>還沒有訂單</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyorderIndex',
  data () {
    return {}
  },
  methods: {}
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

// 名稱最多兩行，超出用省略號
.text-ellipsis-2 {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

// 3. 訂單卡片
.list {
  padding: 0 12px;
}

.order-item {
  margin-top: 12px;
  padding: 0 16px;
  background: #fff;
  border-radius: 14px;

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
