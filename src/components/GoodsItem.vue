<template>
  <!-- 商品卡片：左圖右文，資料之後用 props 傳進來 -->
  <div v-if="item.goods_id" class="goods-item" @click="$router.push(`/prodetail/${item.goods_id}`)">
    <div class="left">
      <img :src="item.goods_image" alt="">
    </div>
    <div class="right">
      <p class="tit text-ellipsis-2">
        {{ item.goods_name  }}
      </p>
      <p class="count">已售 {{ item.goods_sales }} 件</p>
      <p class="price">
        <span class="new">¥{{ item.goods_price_min }}</span>
        <span class="old">¥{{ item.goods_price_max }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  name: 'GoodsItem'
}
</script>

<style lang="less" scoped>
// Apple 風格：顏色變數照登入頁
@text: #1d1d1f;
@muted: #6e6e73;
@card: #f5f5f7;
@blue: #0071e3;

.goods-item {
  display: flex;
  height: 148px;
  margin-bottom: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 16px;

  .left {
    flex-shrink: 0;
    width: 124px;
    height: 124px;
    overflow: hidden;
    background: @card;
    border-radius: 12px;
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
    padding: 4px 0 4px 12px;

    .tit {
      font-size: 15px;
      line-height: 21px;
      color: @text;
    }

    .count {
      font-size: 12px;
      color: @muted;
    }

    .new {
      margin-right: 6px;
      font-size: 18px;
      font-weight: 600;
      color: @blue;
    }

    .old {
      font-size: 12px;
      color: @muted;
      text-decoration: line-through;
    }
  }
}

// 兩行省略
.text-ellipsis-2 {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
