import {route} from 'quasar/wrappers'
import {createMemoryHistory, createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import routes from './routes'
import {getToken} from "src/utils/auth.js";
import {whiteList} from "src/permission.js";


export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({left: 0, top: 0}),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

// 每次跳转前都会到这里
  Router.beforeEach((to, from, next) => {
    const hasToken = getToken()

    // console.log("to=>",to,"\nfrom=>",from,"\n next=>",next);

    if (hasToken) {
    // if (true) {

      // 已经有了token不在访问login页面,返回首页
      if (to.path === '/login') {
        next({path: '/'})
        // 权限认证
      } else {
        next()
      }
    } else {
      // 在白名单内
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        // 跳转到login页面,然后带上当前的页面路径
        next({
          path: `/login`,
          query: {redirect: to.path}
        })
      }
    }
  })

  return Router
})

