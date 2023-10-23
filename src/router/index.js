import {createRouter, createWebHistory} from 'vue-router'
import Cookie from "@/boot/cookie";
import {useNotify} from "@/boot/useNotify";
import {dynamicRoutes} from "@/router/permissions";

const routes = [
    {
        path: '/',
        name:"首页",
        redirect:"/home",
        // component: () => import( '@/layout/home/index.vue'),
        // children: dynamicRoutes
        children: [
            {
                path: '/home',
                name: '首页',
                component: () => import( '@/layout/home/index.vue'),
                children: dynamicRoutes
            },


        ]
    },
    {
        path: '/goods',
        name: 'publish',
        meta:{},
        component: () => import('@/views/shop/goodslist/goods/publish/network.vue')
    },
    {
        path: '/login',
        name: 'login',
        meta:{menuId: 2},
        component: () => import('@/layout/login')
    },
    {
        path: '/loading',
        name: '加载',
        meta:{menuId: 999999},
        component: () => import('@/layout/login/loading.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        meta:{menuId: 3},
        component: () => import('@/layout/404')
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})


const whiteList = ['/login', '/404', '500']
router.beforeEach((to, from, next) => {

    let token = Cookie.getCookies(Cookie.TOKENNAME)
    let menuList = Cookie.getLocalValue(Cookie.MENULIST)

    if (token&&menuList) {
        // 已经有了token不在访问login页面,返回首页
        if (to.path === '/login') {
            next({path: '/'})
        } else {
            next()
        }
    } else {
        // 在白名单内
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            useNotify().warningNotify("登录过期,请重新登录")
            // 跳转到login页面,然后带上当前的页面路径
            next({
                path: `/login`,
                query: {redirect: to.path}
            })
        }

    }
})

export default router
