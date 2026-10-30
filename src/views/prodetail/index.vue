<template>
  <div class="prodetail">
    <!-- 1. 導覽列：fixed 固定在頂部，返回箭頭之後再綁 -->
    <van-nav-bar @click-left="$router.go(-1)" title="商品詳情" left-arrow fixed placeholder />

    <!-- 2. 輪播圖：先放 3 張佔位圖，之後換成 v-for 綁商品圖片；右下角用 #indicator 插槽顯示「目前張數 / 總張數」 -->
    <van-swipe :autoplay="3000" @change="onChange">
      <van-swipe-item v-for="(item, index) in images" :key="index">
        <img :src="item.external_url" alt="" />
      </van-swipe-item>

      <template #indicator>
        <div class="custom-indicator">{{ current + 1 }} / {{ images.length }}</div>
      </template>
    </van-swipe>

    <!-- 3. 商品資訊：價格、銷量、名稱，下面一列服務保障 -->
    <div class="info">
      <div class="title">
        <div class="price">
          <span class="now">¥{{ detail.goods_price_min }}</span>
          <span class="oldprice">¥{{ detail.line_price_min }}</span>
        </div>
        <div class="sellcount">已售 {{ detail.goods_sales }} 件</div>
      </div>
      <div class="msg">
       {{ detail.goods_name }}
      </div>

      <div class="service">
        <div class="left-words">
          <span><van-icon name="passed" />七天無理由退貨</span>
          <span><van-icon name="passed" />48 小時發貨</span>
        </div>
        <div class="right-icon">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>

    <!-- 4. 商品評價：標題列加「查看更多」，下面先放 3 則佔位評價 -->
    <div class="comment">
      <div class="comment-title">
        <div class="left">商品評價（{{ total }} 條）</div>
        <div class="right">查看更多 <van-icon name="arrow" /></div>
      </div>
      <div class="comment-list">
        <div class="comment-item" v-for="item in commentList" :key="item.comment_id">
          <div class="top">
            <img :src="item.user.avatar_url || defaultImg" alt="" />
            <div class="name">{{ item.user.nick_name }}</div>
            <van-rate :size="16" :value="item.score / 2" color="#0071e3" void-icon="star" void-color="#d2d2d7" readonly />
          </div>
          <div class="content">
            {{ item.content }}
          </div>
          <div class="time">
            {{ item.create_time }}
          </div>
        </div>
      </div>
    </div>

    <!-- 5. 商品描述：接口回來的是一段 html，之後用 v-html 渲染；先放佔位圖 -->
    <div class="desc" v-html="detail.content">
    </div>

    <!-- 6. 底部操作列：fixed 固定在底部，首頁、購物車、加入購物車、立刻購買 -->
    <div class="footer">
      <div class="icon-home">
        <van-icon name="wap-home-o" />
        <span>首頁</span>
      </div>
      <div class="icon-cart">
        <van-icon name="shopping-cart-o" />
        <span>購物車</span>
      </div>
      <div class="btn-add">加入購物車</div>
      <div class="btn-buy">立刻購買</div>
    </div>
  </div>
</template>

<script>
import { getProDetail, getProComment } from '@/api/product'
import defaultImg from '@/assets/default-avatar.svg'
export default {
  name: 'ProdetailIndex',
  computed: {
    goodsId () {
      return this.$route.params.id
    }
  },
  created () {
    this.getDetail()
    this.getCommit()
  },
  data () {
    return {
      // 輪播圖目前顯示第幾張（從 0 開始），給右下角的指示器用
      current: 0,
      detail: {},
      images: [],
      total: 0,
      commentList: [],
      defaultImg
    }
  },
  methods: {
    onChange (index) {
      this.current = index
    },
    async getDetail () {
      const { data: { detail } } = await getProDetail(this.goodsId)
      this.detail = detail
      this.images = detail.goods_images
    },
    async getCommit () {
      const { data: { list, total } } = await getProComment(this.goodsId, 3)
      this.commentList = list
      this.total = total
    }
  }
}
</script>

