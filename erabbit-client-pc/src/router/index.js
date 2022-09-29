import { createRouter, createWebHashHistory } from 'vue-router'
// import index from '@/views/home/index'
const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')
const topCategory = () => import('@/views/category/index')
const subCategory = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods/index')
const Login = () => import('@/views/login/index')
const Cart = () => import('@/views/cart/index')
const loginCallback = () => import('@/views/login/callback')
const checkout = () => import('@/views/member/pay/checkout')
const Pay = () => import('@/views/member/pay/index')
const payResult = () => import('@/views/member/pay/components/result')
const memberLayout = () => import('@/views/member/Layout')
const memberHome = () => import('@/views/member/home/index')
const memberOrder = () => import('@/views/member/order/index')
const memberDetail = () => import('@/views/member/order/detail')


import store from '@/store'
import { h } from 'vue'
// 路由规则
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        component: Home,
      },
      {
        // 一级分类
        path: '/category/:id',
        component: topCategory,
      },
      {
        // 二级分类商品id
        path: '/category/sub/:id',
        component: subCategory,
      },
      {
        path: '/product/:id',
        component: Goods,
      },
      {
        path: 'cart',
        component: Cart,
      },
      {
        path: '/member/checkout',
        component: checkout,
      },
      {
        path: '/member/pay',
        component: Pay,
      },
      {
        path: '/pay/callback',
        component: payResult
      },
      {
        path: '/member',
        component: memberLayout,
        children: [
          {
            path: '/member',
            component: memberHome
          },
          {
            path: '/member/order',
            // component: { render: () => h(<RouterView />) },
            component: { render: () => h(<RouterView />) },
            children: [
              {
                path: '',
                component: memberOrder
              },
              {
                path: ':id',
                component: memberDetail
              },
            ]
          },
        ]
      },
    ]
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/login/callback',
    component: loginCallback
  },


]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 跳转到一级类目时滚动回顶部
  scrollBehavior() {
    // vue2.0通过x和y
    // 这是vue3写法
    return { left: 0, top: 0 }
  }

})

// 导航守卫
router.beforeEach((to, from, next) => {
  const { profile } = store.state.user
  // 如果没有登录, 且目标路由以member开头, 那就跳转到登录页面
  if (!profile.token && to.path.startsWith('/member')) {
    console.log(123);
    return next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
  }

  next()
})


export default router
