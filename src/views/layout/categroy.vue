<template>
  <div class="category">
    <!-- 1. 導覽列：fixed 固定在頂部，placeholder 在原位置留出同高的空白 -->
    <van-nav-bar title="全部分類" fixed placeholder />

    <!-- 2. 搜尋框：readonly 只能點、不能輸入，之後點擊跳到 /search -->
    <van-search readonly shape="round" background="#fff" placeholder="請在此輸入搜尋關鍵字" />

    <!-- 3. 分類主體：左邊一級分類、右邊二級分類，兩欄各自捲動 -->
    <div class="list-box">
      <!-- 3-1. 左欄：一級分類，先放 5 筆佔位，之後換成 v-for 綁接口的 list，選中的那一項加 active -->
      <div class="left">
        <ul>
          <li v-for="item in cateList" :key="item.category_id">
         <a @click="cateId = item.category_id" :class="{active: item.category_id === cateId }" href="javascript:;">{{ item.name }}</a>
       </li>
        </ul>
      </div>

      <!-- 3-2. 右欄：選中分類的 children，一列 3 格；圖片之後換成 image.preview_url，點擊跳 /searchlist?categoryId= -->
      <div class="right">
        <div @click="$router.push(`/searchlist?categoryId=${item.category_id}`)" v-for="item in childList" :key="item.category_id" class="cate-goods">
          <img :src="item.image.preview_url" alt="">
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCatList } from '@/api/category'
export default {
  name: 'CategoryIndex',
  components: {},
  async created () {
    const { data: { list } } = await getCatList()
    // console.log(res)
    console.log(list)

    this.cateList = list
    // 預設選中第一個分類
    this.cateId = list[0].category_id
  },
  mounted () {
    // this.$store.dispatch('getCatList')
  },
  data () {
    return {
      cateList: [],
      // 目前選中的一級分類 id，跟 item.category_id 比對決定要不要加 active
      cateId: ''
    }
  },
  computed: {
    // 右欄要顯示的二級分類：從 cateList 找出選中的那一筆，取它的 children
    // 一級分類的 image 是 null，只有 children 裡的二級分類才有 image.preview_url
    // 資料回來之前 cateList 是空陣列，find 找不到會是 undefined，所以先回空陣列
    childList () {
      const cate = this.cateList.find(item => item.category_id === this.cateId)
      return cate ? cate.children : []
    }
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

// 整頁剛好一個螢幕高，扣掉底部 tabbar 的 50px，分類主體用 flex: 1 填滿剩下的高度
.category {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-bottom: 50px;
  box-sizing: border-box;
  background: #fff;
  color: @text;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang TC', 'Helvetica Neue', sans-serif;
}

// 導覽列：標題加粗
// 加了 placeholder 後，組件最外層變成佔位的 div，.van-nav-bar 在它裡面，所以要從 .category 往下穿透
.category /deep/ .van-nav-bar {
  .van-nav-bar__title {
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

// 分類主體：左右兩欄，超出的部分各自捲動，整頁不會跟著捲
.list-box {
  flex: 1;
  display: flex;
  overflow: hidden;
  border-top: 1px solid #e8e8ed;
}

// 左欄：淺灰底，選中那一項變白底、藍色加粗，左邊一條藍色指示線
.left {
  width: 92px;
  height: 100%;
  overflow-y: auto;
  background: @card;

  a {
    position: relative;
    display: block;
    height: 52px;
    line-height: 52px;
    text-align: center;
    font-size: 14px;
    color: @muted;
  }
  .active {
    font-weight: 600;
    color: @blue;
    background: #fff;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 16px;
      width: 3px;
      height: 20px;
      border-radius: 0 2px 2px 0;
      background: @blue;
    }
  }
}

// 右欄：一列 3 格，從上往下排
.right {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  padding: 12px 8px;
  box-sizing: border-box;

  .cate-goods {
    width: 33.33%;
    margin-bottom: 16px;
    text-align: center;

    // 圖片佔位：之後換成 <img>，大小照這個
    .img-ph,
    img {
      display: block;
      width: 56px;
      height: 56px;
      margin: 0 auto 8px;
      border-radius: 14px;
      object-fit: cover;
      background: @card;
    }
    p {
      font-size: 13px;
      color: @text;
    }
  }
}
</style>
