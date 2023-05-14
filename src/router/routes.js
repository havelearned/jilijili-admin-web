const menuRoutes = [
  {
    path: '/',
    name: "首页",
    meta: {title: "首页", icon: null, path: "/", visible: 1},
    component: () => import('pages/Layout.vue'),
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        name: '控制台',
        meta: {title: "控制台", icon: "jilijili:dashboard", path: "/dashboard", visible: 1},
        component: () => import('pages/dashboard/Index.vue'),
      },
      {
        path: 'user',
        name: "用户管理",
        meta: {title: "用户管理", icon: "jilijili:user", path: null, visible: 1},
        children: [
          {
            path: 'list',
            name: "用户列表",
            meta: {title: "用户列表", icon: "jilijili:userList", path: "/user/list", visible: 1},
            component: () => import('pages/user/list/Index.vue')
          },
          {
            path: 'operation',
            name: "权限管理",
            meta: {title: "权限管理", icon: "jilijili:userPower", path: "/user/operation", visible: 1},
            component: () => import('pages/user/operation/Index.vue')
          }
        ]
      },
      {
        path: '/music',
        name: "音乐管理",
        meta: {title: "音乐管理", icon: "jilijili:music", visible: 1},
        children: [
          {
            path: '/music',
            name: "快速浏览",
            meta: {title: "快速浏览", icon: "jilijili:music", path: "/music", visible: 1},
            component: () => import('pages/music/Index.vue'),
          },
          {
            path: 'singer',
            name: "歌手管理",
            meta: {title: "歌手管理", icon: "jilijili:music", path: "/music/singer", visible: 1},
            component: () => import('pages/music/singer/Index.vue'),
          },
          {
            path: 'alibum',
            name: "专辑管理",
            meta: {title: "专辑管理", icon: "jilijili:music", path: "/music/alibum", visible: 1},
            component: () => import('pages/music/album/Index.vue'),
          },
          {
            path: 'song',
            name: "歌曲管理",
            meta: {title: "歌曲管理", icon: "jilijili:music", path: "/music/song", visible: 1},
            component: () => import('pages/music/song/Index.vue'),
          },
        ]
      },
      {
        path: 'system',
        name: "系统管理",
        meta: {title: "系统管理", icon: "jilijili:system", path: "", visible: 1},
        children: [
          {
            path: 'dictList',
            name: "字典管理",
            meta: {title: "字典管理", icon: "jilijili:fileLibrary", path: "/system/dictList", visible: 1},
            component: () => import('pages/system/dict/Index.vue'),
          },
          {
            path: 'fileLibrary',
            name: "文件记录",
            meta: {title: "文件记录", icon: "jilijili:fileLibrary", path: "/system/fileLibrary", visible: 1},
            component: () => import('pages/fileLibrary/Index.vue'),
          },
          {
            path: 'messageMonitoring',
            name: "消息监控",
            meta: {title: "消息监控", icon: "jilijili:system", path: "/system/messageMonitoring", visible: 1},
            component: () => import('pages/messageMonitoring/Index.vue')
          },
          {
            path: 'logging',
            name: "日志记录",
            meta: {title: "日志记录", icon: "jilijili:system", path: "/system/logging", visible: 1},
            component: () => import('pages/system/logging/Index.vue'),
          },
          {
            path: 'serverSetting',
            name: "系统设置",
            meta: {title: "系统设置", icon: "jilijili:system", path: "/system/serverSetting", visible: 1},
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
