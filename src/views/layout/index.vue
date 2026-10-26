<template>
  <div id="">
  <van-tabbar v-model="active">
  <van-tabbar-item icon="shop">首頁</van-tabbar-item>
  <van-tabbar-item icon="bars">分類</van-tabbar-item>
  <van-tabbar-item icon="shopping-cart">購物車</van-tabbar-item>
  <van-tabbar-item icon="user">我的</van-tabbar-item>
</van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  components: {},
  data () {
    return {
      active: 0
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
</style>
