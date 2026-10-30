<template>
  <div class="search-list">
    <!-- 1. 導覽列：fixed 固定在頂部，點返回箭頭回上一頁之後再綁 -->
    <van-nav-bar @click-left="$router.go(-1)" title="商品列表" left-arrow fixed placeholder />

    <!-- 2. 搜尋列：readonly 只能點，文字之後換成網址上的 search 參數；右邊的格子圖示放在 #action 插槽 -->
    <van-search
     :value="querySearch || '搜索商品'"
      readonly shape="round"
      background="#fff"
      placeholder="手機"
      show-action
      @click="$router.push('/search')">
      <template #action>
        <van-icon @click="$router.push('/categray')" class="tool" name="apps-o" />
      </template>
    </van-search>

    <!-- 3. 排序：綜合、銷量、價格，選中的那一項加 active -->
    <div class="sort-btns">
      <div class="sort-item active">綜合</div>
      <div class="sort-item">銷量</div>
      <div class="sort-item">價格</div>
    </div>

    <!-- 4. 商品列表：先放 3 筆佔位，之後換成 v-for 綁接口回傳的商品 -->
    <div class="goods-list">
      <GoodsItem
        v-for="item in proList"
        :key="item.goods_id"
        :item="item"
      ></GoodsItem>
    </div>
  </div>
</template>

<script>
import { getProList } from '@/api/product'
import GoodsItem from '@/components/GoodsItem.vue'
export default {
  name: 'SearchList',
  components: {
    GoodsItem
  },
  async created () {
    const { data: { list } } = await getProList({
      categoryId: this.$route.query.categoryId,
      goodsName: this.querySearch,
      page: this.page
    })
    // console.log(res)
    this.proList = list.data
  },
  data () {
    return {
      page: 1,
      proList: []
    }
  },
  computed: {
    querySearch () {
      return this.$route.query.search
    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
// Apple 風格：顏色變數照登入頁
@text: #1d1d1f;
@muted: #6e6e73;
@card: #f5f5f7;
@blue: #0071e3;

.search-list {
  min-height: 100vh;
  background: @card;
  color: @text;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang TC', 'Helvetica Neue', sans-serif;
}

// 導覽列：標題加粗，返回箭頭用主要文字色
// 加了 placeholder 後，組件最外層變成佔位的 div，.van-nav-bar 在它裡面，所以要從 .search-list 往下穿透
.search-list /deep/ .van-nav-bar {
  .van-nav-bar__title {
    font-size: 17px;
    font-weight: 600;
    color: @text;
  }
  .van-icon {
    color: @text;
  }
}

// 搜尋列：淺灰圓角輸入區，右邊格子圖示
.van-search {
  padding: 8px 16px;
  /deep/ .van-search__content {
    background: @card;
  }
  /deep/ .van-search__action {
    padding: 0 0 0 12px;
  }
  .tool {
    font-size: 24px;
    color: @text;
  }
}

// 排序：白底一排三等分，選中的文字變藍色加粗
.sort-btns {
  display: flex;
  height: 44px;
  line-height: 44px;
  background: #fff;
  border-bottom: 1px solid #e8e8ed;

  .sort-item {
    flex: 1;
    text-align: center;
    font-size: 15px;
    color: @muted;
  }
  .active {
    font-weight: 600;
    color: @blue;
  }
}

// 商品列表
.goods-list {
  padding: 12px 16px;
}
</style>
