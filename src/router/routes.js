const menuRoutes = [
  {
    path: '/',
    name: "首页",
    meta: {title: "首页", icon: "", path: "/"},
    component: () => import('pages/Layout.vue'),
    redirect: 'dashboard',
    children: [
      {
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
        path: '/music',
        name: "music",
        meta: {title: "音乐管理", icon: "jilijili:music", path: "/music"},
        // component:()=> import('pages/music/Index.vue'),
        children: [
          {
            path: '/music',
            name: "快速浏览",
            meta: {title: "快速浏览", icon: "jilijili:music", path: "/music"},
            component: () => import('pages/music/Index.vue'),
          },
          {
            path: '/singer',
            name: "歌手管理",
            meta: {title: "歌手管理", icon: "jilijili:music", path: "singer"},
            component: () => import('pages/music/singer/Index.vue'),
          },
          {
            path: '/alibum',
            name: "专辑管理",
            meta: {title: "专辑管理", icon: "jilijili:music", path: "alibum"},
            component: () => import('pages/music/album/Index.vue'),
          },
          {
            path: '/song',
            name: "歌曲管理",
            meta: {title: "歌曲管理", icon: "jilijili:music", path: "/song"},
            component: () => import('pages/music/song/Index.vue'),
          },
        ]
      },
      {
        path: 'fileLibrary',
        name: "fileLibrary",
        meta: {title: "文件库管理", icon: "jilijili:fileLibrary", path: "/fileLibrary"},
        component: () => import('pages/fileLibrary/Index.vue'),
        children: [
          {
            path: '/fileLibrary',
            name: "fileLibrary",
            meta: {title: "文件列表", icon: "jilijili:fileLibrary", path: "/fileLibrary"},
            component: () => import('pages/fileLibrary/Index.vue'),
          },
          ]
      },
      {
        path: 'messageMonitoring',
        name: "messageMonitoring",
        meta: {title: "消息监控", icon: "jilijili:system", path: "/messageMonitoring"},
        component: () => import('pages/messageMonitoring/Index.vue')
      },
      {
        path: 'system',
        name: "system",
        meta: {title: "系统管理", icon: "jilijili:system", path: "/system"},

        children:[
          {
            path: '/logging',
            name: "日志记录",
            meta: {title: "日志记录", icon: "jilijili:system", path: "/logging"},
            component: () => import('pages/system/logging/Index.vue'),
          },
          {
            path: '/serverSetting',
            name: "服务器设置",
            meta: {title: "服务器设置", icon: "jilijili:system", path: "/serverSetting"},
            component: () => import('pages/system/serverSetting/Index.vue'),
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
