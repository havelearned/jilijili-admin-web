const menuRoutes = [
  {
    path: '/',
    name: "首页",
    meta: {title: "首页", icon: "", path: "/"},
    component: () => import('pages/Layout.vue'),
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      meta: {title: "控制台", icon: "", path: "/dashboard"},
      component: () => import('pages/dashboard/Index.vue'),
    },
      {
        path: 'user',
        name: "user",
        meta: {title: "用户管理", icon: "", path: "/user"},
        children: [{
          path: 'list',
          name: "list",
          meta: {title: "用户列表", icon: "", path: "/list"},
          component: () => import('pages/user/list/Index.vue')
          },
          {
            path: 'operation',
            name: "operation",
            meta: {title: "用户列表", icon: "", path: "/operation"},
            component: () => import('pages/user/operation/Index.vue')
          }
        ]
      }
    ],
  },
]

const routes = [
  ...menuRoutes,
  {
    path: '/login',
    component: () => import('pages/Login.vue'),

  },
  {
    path: '/403',
    component: () => import('pages/403.vue'),

  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/404.vue')
  }
]

export default routes