<style lang="less" scoped>
// Apple 風格：顏色變數照登入頁
@text: #1d1d1f;
@muted: #6e6e73;
@card: #f5f5f7;
@blue: #0071e3;

.prodetail {
  min-height: 100vh;
  // 底部操作列是 fixed，留出它的高度，最後的內容才不會被蓋住
  padding-bottom: 64px;
  background: @card;
  color: @text;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang TC', 'Helvetica Neue', sans-serif;

  img {
    display: block;
    width: 100%;
  }
}

// 導覽列：標題加粗，返回箭頭用主要文字色
// 加了 placeholder 後，組件最外層變成佔位的 div，.van-nav-bar 在它裡面，所以要從 .prodetail 往下穿透
.prodetail /deep/ .van-nav-bar {
  .van-nav-bar__title {
    font-size: 17px;
    font-weight: 600;
    color: @text;
  }
  .van-icon {
    color: @text;
  }
}

// 輪播圖：白底正方形，右下角半透明膠囊顯示張數
.van-swipe {
  background: #fff;
  img {
    aspect-ratio: 1 / 1;
    object-fit: contain;
  }
  .custom-indicator {
    position: absolute;
    right: 12px;
    bottom: 12px;
    padding: 2px 10px;
    font-size: 12px;
    color: #fff;
    background: rgba(0, 0, 0, 0.35);
    border-radius: 999px;
  }
}

// 商品資訊：白色卡片
.info {
  padding: 16px;
  background: #fff;

  .title {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }
  .now {
    font-size: 26px;
    font-weight: 600;
    color: @text;
  }
  .oldprice {
    margin-left: 8px;
    font-size: 14px;
    color: @muted;
    text-decoration: line-through;
  }
  .sellcount {
    font-size: 13px;
    color: @muted;
  }
  .msg {
    margin-top: 8px;
    font-size: 16px;
    line-height: 1.5;
    font-weight: 500;
  }

  // 服務保障：淺灰圓角條，左邊文字、右邊箭頭
  .service {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    padding: 10px 12px;
    font-size: 13px;
    color: @muted;
    background: @card;
    border-radius: 12px;

    .left-words span {
      margin-right: 12px;
    }
    .left-words .van-icon {
      margin-right: 4px;
      color: @blue;
    }
  }
}

// 商品評價：白色卡片，跟上面的資訊區隔 8px
.comment {
  margin-top: 8px;
  padding: 16px;
  background: #fff;

  .comment-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      font-size: 17px;
      font-weight: 600;
    }
    .right {
      font-size: 14px;
      color: @blue;
    }
  }

  .comment-item {
    padding: 14px 0;
    border-bottom: 1px solid #e8e8ed;
    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .top {
      display: flex;
      align-items: center;
      img {
        width: 28px;
        height: 28px;
        border-radius: 50%;
      }
      .name {
        margin: 0 8px;
        font-size: 14px;
        font-weight: 500;
      }
    }
    .content {
      margin-top: 8px;
      font-size: 14px;
      line-height: 1.5;
    }
    .time {
      margin-top: 6px;
      font-size: 12px;
      color: @muted;
    }
  }
}

// 商品描述：圖片一張接一張
.desc {
  margin-top: 8px;
  background: #fff;
}

// 底部操作列：白底半透明毛玻璃，左邊兩個圖示、右邊兩顆膠囊按鈕
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: saturate(180%) blur(20px);
  border-top: 1px solid #e8e8ed;

  .icon-home,
  .icon-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 48px;
    font-size: 11px;
    color: @muted;
    .van-icon {
      font-size: 22px;
      color: @text;
    }
  }

  .btn-add,
  .btn-buy {
    flex: 1;
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 15px;
    font-weight: 600;
    border-radius: 999px;
  }
  .btn-add {
    margin: 0 8px 0 12px;
    color: @blue;
    background: #e8f1fc;
  }
  .btn-buy {
    color: #fff;
    background: @blue;
  }
}
</style>
