<template>
  <div class="search">
    <!-- 1. 導覽列：left-arrow 顯示返回箭頭，點擊回上一頁之後再綁 -->
    <van-nav-bar title="商品搜尋" left-arrow />

    <!-- 2. 搜尋列：show-action 在右邊留出按鈕位置，按鈕內容寫在 #action 插槽 -->
    <van-search  v-model="search" show-action shape="round" background="#fff" placeholder="請輸入搜尋關鍵字" clearable>
      <template #action>
        <div  @click="goSearch(search)" class="search-btn">搜尋</div>
      </template>
    </van-search>

    <!-- 3. 最近搜尋：關鍵字之後換成歷史紀錄陣列 -->
    <div class="search-history" v-if="history.length > 0 ">
      <div class="title">
        <span>最近搜尋</span>
        <van-icon @click="clear" name="delete-o" size="18" />
      </div>
      <div class="list">
        <div v-for="item in history"
        :key="item"
         @click="goSearch(item)"
         class="list-item">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHistoryList, setHistoryList, removeHistoryList } from '@/utils/storages'
export default {
  name: 'SearchIndex',
  components: {},
  data () {
    return {
      search: '',
      history: getHistoryList()
    }
  },
  methods: {
    goSearch (key) {
      // console.log('goSearch', key)
      const index = this.history.indexOf(key)
      if (index !== -1) {
        this.history.splice(index, 1)
      }
      this.history.unshift(key)
      setHistoryList(this.history)
      this.$router.push(`/searchlist?search=${key}`)
    },
    clear () {
      this.history = []
      removeHistoryList()
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

.search {
  min-height: 100vh;
  background: #fff;
  color: @text;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang TC', 'Helvetica Neue', sans-serif;
}

// 導覽列：標題加粗，返回箭頭用主要文字色
.van-nav-bar {
  /deep/ .van-nav-bar__title {
    font-size: 17px;
    font-weight: 600;
    color: @text;
  }
  /deep/ .van-icon {
    color: @text;
  }
}

// 搜尋列：淺灰圓角輸入區，右邊藍色文字按鈕
.van-search {
  padding: 8px 16px 12px;
  /deep/ .van-search__content {
    background: @card;
  }
  /deep/ .van-search__action {
    padding: 0 0 0 12px;
  }
  .search-btn {
    font-size: 15px;
    color: @blue;
  }
}

// 最近搜尋
.search-history {
  padding: 8px 16px;

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 17px;
    font-weight: 600;
    .van-icon {
      color: @muted;
    }
  }

  // 關鍵字標籤：一排兩個，太長的字用省略號
  .list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .list-item {
    width: calc(50% - 6px);
    margin-bottom: 12px;
    padding: 0 14px;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    color: @text;
    background: @card;
    border-radius: 18px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
