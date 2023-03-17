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
      meta: {title: "控制台", icon: "jilijili:dashboard", path: "/dashboard"},
      component: () => import('pages/dashboard/Index.vue'),
    },
      {
        path: 'user',
        name: "user",
        meta: {title: "用户管理", icon: "jilijili:user", path: null},
        children: [
          {
          path: 'list',
          name: "list",
          meta: {title: "用户列表", icon: "jilijili:userList", path: "/user/list"},
          component: () => import('pages/user/list/Index.vue')
        },
          {
            path: 'operation',
            name: "权限管理",
            meta: {title: "权限管理", icon: "jilijili:userPower", path: "/user/operation"},
            component: () => import('pages/user/operation/Index.vue')
          }
        ]
      },
      {
        path: 'music',
        name: "music",
        meta: {title: "音乐管理", icon: "jilijili:music", path: "/music"},
        component:()=> import('pages/music/Index.vue')
      },
      {
        path: 'fileLibrary',
        name: "fileLibrary",
        meta: {title: "文件库管理", icon: "jilijili:fileLibrary", path: "/fileLibrary"},
        component:()=> import('pages/fileLibrary/Index.vue')
      },
      {
        path: 'system',
        name: "system",
        meta: {title: "系统管理", icon: "jilijili:system", path: "/system"},
        component:()=> import('pages/system/Index.vue')
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
