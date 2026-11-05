import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/layout/index.vue'
import Login from '@/views/login/index.vue'
import Search from '@/views/search/index.vue'
import Searchlist from '@/views/search/list.vue'
import Prodetail from '@/views/prodetail/index.vue'
import Myorder from '@/views/myorder/index.vue'
import Pay from '@/views/pay/index.vue'
import Address from '@/views/address/index.vue'
import AddressEdit from '@/views/address/edit.vue'
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
  { path: '/login', component: Login },
  { path: '/search', component: Search },
  { path: '/searchlist', component: Searchlist },
  { path: '/Prodetail/:id', component: Prodetail },
  { path: '/myorder', component: Myorder },
  { path: '/pay', component: Pay },
  // 收貨地址：列表、新增／編輯
  { path: '/address', component: Address },
  { path: '/address/edit', component: AddressEdit }

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
