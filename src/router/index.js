import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/layout/index.vue'
import Login from '@/views/login/index.vue'
import Search from '@/views/search/index.vue'
import Searchlist from '@/views/search/list.vue'
import Prodetail from '@/views/prodetail/index.vue'
import Myorder from '@/views/myorder/index.vue'
import Pay from '@/views/pay/index.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Layout },
  { path: '/login', component: Login },
  { path: '/search', component: Search },
  { path: '/searchlist', component: Searchlist },
  { path: '/Prodetail/:id', component: Prodetail },
  { path: '/myorder', component: Myorder },
  { path: '/pay', component: Pay }

]

const router = new VueRouter({
  routes
})

export default router
