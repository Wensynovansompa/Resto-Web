import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/products-makanan',
      name: 'products-makanan',
      component: () => import( /* webpackChunkName: "products-makanan" */ './views/ProductsMakanan.vue'),
      meta: { auth: true }
    },
    {
      path: '/products-snack',
      name: 'products-snack',
      component: () => import( /* webpackChunkName: "products-snack" */ './views/ProductsSnack.vue'),
      meta: { auth: true }
    },
    {
      path: '/products-minuman',
      name: 'products-minuman',
      component: () => import( /* webpackChunkName: "products-minuman" */ './views/ProductsMinuman.vue'),
      meta: { auth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import( /* webpackChunkName: "profile" */ './views/Profile.vue'),
      meta: { auth: true }
    },
    {
      path: '/order',
      name: 'order',
      component: () => import( /* webpackChunkName: "order" */ './views/Orders.vue'),
      meta: { auth: true }
    },
    {
      path: '/report-order/:id',
      name: 'report-order',
      component: () => import( /* webpackChunkName: "report-order" */ './views/ReportOrder.vue'),
      meta: { auth: true }
    },
    {
      path: '/payment-order/:id',
      name: 'payment-order',
      component: () => import( /* webpackChunkName: "report-order" */ './views/PaymentOrder.vue'),
      meta: { auth: true }
    },
    
    {
      path: '/reset-password/:token',
      name: 'reset-password-form',
      component: () => import( /* webpackChunkName: "reset-password-form" */ './views/ResetPasswordForm.vue'),
      meta: { auth: false }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import( /* webpackChunkName: "admin" */ './views/Admin.vue'),
      meta: { auth: true }
    },
    {
      path: '/store-setting',
      name: 'store-setting',
      component: () => import( /* webpackChunkName: "store-setting" */ './views/StoreSetting.vue'),
      meta: { auth: true }
    },
    {
      path: '/chair',
      name: 'chair',
      component: () => import( /* webpackChunkName: "chair" */ './views/Chairs.vue'),
      meta: { auth: true }
    },
    {
      path: '/admin-customer',
      name: 'admin-customer',
      component: () => import( /* webpackChunkName: "admin-customer" */ './views/AdminCustomer.vue'),
      meta: { auth: true }
    },
    {
      path: '/reservasi-customer',
      name: 'reservasi-customer',
      component: () => import( /* webpackChunkName: "reservasi-customer" */ './views/ReservasiCustomer.vue'),
      meta: { auth: true }
    },
    {
      path: '/products-makanan-customer',
      name: 'products-makanan-customer',
      component: () => import( /* webpackChunkName: "products-makanan-customer" */ './views/ProductsMakananCustomer.vue'),
      meta: { auth: true }
    },
    {
      path: '/products-snack-customer',
      name: 'products-snack-customer',
      component: () => import( /* webpackChunkName: "products-snack-customer" */ './views/ProductsSnackCustomer.vue'),
      meta: { auth: true }
    },
    {
      path: '/products-minuman-customer',
      name: 'products-minuman-customer',
      component: () => import( /* webpackChunkName: "products-minuman-customer" */ './views/ProductsMinumanCustomer.vue'),
      meta: { auth: true }
    },
    {
      path: '/order-customer',
      name: 'order-customer',
      component: () => import( /* webpackChunkName: "order-customer" */ './views/OrdersCustomer.vue'),
      meta: { auth: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import( /* webpackChunkName: "forgot-password" */ './views/ResetPasswordForm.vue'),
      meta: { auth: false }
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
    if (store.getters['auth/guest']) {
      store.dispatch('alert/set', {
        status: true,
        text: 'Login first',
        color: 'error',
      })
      store.dispatch('setPrevUrl', to.path)
      store.dispatch('dialog/setComponent', 'login')
    }
    else {
      next()
    }
  }
  else {
    next()
  }
})

export default router;