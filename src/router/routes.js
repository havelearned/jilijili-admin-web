const routes = [
  {
    path: '/',
    component: () => import('pages/Layout.vue'),
    redirect: 'index',
    children: [{
      path: 'index',
      component: () => import('pages/index/Index.vue'),
    }],
  },
  {
    path: '/login',
    component:() =>import('pages/Login.vue'),

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
