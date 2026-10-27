<template>
  <div id="">
    <router-view></router-view>
  <van-tabbar route >
  <van-tabbar-item to="/home" icon="shop">首頁</van-tabbar-item>
  <van-tabbar-item to="/categray" icon="bars">分類</van-tabbar-item>
  <van-tabbar-item to="/cart" icon="shopping-cart">購物車</van-tabbar-item>
  <van-tabbar-item to="/user" icon="user">我的</van-tabbar-item>
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
