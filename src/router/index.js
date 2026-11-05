import Vue from 'vue'
import VueRouter from 'vue-router'
// 同步引入：一打開網站就會用到、會頻繁切換的頁面（Layout 和底部四個 tab），打包進 app.js
import Layout from '@/views/layout/index.vue'
// 二級路由
import Home from '@/views/layout/home.vue'
import Category from '@/views/layout/categroy.vue'
import Cart from '@/views/layout/cart.vue'
import User from '@/views/layout/user.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      { path: 'home', component: Home },
      { path: 'categray', component: Category },
      { path: 'cart', component: Cart },
      { path: 'user', component: User }

    ]
  },
  // 異步組件（路由懶加載）：component 給一個函式，函式裡用 import() 引入
  // 1. 打包時 webpack 看到 import()，會把這個頁面拆成獨立的 js 檔
  // 2. 跳到這個路由時，Vue Router 才呼叫函式去下載，首頁一開始要載入的檔案就變小
  { path: '/login', component: () => import('@/views/login/index.vue') },
  { path: '/search', component: () => import('@/views/search/index.vue') },
  { path: '/searchlist', component: () => import('@/views/search/list.vue') },
  { path: '/Prodetail/:id', component: () => import('@/views/prodetail/index.vue') },
  { path: '/myorder', component: () => import('@/views/myorder/index.vue') },
  { path: '/pay', component: () => import('@/views/pay/index.vue') },
  // 收貨地址：列表、新增／編輯
  { path: '/address', component: () => import('@/views/address/index.vue') },
  { path: '/address/edit', component: () => import('@/views/address/edit.vue') }

]

const router = new VueRouter({
  routes
})
// 路由守卫
// to:到哪去
// from:從哪來
// next():放行
// 定義數組，存放需要權限頁面
const authUrls = ['/pay', '/myorder', '/address', '/address/edit']
router.beforeEach((to, from, next) => {
  // 看to.path是否在 authUrls路徑？
  if (!authUrls.includes(to.path)) {
    next()
  } else {
    const token = store.getters.token
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
