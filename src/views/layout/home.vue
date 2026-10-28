<template>
  <div class="home">
    <!-- 1. 導覽列：fixed 固定在頂部，placeholder 在原位置留出同高的空白 -->
    <van-nav-bar title="智慧商城" fixed placeholder />

    <!-- 2. 搜尋框：readonly 只能點、不能輸入，之後點擊跳到 /search -->
    <van-search readonly shape="round" background="#fff" placeholder="請在此輸入搜尋關鍵字" />

    <!-- 3. 輪播圖：之後換成接口回傳的圖片 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#fff">
      <van-swipe-item v-for="item in bannerList" :key="item.imgUrl">
        <img :src="item.imgUrl" alt="">
      </van-swipe-item>
    </van-swipe>

    <!-- 4. 導航：5 欄共 10 格，icon 和文字之後換成接口的圖片和名稱 -->
    <van-grid class="my-grid" :column-num="5" :border="false" icon-size="32">
      <van-grid-item v-for="item in navList" :key="item.imgUrl" :icon="item.imgUrl" :text="item.text" />
    </van-grid>

    <!-- 5. 主廣告圖 -->
    <div class="main-img">
      <div class="ad-ph">主廣告圖</div>
    </div>

    <!-- 6. 猜你喜歡：商品卡片拆成 GoodsItem 組件 -->
    <div class="guess">
      <p class="guess-title">猜你喜歡</p>
      <div class="goods-list">
        <GoodsItem v-for="item in proList" :key="item.goods_id" :item="item"></GoodsItem>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
import { getHomeData } from '@/api/home'
export default {
  name: 'HomeIndex',
  components: {
    GoodsItem
  },
  data () {
    return {
      bannerList: [], // 輪播
      navList: [], // 導航
      proList: []// 商品
    }
  },
  async created () {
    const { data: { pageData } } = await getHomeData()
    this.bannerList = pageData.items[1].data
    this.navList = pageData.items[3].data
    this.proList = pageData.items[6].data
  },
  methods: {}
}
</script>

<style lang="less" scoped>
// Apple 風格：白底、系統字、淺灰圓角，強調色只用 Apple 藍（變數照登入頁）
@text: #1d1d1f;
@muted: #6e6e73;
@card: #f5f5f7;
@blue: #0071e3;

.home {
  min-height: 100vh;
  // 底部留出 tabbar 的高度，最後一個商品才不會被蓋住
  padding-bottom: 60px;
  background: @card;
  color: @text;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang TC', 'Helvetica Neue', sans-serif;
}

// 導覽列：白底、細框線、標題加粗
.van-nav-bar {
  /deep/ .van-nav-bar__title {
    font-size: 17px;
    font-weight: 600;
    color: @text;
  }
}

// 搜尋框：淺灰圓角輸入區
.van-search {
  padding: 8px 16px 12px;
  /deep/ .van-search__content {
    background: @card;
  }
}

// 輪播圖
.my-swipe {
  margin: 0 16px;
  height: 160px;
  border-radius: 16px;
  overflow: hidden;
  // 修正 Safari 圓角在 overflow 滑動時失效
  transform: translateZ(0);

  .swipe-ph {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 16px;
    color: @muted;
    background: linear-gradient(135deg, #e8e8ed, #d2d2d7);
  }

  // 輪播圖片：填滿圓角框，比例不同時裁掉多的部分，不會變形
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: #e8e8ed;
  }
}

// 導航
.my-grid {
  margin: 12px 16px 0;
  padding: 8px 0;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;

  /deep/ .van-grid-item__content {
    padding: 10px 0;
    background: transparent;
  }
  /deep/ .van-grid-item__icon {
    color: @blue;
  }
  /deep/ .van-grid-item__text {
    margin-top: 6px;
    font-size: 12px;
    color: @text;
  }
}

// 主廣告圖
.main-img {
  margin: 12px 16px 0;
  border-radius: 16px;
  overflow: hidden;

  .ad-ph {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 110px;
    font-size: 15px;
    color: @muted;
    background: linear-gradient(135deg, #fff, #e8e8ed);
  }
  img {
    display: block;
    width: 100%;
  }
}

// 猜你喜歡
.guess {
  margin-top: 24px;
  padding: 0 16px;

  .guess-title {
    margin-bottom: 12px;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.3px;
    color: @text;
  }
}
</style>
