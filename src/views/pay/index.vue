<template>
  <div class="pay">
    <!-- 1. 導覽列：fixed 固定在頂部，placeholder 在原位置留出同高的空白 -->
    <van-nav-bar @click-left="$router.go(-1)" title="訂單結算台" left-arrow fixed placeholder />

    <!-- 2. 收貨地址（佔位：之後換成地址接口的資料，沒有地址時顯示 .info-empty） -->
    <div class="address">
      <van-icon name="location-o" class="left-icon" />

      <div class="info">
        <div class="info-content">
          <span class="name">王小明</span>
          <span class="mobile">0912345678</span>
        </div>
        <div class="info-address">台北市信義區市府路 45 號</div>
      </div>
      <!-- <div class="info-empty">請選擇收貨地址</div> -->

      <van-icon name="arrow" class="right-icon" />
    </div>

    <!-- 3. 商品清單（佔位 2 筆，之後改成 v-for） -->
    <div class="list">
      <div class="goods-item">
        <div class="left">
          <img src="@/assets/goods.svg" alt="" />
        </div>
        <div class="right">
          <p class="tit text-ellipsis-2">商品名稱佔位文字，名稱很長時最多顯示兩行，超出的部分用省略號</p>
          <p class="info">
            <span class="count">x1</span>
            <span class="price">¥ 9999.00</span>
          </p>
        </div>
      </div>
      <div class="goods-item">
        <div class="left">
          <img src="@/assets/goods.svg" alt="" />
        </div>
        <div class="right">
          <p class="tit text-ellipsis-2">第二筆商品名稱佔位</p>
          <p class="info">
            <span class="count">x2</span>
            <span class="price">¥ 1620.00</span>
          </p>
        </div>
      </div>
    </div>

    <!-- 4. 金額明細 -->
    <div class="flow-num-box">
      <span>共 <i>3</i> 件商品，合計：</span>
      <span class="money">¥ 13239.00</span>
    </div>

    <div class="pay-detail">
      <div class="pay-cell">
        <span>訂單總金額：</span>
        <span class="red">¥ 13239.00</span>
      </div>
      <div class="pay-cell">
        <span>優惠券：</span>
        <span>無優惠券可用</span>
      </div>
      <div class="pay-cell">
        <span>配送費用：</span>
        <span class="red">+ ¥ 0.00</span>
      </div>
    </div>

    <!-- 5. 支付方式 -->
    <div class="pay-way">
      <span class="tit">支付方式</span>
      <div class="pay-cell">
        <span><van-icon name="balance-o" class="way-icon" />餘額支付（可用 ¥ 999919.00 元）</span>
        <van-icon name="checked" class="checked" />
      </div>
    </div>

    <!-- 6. 買家留言 -->
    <div class="buytips">
      <textarea placeholder="選填：買家留言（50 字內）" maxlength="50" rows="3"></textarea>
    </div>

    <!-- 7. 底部提交列：固定在最下方 -->
    <div class="footer-fixed">
      <div class="left">實付款：<span>¥ 13239.00</span></div>
      <div class="tipsbtn">提交訂單</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PayIndex',
  components: {},
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

.pay {
  min-height: 100vh;
  // 底部留出提交列（56px）的高度，留言框才不會被擋住
  padding: 0 12px 72px;
  box-sizing: border-box;
  background: @card;
  color: @text;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang TC', 'Helvetica Neue', sans-serif;
}

// 加了 placeholder 後，組件最外層變成佔位的 div，.van-nav-bar 在它裡面，所以要從 .pay 往下穿透
.pay /deep/ .van-nav-bar {
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

// 白色圓角卡片：地址、商品清單、明細、支付方式、留言共用
.address,
.list,
.pay-detail,
.pay-way,
.buytips {
  margin-top: 12px;
  background: #fff;
  border-radius: 14px;
}

// 2. 收貨地址
.address {
  display: flex;
  align-items: center;
  padding: 16px;
  .left-icon {
    margin-right: 12px;
    font-size: 22px;
    color: @blue;
  }
  .info {
    flex: 1;
    min-width: 0;
  }
  .info-content {
    margin-bottom: 4px;
    font-size: 16px;
    font-weight: 600;
    .mobile {
      margin-left: 8px;
      font-weight: 400;
      color: @muted;
    }
  }
  .info-address {
    font-size: 13px;
    line-height: 1.5;
    color: @muted;
  }
  .info-empty {
    flex: 1;
    font-size: 15px;
    color: @muted;
  }
  .right-icon {
    margin-left: 8px;
    font-size: 14px;
    color: @muted;
  }
}

// 3. 商品清單
.list {
  padding: 4px 16px;
  .goods-item {
    display: flex;
    padding: 12px 0;
    // 商品之間用細線分隔
    & + .goods-item {
      border-top: 1px solid #e5e5ea;
    }
    .left {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      margin-right: 12px;
      overflow: hidden;
      background: @card;
      border-radius: 10px;
      img {
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
      p {
        margin: 0;
      }
      .tit {
        font-size: 14px;
        line-height: 1.4;
      }
      .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .count {
          font-size: 13px;
          color: @muted;
        }
        .price {
          font-size: 15px;
          font-weight: 600;
        }
      }
    }
  }
}

// 4. 金額明細
.flow-num-box {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  padding: 12px 4px 0;
  font-size: 13px;
  color: @muted;
  i {
    font-style: normal;
    font-weight: 600;
    color: @text;
  }
  .money {
    font-size: 16px;
    font-weight: 600;
    color: @text;
  }
}

.pay-cell {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  font-size: 14px;
  & + .pay-cell {
    border-top: 1px solid #e5e5ea;
  }
  .red {
    font-weight: 600;
    color: @text;
  }
}

.pay-detail .pay-cell span:first-child {
  color: @muted;
}

// 5. 支付方式
.pay-way {
  .tit {
    display: block;
    padding: 14px 16px 0;
    font-size: 15px;
    font-weight: 600;
  }
  .way-icon {
    margin-right: 6px;
    font-size: 18px;
    color: @blue;
    vertical-align: -3px;
  }
  .checked {
    font-size: 20px;
    color: @blue;
  }
}

// 6. 買家留言
.buytips {
  padding: 12px 16px;
  textarea {
    display: block;
    width: 100%;
    padding: 0;
    border: none;
    outline: none;
    resize: none;
    font-family: inherit;
    font-size: 14px;
    line-height: 1.5;
    color: @text;
    background: transparent;
    &::placeholder {
      color: @muted;
    }
  }
}

// 7. 底部提交列
.footer-fixed {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 0 12px 0 16px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: saturate(180%) blur(20px);
  border-top: 1px solid #e5e5ea;
  .left {
    font-size: 14px;
    color: @muted;
    span {
      font-size: 18px;
      font-weight: 600;
      color: @text;
    }
  }
  .tipsbtn {
    height: 40px;
    padding: 0 22px;
    line-height: 40px;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    background: @blue;
    border-radius: 999px;
    &:active {
      opacity: 0.8;
    }
  }
}
</style>
